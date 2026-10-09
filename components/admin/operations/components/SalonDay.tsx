import { useEffect, useState } from "react";
import { cx, localDayKey, localHour, time } from "../lib/format";
import { useStore } from "../lib/store";
import type { Appointment, Atelier } from "../lib/types";
import { TAPE_BLANK, TAPE_GOLD } from "./ui";

const SHORT: Record<Appointment["type"], string> = {
	"Bridal consultation": "Bridal",
	"Fine jewelry viewing": "Jewelry",
	"Custom measurements": "Measure",
	Fitting: "Fitting",
	"Styling session": "Styling",
};

const statusCls: Record<Appointment["status"], string> = {
	confirmed: "bg-ops-ink text-ops-surface border-ops-ink",
	requested: "bg-ops-surface text-ops-ink border-ops-ink border-dashed",
	completed: "bg-ops-sunken text-ops-muted border-ops-line-strong",
	cancelled: "bg-ops-surface text-ops-faint border-ops-line line-through",
	no_show: "bg-ops-surface text-ops-bad border-ops-bad/40 line-through",
};

/**
 * Each atelier's day measured on a tailor's tape in its own local time.
 * Gold runs from opening to now; the black pin is the current moment. Appointments sit above the tape.
 */
export function SalonDay({
	dayOffset = 0,
	onSelect,
	dense,
	only,
}: {
	dayOffset?: number;
	onSelect?: (a: Appointment) => void;
	dense?: boolean;
	only?: Atelier;
}) {
	const all = useStore((s) => s.ateliers);
	const ateliers = only ? all.filter((a) => a.name === only) : all;
	const appointments = useStore((s) => s.appointments);
	const [now, setNow] = useState(Date.now());
	useEffect(() => {
		const t = setInterval(() => setNow(Date.now()), 30_000);
		return () => clearInterval(t);
	}, []);
	const ref = now + dayOffset * 86_400_000;

	return (
		<>
			{/* Phone: each atelier as a short agenda with its day tape, no sideways scrolling. */}
			<div className="sm:hidden">
				{ateliers.map((a, row) => {
					const span = a.closes - a.opens;
					const day = localDayKey(ref, a.timezone);
					const list = appointments.filter(
						(x) => x.atelier === a.name && localDayKey(x.start, a.timezone) === day,
					);
					const nowH = localHour(now, a.timezone);
					const elapsed =
						dayOffset === 0 ? Math.max(0, Math.min(1, (nowH - a.opens) / span)) : dayOffset < 0 ? 1 : 0;
					return (
						<div key={a.name} className={cx("px-4 py-3", row > 0 && "border-t border-ops-line")}>
							<div className="mb-2 flex items-baseline justify-between">
								<span className="text-[14px] font-semibold">{a.name}</span>
								{dayOffset === 0 && (
									<span className="ops-num text-[12px] text-ops-muted">{time(now, a.timezone)} local</span>
								)}
							</div>
							<div className="relative h-2 rounded-full" style={{ background: TAPE_BLANK(span) }}>
								{elapsed > 0 && (
									<div
										className="absolute inset-y-0 left-0 overflow-hidden"
										style={{ width: `${elapsed * 100}%` }}
									>
										<div
											className="absolute inset-y-0 left-0"
											style={{ width: `${100 / elapsed}%`, background: TAPE_GOLD(span) }}
										/>
									</div>
								)}
							</div>
							{list.length === 0 ? (
								<p className="mt-2 text-[12.5px] text-ops-faint">No appointments</p>
							) : (
								<ul className="mt-2">
									{list.map((x) => (
										<li key={x.id}>
											<button
												type="button"
												onClick={() => onSelect?.(x)}
												className={cx(
													"flex w-full items-center gap-3 py-1.5 text-left text-[13px]",
													(x.status === "cancelled" || x.status === "no_show") &&
														"text-ops-faint line-through",
												)}
											>
												<span className="ops-num w-11 shrink-0">{time(x.start, a.timezone)}</span>
												<span
													className={cx(
														"size-[7px] shrink-0 rounded-full",
														x.status === "requested"
															? "border border-ops-ink"
															: x.status === "completed"
																? "bg-ops-faint"
																: "bg-ops-ink",
													)}
												/>
												<span className="min-w-0 flex-1 truncate">{x.clientName}</span>
												<span className="shrink-0 text-[12px] text-ops-muted">{SHORT[x.type]}</span>
											</button>
										</li>
									))}
								</ul>
							)}
						</div>
					);
				})}
			</div>
			<div className="hidden overflow-x-auto sm:block">
				<div className="min-w-[680px]">
					{ateliers.map((a, row) => {
						const span = a.closes - a.opens;
						const day = localDayKey(ref, a.timezone);
						const list = appointments.filter(
							(x) => x.atelier === a.name && localDayKey(x.start, a.timezone) === day,
						);
						const nowH = localHour(now, a.timezone);
						const isToday = dayOffset === 0;
						const elapsed = isToday
							? Math.max(0, Math.min(1, (nowH - a.opens) / span))
							: dayOffset < 0
								? 1
								: 0;
						const open = isToday && nowH >= a.opens && nowH < a.closes;
						return (
							<div
								key={a.name}
								className={cx(
									"grid grid-cols-[132px_1fr] gap-4 px-4",
									row > 0 && "border-t border-ops-line",
									dense ? "py-3" : "py-4",
								)}
							>
								<div className="min-w-0 pt-0.5">
									<div className="text-[13.5px] font-semibold">{a.name}</div>
									<div className="truncate text-[12px] text-ops-muted">{a.label}</div>
									{isToday && (
										<div className="mt-1 text-[12px]">
											<span className="ops-num text-ops-ink">{time(now, a.timezone)}</span>
											<span className={cx("ml-1.5", open ? "text-ops-ok" : "text-ops-faint")}>
												{open ? "open" : "closed"}
											</span>
										</div>
									)}
								</div>
								<div className="min-w-0">
									<div className={cx("relative", dense ? "h-12" : "h-14")}>
										{list.length === 0 && (
											<span className="absolute left-0 top-1/2 -translate-y-1/2 text-[12.5px] text-ops-faint">
												No appointments
											</span>
										)}
										{(() => {
											// Overlapping bookings (two stylists at once) split the row into lanes.
											const lanes: number[] = [];
											const placed = list.map((x) => {
												const s0 = x.start;
												const s1 = x.start + Math.max(x.durationMin, 75) * 60_000; // room for the client name
												let lane = lanes.findIndex((end) => end <= s0);
												if (lane === -1) {
													lane = lanes.length;
													lanes.push(s1);
												} else lanes[lane] = s1;
												return { x, lane };
											});
											return placed.map(({ x, lane }) => ({ x, lane, count: Math.max(1, lanes.length) }));
										})().map(({ x, lane, count }) => {
											const start = localHour(x.start, a.timezone);
											const left = ((start - a.opens) / span) * 100;
											const width = (x.durationMin / 60 / span) * 100;
											return (
												<button
													key={x.id}
													type="button"
													onClick={() => onSelect?.(x)}
													title={`${x.ref} · ${x.clientName} · ${x.type}`}
													className={cx(
														"absolute flex min-w-0 flex-col justify-center overflow-hidden rounded-md border px-2 text-left transition-transform hover:-translate-y-px",
														statusCls[x.status],
													)}
													style={{
														left: `${Math.max(0, left)}%`,
														width: `calc(${width}% - 3px)`,
														top: `calc(${(lane / count) * 100}% + ${lane ? 1 : 0}px)`,
														height: `calc(${100 / count}% - ${count > 1 ? 4 : 6}px)`,
													}}
												>
													<span
														className={cx(
															"truncate font-medium leading-tight",
															count > 1 ? "text-[11px]" : "text-[12px]",
														)}
													>
														{x.clientName}
													</span>
													{count === 1 && (
														<span className="ops-num truncate text-[10.5px] leading-tight opacity-75">
															{time(x.start, a.timezone)} {SHORT[x.type]}
														</span>
													)}
												</button>
											);
										})}
									</div>
									<div className="relative h-2.5 rounded-full" style={{ background: TAPE_BLANK(span) }}>
										{elapsed > 0 && (
											<div
												className="ops-tape-fill absolute inset-y-0 left-0 overflow-hidden rounded-full"
												style={{ width: `${elapsed * 100}%` }}
											>
												<div
													className="absolute inset-y-0 left-0"
													style={{ width: `${100 / elapsed}%`, background: TAPE_GOLD(span) }}
												/>
											</div>
										)}
										{open && (
											<span
												aria-hidden
												className="absolute -top-1 -bottom-1 w-[2px] -translate-x-1/2 bg-ops-ink"
												style={{ left: `${elapsed * 100}%` }}
											/>
										)}
									</div>
									<div className="relative mt-1 h-3.5">
										{Array.from({ length: span + 1 }, (_, i) => (
											<span
												key={i}
												className="ops-num absolute -translate-x-1/2 text-[10.5px] text-ops-faint first:translate-x-0 last:-translate-x-full"
												style={{ left: `${(i / span) * 100}%` }}
											>
												{a.opens + i}
											</span>
										))}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
