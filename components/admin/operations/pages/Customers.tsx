import { ChatCircleText, DownloadSimple, EnvelopeSimple, Prohibit, Users } from "@phosphor-icons/react";
import { useCallback, useMemo, useState } from "react";
import { Link, useSearchParams } from "@/components/admin/operations/router";
import {
	Avatar,
	Badge,
	Button,
	Confirm,
	Drawer,
	EmptyState,
	KeyValue,
	PageHeader,
	Pagination,
	Ref,
	SearchInput,
	Select,
	StatusBadge,
	Tabs,
	Textarea,
	Toggle,
	td,
	th,
	tr,
} from "../components/ui";
import { ago, date, downloadCsv, money } from "../lib/format";
import { useStore } from "../lib/store";

type Seg = "all" | "new" | "repeat" | "private" | "vip" | "blocked";
const PAGE = 20;

export function Customers() {
	const customers = useStore((s) => s.customers);
	const orders = useStore((s) => s.orders);
	const setStatus = useStore((s) => s.setCustomerStatus);
	const updateCustomer = useStore((s) => s.updateCustomer);
	const toast = useStore((s) => s.toast);
	const [params, setParams] = useSearchParams();
	const openId = params.get("c");
	const [seg, setSeg] = useState<Seg>("all");
	const [q, setQ] = useState("");
	const [country, setCountry] = useState("any");
	const [sort, setSort] = useState("spent");
	const [page, setPage] = useState(1);
	const [confirmBlock, setConfirmBlock] = useState(false);

	const stats = useMemo(() => {
		const m = new Map<string, { orders: number; spent: number; last: number }>();
		for (const o of orders) {
			const s = m.get(o.customerId) ?? { orders: 0, spent: 0, last: 0 };
			s.orders++;
			if (o.status !== "cancelled" && o.paymentStatus !== "failed")
				s.spent += o.total - (o.status === "refunded" ? o.total : 0);
			s.last = Math.max(s.last, o.createdAt);
			m.set(o.customerId, s);
		}
		return m;
	}, [orders]);
	const st = useCallback((id: string) => stats.get(id) ?? { orders: 0, spent: 0, last: 0 }, [stats]);
	const countries = useMemo(() => [...new Set(customers.map((c) => c.country))].sort(), [customers]);

	const inSeg = useCallback(
		(c: (typeof customers)[number], s: Seg) => {
			if (s === "new") return c.joinedAt > Date.now() - 30 * 86_400_000;
			if (s === "repeat") return st(c.id).orders > 1;
			if (s === "private") return c.privateClient;
			if (s === "vip") return st(c.id).spent >= 5000;
			if (s === "blocked") return c.status === "blocked";
			return true;
		},
		[st],
	);

	const rows = useMemo(() => {
		const t = q.trim().toLowerCase();
		const r = customers.filter(
			(c) =>
				inSeg(c, seg) &&
				(country === "any" || c.country === country) &&
				(!t ||
					c.name.toLowerCase().includes(t) ||
					c.email.includes(t) ||
					c.phone.replace(/\s/g, "").includes(t.replace(/\s/g, "")) ||
					c.city.toLowerCase().includes(t)),
		);
		return r.sort((a, b) =>
			sort === "spent"
				? st(b.id).spent - st(a.id).spent
				: sort === "orders"
					? st(b.id).orders - st(a.id).orders
					: sort === "recent"
						? st(b.id).last - st(a.id).last
						: b.joinedAt - a.joinedAt,
		);
	}, [customers, seg, q, sort, country, st, inSeg]);

	const open = customers.find((c) => c.id === openId);
	const openOrders = orders.filter((o) => o.customerId === openId);
	const openStats = open ? st(open.id) : null;

	return (
		<>
			<PageHeader
				title="Customers"
				actions={
					<Button
						icon={DownloadSimple}
						onClick={() => {
							downloadCsv("rinaz-customers.csv", [
								[
									"Name",
									"Email",
									"Phone",
									"City",
									"Country",
									"Orders",
									"Total spent",
									"Joined",
									"Private client",
									"Marketing",
								],
								...rows.map((c) => [
									c.name,
									c.email,
									c.phone,
									c.city,
									c.country,
									st(c.id).orders,
									st(c.id).spent,
									new Date(c.joinedAt).toISOString().slice(0, 10),
									c.privateClient ? "yes" : "no",
									c.marketing ? "yes" : "no",
								]),
							]);
							toast(`Exported ${rows.length} customers`, "info");
						}}
					>
						Export CSV
					</Button>
				}
			/>
			<div className="rounded-lg border border-ops-line bg-ops-surface">
				<div className="px-4">
					<Tabs
						value={seg}
						onChange={(v) => {
							setSeg(v);
							setPage(1);
						}}
						items={[
							{ value: "all", label: "All", count: customers.length },
							{
								value: "private",
								label: "Private clients",
								count: customers.filter((c) => inSeg(c, "private")).length,
							},
							{
								value: "repeat",
								label: "Repeat buyers",
								count: customers.filter((c) => inSeg(c, "repeat")).length,
							},
							{ value: "vip", label: "Spent $5k+", count: customers.filter((c) => inSeg(c, "vip")).length },
							{ value: "new", label: "New, 30 days", count: customers.filter((c) => inSeg(c, "new")).length },
							{
								value: "blocked",
								label: "Blocked",
								count: customers.filter((c) => c.status === "blocked").length,
							},
						]}
					/>
				</div>
				<div className="flex flex-wrap gap-2 border-t border-ops-line px-4 py-3">
					<SearchInput
						value={q}
						onChange={(v) => {
							setQ(v);
							setPage(1);
						}}
						placeholder="Name, email, phone or city"
						className="w-full sm:w-72"
					/>
					<Select
						aria-label="Country"
						value={country}
						onChange={(e) => {
							setCountry(e.target.value);
							setPage(1);
						}}
						className="w-auto"
					>
						<option value="any">All countries</option>
						{countries.map((c) => (
							<option key={c}>{c}</option>
						))}
					</Select>
					<Select
						aria-label="Sort"
						value={sort}
						onChange={(e) => setSort(e.target.value)}
						className="w-auto sm:ml-auto"
					>
						<option value="spent">Most spent</option>
						<option value="orders">Most orders</option>
						<option value="recent">Last order</option>
						<option value="joined">Newest</option>
					</Select>
				</div>
				{rows.length === 0 ? (
					<div className="border-t border-ops-line">
						<EmptyState
							icon={Users}
							title="No customers found"
							body="Nobody matches this search or segment."
						/>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[820px]">
							<thead>
								<tr className="border-t border-ops-line bg-ops-surface-2">
									<th className={th}>Client</th>
									<th className={th}>Location</th>
									<th className={th + " text-right"}>Orders</th>
									<th className={th + " text-right"}>Total spent</th>
									<th className={th}>Last order</th>
									<th className={th}></th>
								</tr>
							</thead>
							<tbody>
								{rows.slice((page - 1) * PAGE, page * PAGE).map((c) => {
									const s = st(c.id);
									return (
										<tr key={c.id} className={tr}>
											<td className={td}>
												<div className="flex items-center gap-2.5">
													<Avatar name={c.name} size={30} />
													<div className="min-w-0">
														<button
															type="button"
															className="min-h-6 truncate text-left font-medium hover:text-ops-info"
															onClick={() => setParams({ c: c.id })}
														>
															{c.name}
														</button>
														<div className="truncate text-[12px] text-ops-muted">{c.email}</div>
													</div>
												</div>
											</td>
											<td className={td + " text-ops-muted"}>
												{c.city}, {c.country}
											</td>
											<td className={td + " ops-num text-right"}>{s.orders}</td>
											<td className={td + " ops-num text-right font-medium"}>{money(s.spent)}</td>
											<td className={td + " whitespace-nowrap text-ops-muted"}>
												{s.last ? ago(s.last) : "Never"}
											</td>
											<td className={td}>
												<div className="flex gap-1.5">
													{c.status === "blocked" && <StatusBadge status="blocked" />}
													{c.privateClient && <Badge tone="ink">Private client</Badge>}
													{Object.keys(c.measurements).length > 0 && <Badge mark={false}>Measured</Badge>}
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
				<Pagination page={page} pageSize={PAGE} total={rows.length} onPage={setPage} />
			</div>

			<Drawer
				open={!!open}
				onClose={() => setParams({})}
				title="Client"
				width={580}
				footer={
					open && (
						<>
							<Button
								variant="ghost"
								icon={Prohibit}
								className={open.status === "blocked" ? "mr-auto" : "mr-auto text-ops-bad"}
								onClick={() => {
									if (open.status === "blocked") {
										setStatus(open.id, "active");
										toast(`${open.name} unblocked`);
									} else setConfirmBlock(true);
								}}
							>
								{open.status === "blocked" ? "Unblock" : "Block"}
							</Button>
							<Button
								icon={ChatCircleText}
								onClick={() => toast("Demo only: no WhatsApp message was sent", "info")}
							>
								WhatsApp demo
							</Button>
							<a href={`mailto:${open.email}`}>
								<Button variant="primary" icon={EnvelopeSimple}>
									Email
								</Button>
							</a>
						</>
					)
				}
			>
				{open && openStats && (
					<div className="flex flex-col gap-6">
						<div className="flex items-center gap-3">
							<Avatar name={open.name} size={46} />
							<div className="min-w-0">
								<div className="flex flex-wrap items-center gap-2">
									<span className="text-[17px] font-semibold">{open.name}</span>
									{open.status === "blocked" && <StatusBadge status="blocked" />}
								</div>
								<div className="text-[12.5px] text-ops-muted">
									{open.city}, {open.country} · client since {date(open.joinedAt)}
								</div>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ops-line bg-ops-line">
							{[
								["Orders", String(openStats.orders)],
								["Total spent", money(openStats.spent)],
							].map(([k, v]) => (
								<div key={k} className="bg-ops-surface p-3">
									<div className="text-[11.5px] text-ops-muted">{k}</div>
									<div className="ops-num mt-0.5 text-[16px] font-medium">{v}</div>
								</div>
							))}
						</div>
						<KeyValue
							items={[
								[
									"Email",
									<a
										key="Email"
										href={`mailto:${open.email}`}
										className="underline decoration-ops-line-strong underline-offset-2"
									>
										{open.email}
									</a>,
								],
								[
									"Phone",
									<span key="Phone" className="ops-num">
										{open.phone}
									</span>,
								],
								[
									"Address",
									`${open.addresses[0]?.line1}, ${open.addresses[0]?.city}, ${open.addresses[0]?.country}`,
								],
							]}
						/>
						<div className="flex flex-col gap-3 rounded-lg border border-ops-line p-3">
							<div className="flex items-center justify-between gap-3 text-[13px]">
								Private client register
								<Toggle
									label="Private client"
									checked={open.privateClient}
									onChange={(v) => {
										updateCustomer({ ...open, privateClient: v });
										toast(
											v
												? `${open.name} added to private clients`
												: `${open.name} removed from private clients`,
										);
									}}
								/>
							</div>
							<div className="flex items-center justify-between gap-3 text-[13px]">
								Marketing emails and WhatsApp
								<Toggle
									label="Marketing consent"
									checked={open.marketing}
									onChange={(v) => updateCustomer({ ...open, marketing: v })}
								/>
							</div>
						</div>
						{Object.keys(open.measurements).length > 0 && (
							<div>
								<h3 className="mb-2 text-[13.5px] font-semibold">Measurements</h3>
								<div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-ops-line bg-ops-line text-[12.5px]">
									{Object.entries(open.measurements).map(([k, v]) => (
										<div key={k} className="bg-ops-surface px-3 py-2">
											<div className="text-ops-muted">{k}</div>
											<div className="ops-num">{v}</div>
										</div>
									))}
								</div>
							</div>
						)}
						<div>
							<h3 className="mb-2 text-[13.5px] font-semibold">Notes</h3>
							<Textarea
								aria-label="Client notes"
								defaultValue={open.note}
								onBlur={(e) => {
									if (e.target.value !== open.note) {
										updateCustomer({ ...open, note: e.target.value });
										toast("Note saved");
									}
								}}
								placeholder="Preferences, sizes, occasions. Staff only."
								className="min-h-16"
							/>
						</div>
						<div>
							<h3 className="mb-2 text-[13.5px] font-semibold">Order history</h3>
							{openOrders.length === 0 ? (
								<p className="text-[13px] text-ops-muted">No orders yet.</p>
							) : (
								<ul className="overflow-hidden rounded-lg border border-ops-line">
									{openOrders.map((o) => (
										<li key={o.id} className="border-t border-ops-line first:border-0">
											<Link
												to={`/orders/${o.id}`}
												className="flex items-center gap-3 px-3 py-2.5 text-[13px] hover:bg-ops-surface-2"
											>
												<Ref>{o.number}</Ref>
												<span className="text-ops-muted">{date(o.createdAt)}</span>
												<span className="ml-auto">
													<StatusBadge status={o.status} />
												</span>
												<span className="ops-num w-20 text-right">{money(o.total)}</span>
											</Link>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				)}
			</Drawer>

			<Confirm
				open={confirmBlock}
				onClose={() => setConfirmBlock(false)}
				onConfirm={() => {
					if (open) {
						setStatus(open.id, "blocked");
						toast(`${open.name} blocked`);
					}
				}}
				title={`Block ${open?.name}?`}
				body="They will not be able to sign in or place orders. Existing orders are not affected."
				confirmLabel="Block"
				danger
			/>
		</>
	);
}
