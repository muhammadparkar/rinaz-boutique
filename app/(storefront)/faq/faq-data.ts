export type FAQCategory = {
	id: string;
	title: string;
	questions: { question: string; answer: string }[];
};

export const faqCategories: FAQCategory[] = [
	{
		id: "sizing",
		title: "Sizing & Bespoke Fittings",
		questions: [
			{
				question: "How do Abaya sizes work?",
				answer:
					"Our standard Abaya sizes (52 to 58) correspond to heights from 5'0\" to 5'10\": Size 52 fits 5'0\"–5'2\", Size 54 fits 5'3\"–5'5\", Size 56 fits 5'6\"–5'7\", and Size 58 fits 5'8\" and above. We also provide custom sleeve length and bust tailoring at no extra charge.",
			},
			{
				question: "Can my bridal Anarkali be made to measure?",
				answer:
					"Yes. Our Pakistani bridal ensembles are hand-worked in raw silk and organza. We schedule private measurement sessions to ensure a flawless bespoke fit.",
			},
			{
				question: "How do I book a private fitting?",
				answer:
					"We would be delighted to arrange your private sanctuary fitting in London Knightsbridge, Dubai Fashion Avenue, Doha, or Lahore Gulberg. Get in touch through our contact page to book.",
			},
		],
	},
	{
		id: "jewelry",
		title: "Fine Jewelry",
		questions: [
			{
				question: "Is RINAZ jewelry certified?",
				answer:
					"All RINAZ Fine Jewelry is forged in hallmarked 18K solid gold with VVS1 clarity diamonds and accompanied by a signed Certificate of Valuation.",
			},
		],
	},
	{
		id: "shipping",
		title: "Shipping & Duties",
		questions: [
			{
				question: "How much does shipping cost?",
				answer:
					"Orders of $400 or more qualify for complimentary worldwide DHL Express delivery. Orders under $400 are shipped insured at a $25 flat rate.",
			},
			{
				question: "How long does delivery take?",
				answer: "Orders arrive within 2–3 business days via insured courier.",
			},
			{
				question: "Will I pay customs duties or taxes?",
				answer: "Customs, duties and taxes are fully prepaid for GCC, UK, Europe, and India shipments.",
			},
		],
	},
	{
		id: "returns",
		title: "Returns",
		questions: [
			{
				question: "What is your return policy?",
				answer: "We offer 14-day global returns with complimentary doorstep pickup and transit insurance.",
			},
		],
	},
	{
		id: "packaging",
		title: "Packaging & Gifting",
		questions: [
			{
				question: "How is my order packaged?",
				answer:
					"Every piece arrives in our signature light cream velvet keepsake box with a gold monogram plaque, a velvet dust bag, and a hand-signed master cutter certificate.",
			},
			{
				question: "Can I add a gift message?",
				answer:
					"Yes. Add a personal message and we will calligraph it by hand in gold ink on archival parchment, complimentary.",
			},
		],
	},
	{
		id: "offers",
		title: "Privilege Codes",
		questions: [
			{
				question: "Do you offer any discount codes?",
				answer:
					"Use RINAZ10 or STUDIO at checkout for a 10% privilege discount on your order. Enter the code in your cart.",
			},
		],
	},
];
