"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveWorkspace } from "@/app/admin/workspace-actions";
import {
	type Area,
	canEdit,
	type DemoState,
	type Media,
	parseDemoState,
	type Role,
	type Snapshot,
} from "@/lib/admin/model";
import { newDemo } from "@/lib/admin/repository";
import { resetOperations } from "./operations/persistence";

type AdminContext = {
	state: DemoState;
	role: Role;
	ready: boolean;
	storageError: string;
	commit: (next: DemoState, message: string, area: Area) => Promise<boolean>;
	dirty: boolean;
	setDirty: (dirty: boolean) => void;
	reset: () => void;
	importData: (value: unknown) => void;
};
const Context = createContext<AdminContext | null>(null);
export function AdminProvider({
	snapshot,
	media,
	role,
	workspace,
	children,
}: {
	snapshot: Snapshot;
	media: Media[];
	role: Role;
	workspace: { state: DemoState; revision: number };
	children: React.ReactNode;
}) {
	const [state, setState] = useState(workspace.state);
	const [revision, setRevision] = useState(workspace.revision);
	const [ready, setReady] = useState(true);
	const saving = useRef(false);
	const [storageError, setStorageError] = useState("");
	const [dirty, setDirty] = useState(false);
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
		async (next: DemoState, message: string, area: Area) => {
			if (!canEdit(role, area)) {
				toast.error("Your staff role cannot make that change.");
				return false;
			}
			if (saving.current) {
				toast.error("Wait for the current save to finish.");
				return false;
			}
			saving.current = true;
			setReady(false);
			try {
				const result = await saveWorkspace(parseDemoState(next), revision, message, area);
				if (!result.success) throw new Error(result.error);
				setState(result.state);
				setRevision(result.revision);
				setStorageError("");
				setDirty(false);
				toast.success(message);
				return true;
			} catch (error) {
				const message = error instanceof Error ? error.message : "Unable to save workspace.";
				setStorageError(message);
				toast.error(message);
				return false;
			} finally {
				saving.current = false;
				setReady(true);
			}
		},
		[role, revision],
	);
	const reset = async () => {
		if (await commit(newDemo(snapshot, media), "Workspace reset to original storefront", "administration")) {
			resetOperations();
		}
	};
	const importData = (value: unknown) => {
		try {
			commit(parseDemoState(value), "Demo data imported", "administration");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Invalid import");
		}
	};
	return (
		<Context.Provider
			value={{ state, role, ready, storageError, commit, dirty, setDirty, reset, importData }}
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
