import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { TeamForm } from "@/components/admin/team-form";
import { getDb } from "@/lib/db";
import { staffRoles, users } from "@/lib/db/schema";
import { getStaff } from "@/lib/staff";

export default async function Page() {
	const actor = await getStaff();
	if (actor?.role !== "owner") redirect("/admin");
	const staff = await getDb()
		.select({ name: users.name, email: users.email, role: staffRoles.role })
		.from(staffRoles)
		.innerJoin(users, eq(users.id, staffRoles.userId));
	return (
		<main className="mx-auto max-w-3xl space-y-8 p-6">
			<div>
				<h1 className="text-2xl font-semibold">Team access</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Staff must create an account first. Only owner can assign roles.
				</p>
			</div>
			<TeamForm />
			<ul className="divide-y rounded-lg border">
				{staff.map((member) => (
					<li key={member.email} className="flex justify-between gap-4 p-4 text-sm">
						<span>
							{member.name} <span className="text-muted-foreground">{member.email}</span>
						</span>
						<span className="capitalize">{member.role}</span>
					</li>
				))}
			</ul>
		</main>
	);
}
