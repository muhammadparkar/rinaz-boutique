import { Suspense } from "react";
import { AdminModule } from "@/components/admin/module";
export default function Page() {
	return (
		<Suspense fallback={<p>Loading workspace…</p>}>
			<AdminModule name="products" />
		</Suspense>
	);
}
