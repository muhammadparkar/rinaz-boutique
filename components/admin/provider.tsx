"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { try_ } from "safe-try";
import { toast } from "sonner";
import {
	type Area,
	canEdit,
	type DemoState,
	type Media,
	parseDemoState,
	type Role,
	type Snapshot,
} from "@/lib/admin/model";
import { browserRepository, newDemo } from "@/lib/admin/repository";

type AdminContext = {
	state: DemoState;
	role: Role;
	setRole: (role: Role) => void;
	ready: boolean;
	storageError: string;
	commit: (next: DemoState, message: string, area: Area) => boolean;
	dirty: boolean;
	setDirty: (dirty: boolean) => void;
	reset: () => void;
	importData: (value: unknown) => void;
};
const Context = createContext<AdminContext | null>(null);
export function AdminProvider({
	snapshot,
	media,
	children,
}: {
	snapshot: Snapshot;
	media: Media[];
	children: React.ReactNode;
}) {
	const [state, setState] = useState(() => newDemo(snapshot, media));
	const [role, changeRole] = useState<Role>("Owner");
	const [ready, setReady] = useState(false);
	const [storageError, setStorageError] = useState("");
	const [dirty, setDirty] = useState(false);
	useEffect(() => {
		try {
			const saved = browserRepository.load();
			if (saved) setState(saved);
			else browserRepository.save(newDemo(snapshot, media));
		} catch (error) {
			setStorageError(
				error instanceof Error ? error.message : "Browser storage unavailable. Changes cannot be saved.",
			);
		}
		setReady(true);
	}, [snapshot, media]);
	useEffect(() => {
		if (!dirty) return;
		const before = (event: BeforeUnloadEvent) => {
			event.preventDefault();
		};
		const guard = (event: MouseEvent) => {
			const target = event.target;
			if (
				target instanceof Element &&
				target.closest("a[href]") &&
				!window.confirm("Leave without saving your changes?")
			) {
				event.preventDefault();
				event.stopPropagation();
			} else if (target instanceof Element && target.closest("a[href]")) {
				setDirty(false);
			}
		};
		window.addEventListener("beforeunload", before);
		document.addEventListener("click", guard, true);
		return () => {
			window.removeEventListener("beforeunload", before);
			document.removeEventListener("click", guard, true);
		};
	}, [dirty]);
	const commit = useCallback(
		(next: DemoState, message: string, area: Area) => {
			if (!canEdit(role, area)) {
				toast.error("This demo role cannot make that change.");
				return false;
			}
			if (!ready) return false;
			try {
				const updated = parseDemoState({
					...next,
					activity: [
						{ id: crypto.randomUUID(), role, message, at: new Date().toISOString() },
						...next.activity,
					].slice(0, 100),
				});
				browserRepository.save(updated);
				setState(updated);
				setStorageError("");
				setDirty(false);
				toast.success(message);
				return true;
			} catch (error) {
				const message = error instanceof Error ? error.message : "Unable to save. Check browser storage.";
				setStorageError(message);
				toast.error(message);
				return false;
			}
		},
		[role, ready],
	);
	const reset = async () => {
		if (commit(newDemo(snapshot, media), "Demo reset to original storefront", "administration")) {
			const results = await Promise.all(
				state.media.filter((m) => m.uploaded).map((m) => try_(browserRepository.deleteImage(m.id))),
			);
			if (results.some(([error]) => error))
				toast.error("Demo reset; some unused image blobs could not be removed.");
		}
	};
	const importData = (value: unknown) => {
		try {
			commit(parseDemoState(value), "Demo data imported", "administration");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Invalid import");
		}
	};
	const setRole = (next: Role) => {
		if (dirty && !window.confirm("Discard unsaved edits before switching roles?")) return;
		setDirty(false);
		changeRole(next);
	};
	return (
		<Context.Provider
			value={{ state, role, setRole, ready, storageError, commit, dirty, setDirty, reset, importData }}
		>
			{children}
		</Context.Provider>
	);
}
export function useAdmin() {
	const value = useContext(Context);
	if (!value) throw new Error("AdminProvider is required");
	return value;
}
