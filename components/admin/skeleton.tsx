import { cn } from "@/lib/utils";

export function AdminWorkspaceSkeleton({ className }: { className?: string }) {
	const chartBars = [38, 62, 45, 78, 92, 54, 70, 88, 65, 82, 75, 96];

	return (
		<div
			role="status"
			aria-label="Loading admin workspace"
			className={cn("w-full space-y-6 motion-reduce:animate-none", className)}
		>
			{/* Top Header Skeleton */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
							<span className="size-1.5 rounded-full bg-ops-gold animate-ping" />
							<span>Loading studio workspace…</span>
						</span>
						<div className="h-5 w-20 rounded-full bg-muted/50 animate-pulse" />
					</div>
					<div className="h-8 w-56 rounded-lg bg-muted/80 animate-pulse" />
					<div className="h-4 w-80 max-w-full rounded-md bg-muted/40 animate-pulse" />
				</div>
				<div className="flex items-center gap-2 pt-1 sm:pt-0">
					<div className="h-8 w-24 rounded-md bg-muted/60 animate-pulse" />
					<div className="h-8 w-28 rounded-md bg-muted/60 animate-pulse" />
				</div>
			</div>

			{/* Quick Action Alerts Bar */}
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{Array.from({ length: 4 }).map((_, index) => (
					<div
						key={`quick-alert-${index}`}
						className="flex items-center justify-between rounded-lg border border-border/70 bg-card/60 p-3 shadow-2xs"
					>
						<div className="flex items-center gap-2.5 min-w-0">
							<div className="size-7 shrink-0 rounded-md bg-muted/70 animate-pulse" />
							<div className="space-y-1 min-w-0">
								<div className="h-3 w-20 rounded bg-muted/70 animate-pulse" />
								<div className="h-2.5 w-12 rounded bg-muted/40 animate-pulse" />
							</div>
						</div>
						<div className="h-5 w-7 shrink-0 rounded-full bg-muted/50 animate-pulse" />
					</div>
				))}
			</div>

			{/* 5-Column KPI Metrics Row */}
			<div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
				{Array.from({ length: 5 }).map((_, index) => (
					<div
						key={`kpi-metric-${index}`}
						className="relative overflow-hidden rounded-xl border border-border/70 bg-card p-4 shadow-2xs"
					>
						<div className="flex items-center justify-between">
							<div className="size-7 rounded-lg bg-muted/70 animate-pulse" />
							<div className="h-4 w-12 rounded-full bg-muted/50 animate-pulse" />
						</div>
						<div className="mt-4 space-y-1.5">
							<div className="h-7 w-24 rounded-md bg-muted/80 animate-pulse" />
							<div className="h-3.5 w-20 rounded bg-muted/50 animate-pulse" />
						</div>
						<div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2">
							<div className="h-2.5 w-14 rounded bg-muted/40 animate-pulse" />
							<div className="h-2.5 w-10 rounded bg-muted/40 animate-pulse" />
						</div>
					</div>
				))}
			</div>

			{/* Main Grid: Chart Panel + Activity Stream */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Chart Card (2 Columns) */}
				<div className="flex flex-col rounded-xl border border-border/70 bg-card p-5 shadow-2xs lg:col-span-2">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
						<div className="space-y-1">
							<div className="h-5 w-40 rounded-md bg-muted/80 animate-pulse" />
							<div className="h-3.5 w-56 rounded bg-muted/40 animate-pulse" />
						</div>
						<div className="flex items-center gap-2">
							<div className="h-7 w-28 rounded-lg bg-muted/50 animate-pulse" />
							<div className="h-7 w-20 rounded-lg bg-muted/50 animate-pulse" />
						</div>
					</div>

					{/* Simulated Target Progress */}
					<div className="my-4 space-y-1.5">
						<div className="flex justify-between">
							<div className="h-3 w-28 rounded bg-muted/60 animate-pulse" />
							<div className="h-3 w-16 rounded bg-muted/60 animate-pulse" />
						</div>
						<div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
							<div className="h-full w-2/3 rounded-full bg-ops-gold/40 animate-pulse" />
						</div>
					</div>

					{/* Simulated Bar Chart Silhouette */}
					<div className="mt-2 flex h-52 items-end justify-between gap-2 rounded-lg bg-muted/20 p-4">
						{chartBars.map((height, i) => (
							<div key={`bar-${i}`} className="flex h-full flex-1 flex-col justify-end items-center gap-2">
								<div
									className="w-full max-w-[28px] rounded-t-md bg-muted/60 transition-all duration-500 animate-pulse"
									style={{
										height: `${height}%`,
										opacity: 0.35 + (height / 100) * 0.65,
									}}
								/>
								<div className="h-2.5 w-6 rounded bg-muted/30 animate-pulse" />
							</div>
						))}
					</div>

					{/* Chart Summary Stats */}
					<div className="mt-5 grid grid-cols-3 gap-4 border-t border-border/60 pt-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={`summary-${i}`} className="space-y-1">
								<div className="h-3 w-16 rounded bg-muted/50 animate-pulse" />
								<div className="h-5 w-24 rounded bg-muted/80 animate-pulse" />
							</div>
						))}
					</div>
				</div>

				{/* Recent Activity / Stream (1 Column) */}
				<div className="flex flex-col rounded-xl border border-border/70 bg-card p-5 shadow-2xs">
					<div className="flex items-center justify-between border-b border-border/60 pb-3">
						<div className="h-5 w-32 rounded-md bg-muted/80 animate-pulse" />
						<div className="h-5 w-12 rounded-full bg-muted/50 animate-pulse" />
					</div>

					<div className="mt-4 divide-y divide-border/60">
						{Array.from({ length: 5 }).map((_, index) => (
							<div key={`stream-item-${index}`} className="flex items-center gap-3 py-3">
								<div className="size-9 shrink-0 rounded-full bg-muted/70 animate-pulse" />
								<div className="flex-1 space-y-1.5 min-w-0">
									<div className="h-3.5 w-28 rounded bg-muted/80 animate-pulse" />
									<div className="h-3 w-36 rounded bg-muted/40 animate-pulse" />
								</div>
								<div className="space-y-1 text-right shrink-0">
									<div className="h-3.5 w-14 rounded bg-muted/70 animate-pulse" />
									<div className="h-3 w-10 rounded bg-muted/40 animate-pulse ml-auto" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
