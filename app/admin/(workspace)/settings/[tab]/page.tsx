import { Suspense } from "react";
import { OperationsWorkspace } from "@/components/admin/operations/workspace";

async function Content({ params }: { params: Promise<{ tab: string }> }) {
	const { tab } = await params;
	return <OperationsWorkspace module="settings" tab={tab} />;
}
export default function Page(props: { params: Promise<{ tab: string }> }) {
	return (
		<Suspense fallback={<p>Loading demo workflows…</p>}>
			<Content {...props} />
		</Suspense>
	);
}
