export {};

const sync = Bun.spawn(["bun", "run", "cms:sync"], { stdout: "inherit", stderr: "inherit" });
if (await sync.exited) throw new Error("CMS sync failed; fix conflict before starting development");
const watcher = Bun.spawn(["bun", "--watch", "scripts/sync-source.ts"], {
	stdout: "inherit",
	stderr: "inherit",
});
const next = Bun.spawn(["bun", "next", "dev", ...process.argv.slice(2)], {
	stdout: "inherit",
	stderr: "inherit",
});
const stop = () => {
	watcher.kill();
	next.kill();
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
try {
	process.exitCode = await next.exited;
} finally {
	watcher.kill();
}
