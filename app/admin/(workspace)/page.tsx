import { Suspense } from "react";
import { OperationsWorkspace } from "@/components/admin/operations/workspace";
import { AdminWorkspaceSkeleton } from "@/components/admin/skeleton";

export default function Page() {
	return (
		<Suspense fallback={<AdminWorkspaceSkeleton />}>
			<OperationsWorkspace module="dashboard" />
		</Suspense>
	);
}
