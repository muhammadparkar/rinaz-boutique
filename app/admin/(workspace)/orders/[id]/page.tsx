import { Suspense } from "react";
import { OperationsWorkspace } from "@/components/admin/operations/workspace";

async function Content({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <OperationsWorkspace module="orders" id={id} />;
}
export default function Page(props: { params: Promise<{ id: string }> }) {
	return (
		<Suspense fallback={<p>Loading demo workflows…</p>}>
			<Content {...props} />
		</Suspense>
	);
}
