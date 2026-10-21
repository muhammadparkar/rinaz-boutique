import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const checker = join(import.meta.dir, "check-shell.sh");

function checkShell(files: Record<string, string>, targets: string[] = []) {
	const cwd = mkdtempSync(join(tmpdir(), "rinaz-shell-"));
	try {
		Object.entries(files).map(([name, html]) => {
			const path = join(cwd, ".next/server/app", name);
			mkdirSync(dirname(path), { recursive: true });
			writeFileSync(path, html);
		});
		const result = Bun.spawnSync(["bash", checker, ...targets], {
			cwd,
			env: { ...process.env, RINAZ_SHELL_CHECK: "on" },
		});
		return { status: result.exitCode, output: result.stdout.toString() };
	} finally {
		rmSync(cwd, { recursive: true, force: true });
	}
}

test("staff layouts are excluded without excluding storefront documents", () => {
	const result = checkShell({
		"index.html": '<header></header><div hidden id="S:0">content</div>',
		"admin.html": "Checking staff access…",
		"admin/orders/[id].html": "Checking staff access…",
		"staff/login.html": "Staff sign in",
	});
	expect(result.status).toBe(0);
	expect(result.output).toContain("1 document(s) ok");
	expect(result.output.match(/staff layout/g)).toHaveLength(3);
});

test("missing and streamed storefront headers still fail", () => {
	const result = checkShell({
		"products.html": "Missing header",
		"category/[...slugs].html": '<div hidden id="S:0"><header></header></div>',
		"administrator.html": "Not an admin route",
	});
	expect(result.status).toBe(1);
	expect(result.output).toContain("FAIL  products.html");
	expect(result.output).toContain("inside a streamed segment");
	expect(result.output).toContain("FAIL  administrator.html");
});

test("staff URL exclusions ignore query and fragment without fetching", () => {
	const result = checkShell({}, [
		"http://127.0.0.1:1/admin/orders?status=new#details",
		"http://127.0.0.1:1/staff/login/",
	]);
	expect(result.status).toBe(0);
	expect(result.output.match(/staff layout/g)).toHaveLength(2);
});
