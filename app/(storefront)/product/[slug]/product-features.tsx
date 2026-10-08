import { Award, Hammer, Leaf, type LucideIcon } from "lucide-react";

type Feature = {
	title: string;
	description: string;
	icon?: LucideIcon;
};

type ProductFeaturesProps = {
	features?: Feature[];
};

const defaultFeatures: Feature[] = [
	{
		title: "Zero-Waste Patterning",
		description: "Mathematical pattern layouts achieving 94% textile utilization.",
	},
	{
		title: "Numbered Editions",
		description: "Never mass-produced. Each piece carries an embossed gold edition plaque.",
	},
	{
		title: "White-Glove Delivery",
		description: "Archival presentation boxes with velvet dust bags via insured DHL Express.",
	},
];

const defaultIcons = [Leaf, Hammer, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<h2 className="mb-12 text-center text-3xl font-medium tracking-tight">Atelier Savoir-Faire</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length] ?? Leaf;
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-foreground">
								<Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-background" />
							</div>
							<h3 className="mb-2 text-lg font-medium">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
