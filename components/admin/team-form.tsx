"use client";

import { useActionState } from "react";
import { assignStaffRole } from "@/app/admin/(workspace)/team/actions";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";

export function TeamForm() {
	const [state, action, pending] = useActionState(assignStaffRole, null);
	return (
		<form action={action} className="space-y-4 rounded-lg border p-4">
			<div className="flex flex-wrap items-end gap-3">
				<label className="grid gap-1 text-sm" htmlFor="staff-email">
					Account email
					<Input id="staff-email" name="email" type="email" required disabled={pending} />
				</label>
				<label className="grid gap-1 text-sm" htmlFor="staff-role">
					Role
					<select
						id="staff-role"
						name="role"
						disabled={pending}
						className="min-h-10 rounded-md border bg-background px-3"
					>
						<option value="editor">Editor</option>
						<option value="catalog">Catalog manager</option>
						<option value="operations">Operations</option>
						<option value="owner">Owner</option>
						<option value="none">Remove staff access</option>
					</select>
				</label>
				<Button type="submit" disabled={pending}>
					{pending ? "Saving…" : "Assign role"}
				</Button>
			</div>
			{state && (
				<p
					role={state.success ? "status" : "alert"}
					className={state.success ? "text-sm" : "text-sm text-destructive"}
				>
					{state.message}
				</p>
			)}
		</form>
	);
}
