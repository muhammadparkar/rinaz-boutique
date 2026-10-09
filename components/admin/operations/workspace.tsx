"use client";
import { useEffect, useState } from "react";
import { Dashboard as CatalogDashboard } from "../dashboard";
import { useAdmin } from "../provider";
import { syncWorkflowCatalog } from "./catalog-bridge";
import { Analytics } from "./pages/Analytics";
import { Appointments } from "./pages/Appointments";
import { Coupons } from "./pages/Coupons";
import { Customers } from "./pages/Customers";
import { Dashboard } from "./pages/Dashboard";
import { Discounts } from "./pages/Discounts";
import { OrderDetail } from "./pages/OrderDetail";
import { Orders } from "./pages/Orders";
import { Payments } from "./pages/Payments";
import { Promotions } from "./pages/Promotions";
import { Reviews } from "./pages/Reviews";
import { Settings } from "./pages/Settings";
import { connectOperationsStorage } from "./persistence";
import { RouteParams } from "./router";

const modules = {
	dashboard: Dashboard,
	orders: Orders,
	payments: Payments,
	customers: Customers,
	appointments: Appointments,
	coupons: Coupons,
	discounts: Discounts,
	promotions: Promotions,
	reviews: Reviews,
	analytics: Analytics,
	settings: Settings,
};
export type Workflow = keyof typeof modules;
export function OperationsStorage() {
	const [error, setError] = useState("");
	const { state, ready } = useAdmin();
	useEffect(() => {
		if (ready) syncWorkflowCatalog(state.draft, state.threshold);
	}, [state.draft, state.threshold, ready]);
	useEffect(() => {
		try {
			return connectOperationsStorage(window.localStorage, setError);
		} catch {
			setError("Browser storage unavailable. Workflow edits cannot be saved.");
		}
	}, []);
	return error ? (
		<p role="alert" className="border-b bg-secondary px-4 py-3 text-sm">
			{error}
		</p>
	) : null;
}
export function OperationsWorkspace({ module, id, tab }: { module: Workflow; id?: string; tab?: string }) {
	const { role } = useAdmin();
	const Component = modules[module];
	if (module === "dashboard" && role !== "Owner" && role !== "Operations") return <CatalogDashboard />;
	if (role !== "Owner" && role !== "Operations")
		return <p className="py-8">Switch to Owner or Operations to access demo workflows.</p>;
	if (module === "settings" && role !== "Owner")
		return <p className="py-8">Only Owner can change demo settings.</p>;
	return (
		<div className="operations-content text-ops-ink">
			<p
				role="status"
				className="workflow-demo-note mb-6 rounded-lg border border-border/60 bg-muted/50 px-4 py-2.5 text-xs text-muted-foreground leading-relaxed"
			>
				Sample workflows — saved in this browser. Refunds, messages, bookings, and settings simulate changes
				only; no backend calls or money transfers.
			</p>
			<RouteParams value={{ id: id ?? "", tab: tab ?? "store" }}>
				<div key={`${module}-${id}-${tab}`}>
					<ComponentSwitch component={Component} module={module} id={id} />
				</div>
			</RouteParams>
		</div>
	);
}
function ComponentSwitch({
	component: Component,
	module,
	id,
}: {
	component: (typeof modules)[Workflow];
	module: Workflow;
	id?: string;
}) {
	return module === "orders" && id ? <OrderDetail /> : <Component />;
}
