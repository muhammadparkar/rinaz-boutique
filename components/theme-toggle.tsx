"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			aria-label="Toggle light/dark theme"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
		>
			{/* CSS-driven swap keeps server and client markup identical (no hydration flash). */}
			<Sun className="hidden size-5 dark:block" />
			<Moon className="size-5 dark:hidden" />
		</Button>
	);
}
