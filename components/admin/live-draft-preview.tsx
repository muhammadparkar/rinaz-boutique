"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Monitor, RefreshCw, RotateCw, Smartphone } from "@/components/admin/preset-icons";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import type { Snapshot } from "@/lib/admin/model";
import { previewScale, previewViewport } from "@/lib/admin/preview-viewport";
import { type EditorMessage, isEditorMessage } from "@/lib/admin/visual-editor";

export function LiveDraftPreview({
	snapshot,
	path,
	focusId,
	slideId,
	mode = "draft",
	editable = false,
	onEditorMessage,
}: {
	snapshot: Snapshot;
	path: string;
	focusId: string;
	slideId: string;
	mode?: "draft" | "published";
	editable?: boolean;
	onEditorMessage?: (message: EditorMessage) => void;
}) {
	const frame = useRef<HTMLIFrameElement>(null);
	const container = useRef<HTMLDivElement>(null);
	const [mobile, setMobile] = useState(false);
	const [rotated, setRotated] = useState(false);
	const [editing, setEditing] = useState(true);
	const [revision, setRevision] = useState(0);
	const [size, setSize] = useState({ width: 390, height: 500 });
	const viewport = previewViewport(mobile, rotated);
	const { width, height } = viewport;
	const scale = previewScale(size, viewport);
	const send = useCallback(
		() =>
			frame.current?.contentWindow?.postMessage(
				{
					type: "rinaz-draft-preview",
					snapshot,
					path,
					focusId,
					slideId,
					editing: editable && editing,
					editorScale: scale,
				},
				window.location.origin,
			),
		[snapshot, path, focusId, slideId, editable, editing, scale],
	);
	useEffect(() => {
		send();

		const ready = (event: MessageEvent) => {
			if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
			if (event.data?.type === "rinaz-preview-ready") send();
			else if (editable && editing && isEditorMessage(event.data)) onEditorMessage?.(event.data);
		};

		window.addEventListener("message", ready);
		return () => window.removeEventListener("message", ready);
	}, [send, editable, editing, onEditorMessage]);
	useEffect(() => {
		const element = container.current;
		if (!element) return;
		const observer = new ResizeObserver((entries) => {
			const box = entries[0]?.contentRect;
			if (box) setSize({ width: box.width, height: box.height });
		});
		observer.observe(element);
		return () => observer.disconnect();
	}, []);
	return (
		<aside
			aria-label={mode === "draft" ? "Live draft preview" : "Published website preview"}
			className="min-w-0"
		>
			<div className="flex flex-wrap items-center justify-between gap-3 py-3">
				<div>
					<h2 className="font-sans text-sm font-semibold">
						{mode === "draft" ? "Live preview" : "Website preview"}
					</h2>
					<p className="mt-1 text-[11px] text-muted-foreground">
						{mode === "draft"
							? editable && editing
								? "Click a heading, image, or CTA to edit."
								: "Changes appear as you type. Nothing is published."
							: "Your last demo-published snapshot."}
					</p>
				</div>
				<div className="flex flex-wrap gap-1">
					{editable && (
						<Button
							size="sm"
							variant={editing ? "secondary" : "outline"}
							aria-label={editing ? "Edit preview content" : "Browse preview content"}
							aria-pressed={editing}
							onClick={() => setEditing(!editing)}
						>
							{editing ? "Edit" : "Browse"}
						</Button>
					)}
					<Button
						variant={mobile ? "ghost" : "secondary"}
						size="icon-sm"
						aria-label="Live desktop preview"
						aria-pressed={!mobile}
						onClick={() => setMobile(false)}
					>
						<Monitor />
					</Button>
					<Button
						variant={mobile ? "secondary" : "ghost"}
						size="icon-sm"
						aria-label="Live mobile preview"
						aria-pressed={mobile}
						onClick={() => setMobile(true)}
					>
						<Smartphone />
					</Button>

					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Rotate preview"
						title="Rotate portrait / landscape"
						aria-pressed={rotated}
						onClick={() => setRotated(!rotated)}
					>
						<RotateCw />
					</Button>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Refresh preview"
						title="Refresh preview"
						onClick={() => setRevision(revision + 1)}
					>
						<RefreshCw />
					</Button>
				</div>
			</div>
			<div className="flex items-center justify-between gap-2 py-2">
				<span className="text-[11px] text-muted-foreground">{path === "/" ? "Homepage" : path}</span>
				<span className="text-[11px] tabular-nums text-muted-foreground">
					{width} × {height} · {width > height ? "Landscape" : "Portrait"}
				</span>
				<Badge variant="outline">{mode === "draft" ? "Draft" : "Published"}</Badge>
			</div>
			<div
				ref={container}
				className={`relative w-full overflow-hidden ${mobile ? "h-[75vh] min-h-80 max-h-[900px]" : ""}`}
				style={mobile ? undefined : { aspectRatio: `${width} / ${height}` }}
			>
				<iframe
					key={revision}
					ref={frame}
					title={mode === "draft" ? "Live website content draft" : "RINAZ storefront demo preview"}
					src="/admin/preview/frame"
					onLoad={send}
					className="absolute border-0 bg-background"
					style={{
						width,
						height,
						top: mobile ? Math.max(0, (size.height - height * scale) / 2) : 0,
						left: Math.max(0, (size.width - width * scale) / 2),
						transform: `scale(${scale})`,
						transformOrigin: "top left",
					}}
				/>
			</div>
		</aside>
	);
}
