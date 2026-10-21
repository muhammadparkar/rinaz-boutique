import { getStaff } from "@/lib/staff";

export async function GET() {
	const staff = await getStaff();
	return Response.json({ assigned: Boolean(staff) }, { headers: { "Cache-Control": "no-store" } });
}
