import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export function Table({ className, ...props }: ComponentProps<"table">) { return <div className="relative w-full overflow-x-auto"><table className={cn("w-full caption-bottom text-sm", className)} {...props} /></div>; }
export function TableHeader(props: ComponentProps<"thead">) { return <thead className="border-b bg-secondary/30" {...props} />; }
export function TableBody(props: ComponentProps<"tbody">) { return <tbody className="divide-y" {...props} />; }
export function TableRow(props: ComponentProps<"tr">) { return <tr className="transition-colors hover:bg-muted/40" {...props} />; }
export function TableHead(props: ComponentProps<"th">) { return <th className="h-11 px-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap" {...props} />; }
export function TableCell(props: ComponentProps<"td">) { return <td className="p-4 align-middle" {...props} />; }
