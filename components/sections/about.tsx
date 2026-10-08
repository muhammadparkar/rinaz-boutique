export function About({
	title = "Simple. Memorable. Meaningful.",
	text,
}: {
	title?: string;
	text?: string;
} = {}) {
	return (
		<section id="about" className="bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">{title}</h2>
					{text !== undefined ? (
						text.split("\n").map((paragraph, index) => (
							<p
								key={`${index}-${paragraph}`}
								className={`${index === 0 ? "mt-6" : "mt-4"} text-lg text-muted-foreground leading-relaxed`}
							>
								{paragraph}
							</p>
						))
					) : (
						<>
							{" "}
							<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
								Every curve of the RINAZ mark is rooted in modesty, craftsmanship, and cultural pride. We
								honor Islamic modest heritage and South Asian craft traditions with graceful contemporary
								refinement.
							</p>
							<p className="mt-4 text-lg text-muted-foreground leading-relaxed">
								Silhouettes designed to transcend fleeting seasons and become treasured generational
								heirlooms.
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
