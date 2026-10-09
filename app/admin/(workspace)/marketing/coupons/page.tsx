import { Suspense } from "react";
import { OperationsWorkspace } from "@/components/admin/operations/workspace";
export default function Page() {
	return (
		<Suspense fallback={<p>Loading demo workflows…</p>}>
			<OperationsWorkspace module="coupons" />
		</Suspense>
	);
}
