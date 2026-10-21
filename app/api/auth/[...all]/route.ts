import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

async function handler(request: Request) {
	if (!process.env.BETTER_AUTH_SECRET || !process.env.DATABASE_URL) {
		return Response.json({ error: "Auth backend is not configured" }, { status: 503 });
	}
	const handlers = toNextJsHandler(getAuth());
	return request.method === "GET" ? handlers.GET(request) : handlers.POST(request);
}

export const GET = handler;
export const POST = handler;
