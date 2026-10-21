"use server";

import { imageContentType } from "@/lib/admin/media-validation";
import { getDb } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
import { getStaff } from "@/lib/staff";

export async function uploadMedia(form: FormData) {
	try {
		const staff = await getStaff();
		if (!staff || staff.role === "operations") throw new Error("Media access denied");
		const file = form.get("file");
		if (!(file instanceof File) || file.size === 0 || file.size > 768 * 1024)
			throw new Error("Image must be under 768 KB");
		const bytes = new Uint8Array(await file.arrayBuffer());
		const contentType = imageContentType(bytes);
		// shortcut: images live in Postgres for test setup; move bytes to object storage before a large media library.
		const [asset] = await getDb()
			.insert(mediaAssets)
			.values({ contentType, data: Buffer.from(bytes).toString("base64"), createdBy: staff.user.id })
			.returning({ id: mediaAssets.id });
		if (!asset) throw new Error("Upload failed");
		return {
			success: true as const,
			asset: {
				id: asset.id,
				src: `/api/media/${asset.id}`,
				name: file.name.slice(0, 200),
				alt: file.name.replace(/\.[^.]+$/, "").slice(0, 200),
				uploaded: true,
			},
		};
	} catch (error) {
		return { success: false as const, error: error instanceof Error ? error.message : "Upload failed" };
	}
}
