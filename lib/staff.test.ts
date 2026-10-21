import { expect, test } from "bun:test";

test("unconfigured staff auth reaches the request boundary and still denies order access", () => {
	// Isolate module mocks from the rest of the test suite.
	const result = Bun.spawnSync(
		[
			"bun",
			"-e",
			`
			import { expect, mock } from "bun:test";
			let prerendering = true;
			let headerReads = 0;
			mock.module("next/headers", () => ({ headers: async () => {
				headerReads += 1;
				if (prerendering) throw new Error("REQUEST_BOUNDARY");
				return new Headers();
			} }));
			const { getStaff, requireOrderStaff } = await import("./lib/staff");
			await expect(getStaff()).rejects.toThrow("REQUEST_BOUNDARY");
			prerendering = false;
			expect(await getStaff()).toBeNull();
			await expect(requireOrderStaff()).rejects.toThrow("Order management access denied");
			expect(headerReads).toBe(3);
			`,
		],
		{
			cwd: process.cwd(),
			env: { ...process.env, BETTER_AUTH_SECRET: "", DATABASE_URL: "" },
		},
	);
	expect(result.stderr.toString()).toBe("");
	expect(result.exitCode).toBe(0);
});
