import {
	ArrowCounterClockwise,
	CheckCircle,
	Copy,
	FileText,
	Gift,
	Package as PackageIcon,
	Printer,
	Receipt,
	Truck,
	XCircle,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Link, useParams } from "@/components/admin/operations/router";
import {
	Avatar,
	Badge,
	Button,
	Confirm,
	Drawer,
	EmptyState,
	Field,
	Input,
	KeyValue,
	Modal,
	PageHeader,
	Panel,
	Ref,
	Select,
	StageTape,
	StatusBadge,
	Textarea,
	Thumb,
} from "../components/ui";
import { date, money } from "../lib/format";
import { STAGES, stageOf } from "../lib/orders";
import { useStore } from "../lib/store";
import { RefundModal } from "./Payments";

export function OrderDetail() {
	const { id } = useParams();
	const order = useStore((s) => s.orders.find((o) => o.id === id));
	const customer = useStore((s) => s.customers.find((c) => c.id === order?.customerId));
	const txn = useStore((s) => s.transactions.find((t) => t.orderId === id));
	const customerOrders = useStore(
		useShallow((s) => s.orders.filter((o) => o.customerId === order?.customerId)),
	);
	const carriers = useStore(useShallow((s) => s.settings.carriers.filter((c) => c.enabled)));
	const settings = useStore((s) => s.settings);
	const setOrderStatus = useStore((s) => s.setOrderStatus);
	const addNote = useStore((s) => s.addOrderNote);
	const toast = useStore((s) => s.toast);

	const [shipOpen, setShipOpen] = useState(false);
	const [carrier, setCarrier] = useState(order?.address.country === "Pakistan" ? "TCS" : "DHL Express");
	const [awb, setAwb] = useState("");
	const [awbErr, setAwbErr] = useState("");
	const [cancelOpen, setCancelOpen] = useState(false);
	const [refundOpen, setRefundOpen] = useState(false);
	const [invoiceOpen, setInvoiceOpen] = useState(false);
	const [note, setNote] = useState(order?.note ?? "");

	if (!order) {
		return (
			<EmptyState
				icon={Receipt}
				title="Order not found"
				body="It may have been removed, or the link is wrong."
				action={
					<Link to="/orders">
						<Button>Back to orders</Button>
					</Link>
				}
			/>
		);
	}

	const st = stageOf(order);
	const spent = customerOrders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
	const canRefund = txn && (txn.status === "captured" || txn.status === "partial_refund");
	const tax =
		settings.taxRegions.find((t) => t.region === order.address.country) ??
		settings.taxRegions.find((t) => t.region === "Rest of world");

	const primary = (() => {
		switch (order.status) {
			case "pending":
				return (
					<Button
						variant="primary"
						icon={CheckCircle}
						onClick={() => {
							setOrderStatus([order.id], "processing");
							toast("Order confirmed and sent to packing");
						}}
					>
						Confirm order
					</Button>
				);
			case "processing":
				return (
					<Button variant="primary" icon={Truck} onClick={() => setShipOpen(true)}>
						Ship order
					</Button>
				);
			case "shipped":
				return (
					<Button
						variant="primary"
						icon={PackageIcon}
						onClick={() => {
							setOrderStatus([order.id], "delivered");
							toast("Marked as delivered");
						}}
					>
						Mark delivered
					</Button>
				);
			default:
				return null;
		}
	})();

	const ship = () => {
		if (!/^[A-Z0-9]{8,20}$/i.test(awb.trim())) {
			setAwbErr("Enter the waybill number from the courier, 8 to 20 letters or digits.");
			return;
		}
		setOrderStatus([order.id], "shipped", { carrier, tracking: awb.trim().toUpperCase() });
		toast(`Shipped with ${carrier}. Demo updated; no notification sent.`);
		setShipOpen(false);
	};

	return (
		<>
			<PageHeader
				back={{ to: "/orders", label: "Orders" }}
				title={
					<span className="ops-num font-sans text-[24px] font-semibold tracking-[-0.02em]">
						{order.number}
					</span>
				}
				meta={
					<>
						<StatusBadge status={order.status} />
						<StatusBadge status={order.paymentStatus} />
					</>
				}
				description={`Placed ${date(order.createdAt, true)} on the storefront`}
				actions={
					<>
						<Button icon={Printer} onClick={() => setInvoiceOpen(true)}>
							Invoice
						</Button>
						{canRefund && (
							<Button icon={ArrowCounterClockwise} onClick={() => setRefundOpen(true)}>
								Refund
							</Button>
						)}
						{["pending", "processing"].includes(order.status) && (
							<Button
								icon={XCircle}
								variant="ghost"
								className="text-ops-bad"
								onClick={() => setCancelOpen(true)}
							>
								Cancel
							</Button>
						)}
						{primary}
					</>
				}
			/>

			<section className="mb-4 rounded-lg border border-ops-line bg-ops-surface px-5 py-4">
				<StageTape stages={STAGES} at={st.at} broken={st.broken} />
				{st.broken && (
					<p className="mt-2 text-[12.5px] text-ops-bad">
						{order.status === "refunded" ? "This order was refunded." : "This order was cancelled."}
					</p>
				)}
			</section>

			<div className="grid gap-4 lg:grid-cols-[1fr_340px]">
				<div className="flex min-w-0 flex-col gap-4">
					<Panel
						title={`Pieces (${order.items.reduce((s, i) => s + i.qty, 0)})`}
						actions={
							order.giftBox && (
								<Badge tone="ink">
									<Gift size={12} />
									Gift box
								</Badge>
							)
						}
						bodyClass=""
					>
						<ul>
							{order.items.map((it) => (
								<li
									key={it.productId}
									className="flex items-center gap-4 border-b border-ops-line px-4 py-3.5 last:border-0"
								>
									<Thumb src={it.image} alt={it.name} size={64} />
									<div className="min-w-0 flex-1">
										<Link
											to={`/catalog/products/${it.productId}`}
											className="text-[14px] font-medium hover:underline"
										>
											{it.name}
										</Link>
										<div className="mt-0.5 text-[12.5px] text-ops-muted">{it.variant}</div>
										<div className="mt-1">
											<Ref>{it.sku}</Ref>
										</div>
									</div>
									<span className="ops-num hidden text-[13px] text-ops-muted sm:inline">
										{money(it.price)} × {it.qty}
									</span>
									<span className="ops-num w-24 text-right text-[14px] font-medium">
										{money(it.price * it.qty)}
									</span>
								</li>
							))}
						</ul>
						<div className="border-t border-ops-line bg-ops-surface-2 px-4 py-3">
							<dl className="ml-auto grid max-w-xs grid-cols-[1fr_auto] gap-y-1.5 text-[13px]">
								<dt className="text-ops-muted">Subtotal</dt>
								<dd className="ops-num text-right">{money(order.subtotal)}</dd>
								{order.discount > 0 && (
									<>
										<dt className="text-ops-muted">
											Coupon <span className="ops-num text-ops-ink">{order.coupon}</span>
										</dt>
										<dd className="ops-num text-right text-ops-ok">−{money(order.discount)}</dd>
									</>
								)}
								<dt className="text-ops-muted">{order.shippingMethod}</dt>
								<dd className="ops-num text-right">{order.shipping ? money(order.shipping) : "Free"}</dd>
								<dt className="text-ops-muted">
									{tax && tax.rate > 0 ? `${tax.label} ${tax.rate}% included` : "No tax charged"}
								</dt>
								<dd className="ops-num text-right text-ops-muted">{money(order.tax)}</dd>
								<dt className="border-t border-ops-line pt-1.5 font-semibold">Total</dt>
								<dd className="ops-num border-t border-ops-line pt-1.5 text-right font-semibold">
									{money(order.total)}
								</dd>
								{txn && txn.refunded > 0 && (
									<>
										<dt className="text-ops-bad">Refunded</dt>
										<dd className="ops-num text-right text-ops-bad">−{money(txn.refunded)}</dd>
									</>
								)}
							</dl>
						</div>
					</Panel>

					<Panel title="Shipment">
						{order.tracking ? (
							<KeyValue
								items={[
									["Courier", order.carrier],
									[
										"Waybill",
										<span key="Waybill" className="inline-flex items-center gap-1.5">
											<Ref>{order.tracking}</Ref>
											<button
												type="button"
												aria-label="Copy waybill number"
												onClick={() => {
													navigator.clipboard?.writeText(order.tracking ?? "");
													toast("Waybill number copied", "info");
												}}
												className="text-ops-muted hover:text-ops-ink"
											>
												<Copy size={13} />
											</button>
										</span>,
									],
									["Service", order.shippingMethod],
									["Destination", `${order.address.city}, ${order.address.country}`],
								]}
							/>
						) : order.status === "cancelled" ? (
							<p className="text-[13px] text-ops-muted">Cancelled before it shipped.</p>
						) : (
							<div className="flex flex-wrap items-center justify-between gap-3">
								<p className="text-[13px] text-ops-muted">
									Not shipped yet. {order.shippingMethod} to {order.address.city}, {order.address.country}.
								</p>
								{order.status === "processing" && (
									<Button size="sm" icon={Truck} onClick={() => setShipOpen(true)}>
										Add waybill
									</Button>
								)}
							</div>
						)}
					</Panel>

					<Panel title="Timeline">
						<ol className="relative ml-1 border-l border-ops-line">
							{[...order.timeline].reverse().map((e, i) => (
								<li key={i} className="relative pb-4 pl-5 last:pb-0">
									<span
										className={`absolute -left-[4px] top-1.5 size-[7px] rounded-full ${i === 0 ? "bg-ops-ink" : "bg-ops-line-strong"}`}
									/>
									<div className="text-[13px] text-ops-ink">{e.label}</div>
									<div className="text-[12px] text-ops-muted">
										{date(e.at, true)} · {e.by}
									</div>
								</li>
							))}
						</ol>
					</Panel>
				</div>

				<div className="flex flex-col gap-4">
					<Panel title="Client">
						{customer && (
							<>
								<Link to={`/customers?c=${customer.id}`} className="flex items-center gap-3 hover:opacity-80">
									<Avatar name={customer.name} size={36} />
									<div className="min-w-0">
										<div className="truncate text-[14px] font-medium">{customer.name}</div>
										<div className="text-[12px] text-ops-muted">
											{customerOrders.length} orders · {money(spent)} spent
										</div>
									</div>
								</Link>
								<div className="mt-3 space-y-1 text-[13px]">
									<a
										href={`mailto:${customer.email}`}
										className="block truncate underline decoration-ops-line-strong underline-offset-2 hover:decoration-ops-ink"
									>
										{customer.email}
									</a>
									<div className="ops-num text-ops-ink-2">{customer.phone}</div>
									{customer.privateClient && (
										<div className="pt-1">
											<Badge tone="ink">Private client</Badge>
										</div>
									)}
								</div>
							</>
						)}
					</Panel>

					<Panel title="Ship to">
						<address className="text-[13px] not-italic leading-relaxed text-ops-ink-2">
							{customer?.name}
							<br />
							{order.address.line1}
							<br />
							{order.address.city}, {order.address.postcode}
							<br />
							{order.address.country}
							<br />
							<span className="ops-num">{order.address.phone}</span>
						</address>
					</Panel>

					<Panel title="Payment">
						<KeyValue
							items={[
								["Status", <StatusBadge key="Status" status={order.paymentStatus} />],
								["Method", order.paymentMethod],
								["Gateway", txn?.gateway ?? "None"],
								...(txn
									? [
											[
												"Transaction",
												<Ref key="Transaction" to={`/payments?txn=${txn.id}`}>
													{txn.gatewayRef}
												</Ref>,
											] as [string, React.ReactNode],
										]
									: []),
								...(txn?.failureReason
									? [
											[
												"Failure",
												<span key="Failure" className="text-ops-bad">
													{txn.failureReason}
												</span>,
											] as [string, React.ReactNode],
										]
									: []),
							]}
						/>
					</Panel>

					<Panel title="Internal note">
						<Textarea
							aria-label="Internal note"
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder="Only staff see this"
						/>
						{order.note && note === order.note && (
							<p className="mt-1.5 text-[12px] text-ops-muted">Includes the client's note from checkout.</p>
						)}
						<div className="mt-2 flex justify-end">
							<Button
								size="sm"
								disabled={note === order.note}
								onClick={() => {
									addNote(order.id, note);
									toast("Note saved");
								}}
							>
								Save note
							</Button>
						</div>
					</Panel>
				</div>
			</div>

			<Modal
				open={shipOpen}
				onClose={() => setShipOpen(false)}
				title="Ship order"
				footer={
					<>
						<Button onClick={() => setShipOpen(false)}>Cancel</Button>
						<Button variant="primary" icon={Truck} onClick={ship}>
							Mark as shipped
						</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<Field label="Courier" htmlFor="carrier">
						<Select id="carrier" value={carrier} onChange={(e) => setCarrier(e.target.value)}>
							{carriers.map((c) => (
								<option key={c.name}>{c.name}</option>
							))}
						</Select>
					</Field>
					<Field
						label="Waybill number"
						htmlFor="awb"
						error={awbErr}
						hint="The client receives tracking by email and WhatsApp."
					>
						<Input
							id="awb"
							value={awb}
							aria-invalid={!!awbErr}
							onChange={(e) => {
								setAwb(e.target.value);
								setAwbErr("");
							}}
							className="ops-num"
						/>
					</Field>
				</div>
			</Modal>

			<Confirm
				open={cancelOpen}
				onClose={() => setCancelOpen(false)}
				onConfirm={() => {
					setOrderStatus([order.id], "cancelled");
					toast(`${order.number} cancelled`);
				}}
				title={`Cancel ${order.number}?`}
				body={
					order.paymentStatus === "paid"
						? "Stock goes back to inventory. This order was paid, so issue a refund afterwards."
						: "Cancels this sample order only. Catalog stock and customer messages are unchanged."
				}
				confirmLabel="Cancel order"
				danger
			/>

			{txn && <RefundModal txn={txn} open={refundOpen} onClose={() => setRefundOpen(false)} />}

			<Drawer
				open={invoiceOpen}
				onClose={() => setInvoiceOpen(false)}
				title="Invoice"
				width={660}
				footer={
					<>
						<Button onClick={() => setInvoiceOpen(false)}>Close</Button>
						<Button variant="primary" icon={FileText} onClick={() => window.print()}>
							Print
						</Button>
					</>
				}
			>
				<div className="ops-print-area text-[13px] text-ops-ink">
					<div className="flex justify-between gap-6 border-b border-ops-line pb-4">
						<div>
							<div className="ops-display text-[20px] font-semibold tracking-[0.18em]">RINAZ</div>
							<div className="text-[10.5px] tracking-[0.3em] text-ops-muted">STUDIO</div>
							<div className="mt-3 max-w-64 text-ops-muted">
								{settings.legalName}
								<br />
								{settings.address}
							</div>
						</div>
						<div className="text-right">
							<div className="text-ops-muted">Invoice</div>
							<div className="ops-num font-medium">INV-{order.number.slice(3)}</div>
							<div className="mt-1 text-ops-muted">{date(order.createdAt)}</div>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4 border-b border-ops-line py-4">
						<div>
							<div className="mb-1 text-ops-muted">Bill to</div>
							{customer?.name}
							<br />
							{order.address.line1}
							<br />
							{order.address.city}, {order.address.postcode}
							<br />
							{order.address.country}
						</div>
						<div>
							<div className="mb-1 text-ops-muted">Order</div>
							<span className="ops-num">{order.number}</span>
							<br />
							Paid by {order.paymentMethod}
							<br />
							{order.shippingMethod}
						</div>
					</div>
					<table className="mt-3 w-full">
						<thead>
							<tr className="text-left text-[12px] text-ops-muted">
								<th className="py-1.5 font-medium">Piece</th>
								<th className="font-medium">SKU</th>
								<th className="text-right font-medium">Qty</th>
								<th className="text-right font-medium">Amount</th>
							</tr>
						</thead>
						<tbody>
							{order.items.map((i) => (
								<tr key={i.productId} className="border-t border-ops-line">
									<td className="py-2">
										{i.name}
										<div className="text-[12px] text-ops-muted">{i.variant}</div>
									</td>
									<td className="ops-num text-[12px]">{i.sku}</td>
									<td className="ops-num text-right">{i.qty}</td>
									<td className="ops-num text-right">{money(i.price * i.qty)}</td>
								</tr>
							))}
						</tbody>
					</table>
					<dl className="ml-auto mt-3 grid max-w-64 grid-cols-[1fr_auto] gap-y-1 border-t border-ops-line pt-3">
						<dt className="text-ops-muted">Net of tax</dt>
						<dd className="ops-num text-right">{money(order.subtotal - order.discount - order.tax)}</dd>
						<dt className="text-ops-muted">
							{tax?.label ?? "Tax"} {tax?.rate ?? 0}%
						</dt>
						<dd className="ops-num text-right">{money(order.tax)}</dd>
						{order.discount > 0 && (
							<>
								<dt className="text-ops-muted">Discount</dt>
								<dd className="ops-num text-right">−{money(order.discount)}</dd>
							</>
						)}
						<dt className="text-ops-muted">Shipping</dt>
						<dd className="ops-num text-right">{money(order.shipping)}</dd>
						<dt className="font-semibold">Total</dt>
						<dd className="ops-num text-right font-semibold">{money(order.total)}</dd>
					</dl>
					{!settings.taxConfirmed && (
						<p className="mt-4 text-[11.5px] text-ops-warn">
							Tax rates are placeholders until confirmed in Settings, Tax.
						</p>
					)}
				</div>
			</Drawer>
		</>
	);
}
