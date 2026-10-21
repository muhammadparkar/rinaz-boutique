import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
		return new Response(null, { status: 404 });
	const [asset] = await getDb()
		.select({ data: mediaAssets.data, contentType: mediaAssets.contentType })
		.from(mediaAssets)
		.where(eq(mediaAssets.id, id));
	if (!asset) return new Response(null, { status: 404 });
	return new Response(Buffer.from(asset.data, "base64"), {
		headers: {
			"Content-Type": asset.contentType,
			"Cache-Control": "public, max-age=31536000, immutable",
			"X-Content-Type-Options": "nosniff",
		},
	});
}
