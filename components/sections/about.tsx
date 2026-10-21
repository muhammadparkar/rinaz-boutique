export function About({
	title = "Simple. Memorable. Meaningful.",
	text,
}: {
	title?: string;
	text?: string;
} = {}) {
	const paragraphs = (
		text ??
		"Every curve of the RINAZ mark is rooted in modesty, craftsmanship, and cultural pride. We honor Islamic modest heritage and South Asian craft traditions with graceful contemporary refinement.\nSilhouettes designed to transcend fleeting seasons and become treasured generational heirlooms."
	)
		.split("\n")
		.filter(Boolean);
	return (
		<section id="about" className="border-t border-border bg-background text-foreground">
			<div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-28">
				<h2 className="min-w-0 max-w-[13ch] text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.12] tracking-[-0.03em] break-words text-balance lg:col-span-6">
					{title}
				</h2>
				<div className="max-w-[48ch] space-y-6 lg:col-span-5 lg:col-start-8 lg:self-end">
					{paragraphs.map((paragraph, index) => (
						<p
							key={`${index}-${paragraph}`}
							className={
								index === 0
									? "text-lg leading-8 sm:text-xl sm:leading-9"
									: "text-base leading-7 text-muted-foreground"
							}
						>
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</section>
	);
}
