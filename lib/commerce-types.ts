// Local compatibility types for the existing storefront data. No SDK runtime required.
type ContractShape1 = {
	id: string;
	name: string;
	image: string | null;
	createdAt: string;
	updatedAt: string;
	storeId: string;
	slug: string;
	active: boolean;
	position: string;
	description: JSONContent | null;
	seo: {
		title?: string | null | undefined;
		description?: string | null | undefined;
		canonical?: string | null | undefined;
	} | null;
	longDescription: JSONContent | null;
	parentId: string | null;
};
type ContractShape2 = {
	id: string;
	createdAt: string;
	updatedAt: string;
	storeId: string;
	images: string[];
	description: string | null;
	productId: string;
	sku: string | null;
	barcode: string | null;
	width: number | null;
	height: number | null;
	depth: number | null;
	weight: number | null;
	attributes: unknown;
	price: string;
	calculatedPrice: string | null;
	digital: string[] | null;
	shippable: boolean;
	stock: number | null;
	externalId: string | null;
	originalPrice: string;
};
type ContractShape3 = {
	id: string;
	name: string;
	slug: string;
	images: string[];
	productTaxRate: {
		createdAt: string;
		updatedAt: string;
		productId: string;
		taxRateId: string;
		taxRate: {
			id: string;
			name: string;
			createdAt: string;
			updatedAt: string;
			storeId: string;
			label: string | null;
			rate: string;
		};
	} | null;
	variants: ContractShape2[];
};
type ContractShape4 = {
	id: string;
	createdAt: string;
	updatedAt: string;
	storeId: string;
	images: string[];
	description: string | null;
	productId: string;
	sku: string | null;
	barcode: string | null;
	width: number | null;
	height: number | null;
	depth: number | null;
	weight: number | null;
	attributes: unknown;
	price: string;
	calculatedPrice: string | null;
	cost: string | null;
	digital: string[] | null;
	shippable: boolean;
	stock: number | null;
	externalId: string | null;
	originalPrice: string;
	product: ContractShape3;
	combinations: {
		createdAt: string;
		updatedAt: string;
		productVariantId: string;
		variantValueId: string;
		variantValue: {
			id: string;
			value: string;
			colorValue: string | null;
			variantType: { id: string; type: "string" | "color"; label: string };
		};
	}[];
};
type ContractShape5 = {
	createdAt: string;
	updatedAt: string;
	position: number;
	bundleId: string;
	variantId: string;
	quantity: number;
	maxQuantity: number | null;
	groupId: string | null;
	forced: boolean;
	defaultSelected: boolean;
	variant: ContractShape4;
};
type ContractShape6 = {
	id: string;
	name: string;
	image: string | null;
	createdAt: string;
	updatedAt: string;
	storeId: string;
	slug: string;
	active: boolean;
	description: JSONContent | null;
	filter:
		| { type: "manual" }
		| { type: "dynamicPrice"; min?: number | null | undefined; max?: number | null | undefined }
		| { type: "variantValues"; values: Record<string, string[]> }
		| { type: "newest"; days?: number | null | undefined };
};
type ContractShape7 = {
	position: string | null;
	productId: string;
	collectionId: string;
	collection: ContractShape6;
};
type ContractShape8 = {
	id: string;
	createdAt: string;
	updatedAt: string;
	storeId: string;
	images: string[];
	description: string | null;
	productId: string;
	sku: string | null;
	barcode: string | null;
	width: number | null;
	height: number | null;
	depth: number | null;
	weight: number | null;
	attributes: unknown;
	price: string;
	calculatedPrice: string | null;
	digital: string[] | null;
	shippable: boolean;
	stock: number | null;
	externalId: string | null;
	originalPrice: string;
	combinations: {
		createdAt: string;
		updatedAt: string;
		productVariantId: string;
		variantValueId: string;
		variantValue: {
			id: string;
			value: string;
			colorValue: string | null;
			variantType: { id: string; type: "string" | "color"; label: string };
		};
	}[];
	prices: {
		createdAt: string;
		updatedAt: string;
		storeId: string;
		currency: string;
		price: string;
		calculatedPrice: string | null;
		variantId: string;
	}[];
};
type ContractShape9 = {
	matchedVariantIds?: string[] | undefined;
	bundleGroups: { id: string; minQuantity: number; maxQuantity: number | null; allowDuplicates: boolean }[];
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	type: "set" | "product" | "bundle";
	storeId: string;
	slug: string;
	status: "published" | "draft" | "hidden" | null;
	flags: unknown;
	content: JSONContent | null;
	summary: string | null;
	images: string[];
	badge: unknown;
	subscriptionMode: "optional" | "only" | "rolling";
	bundleDiscountPercentage: string | null;
	bundlePriceMode: "fixed" | "amount" | "percent";
	bundleFixedPriceAmount: string | null;
	bundleAmountOffAmount: string | null;
	seo: {
		title?: string | null | undefined;
		description?: string | null | undefined;
		canonical?: string | null | undefined;
	} | null;
	stripeTaxCode: string | null;
	categoryId: string | null;
	brandId: string | null;
	category: ContractShape1 | null;
	bundleProducts: ContractShape5[];
	subscriptionPlanProducts: {
		createdAt: string;
		updatedAt: string;
		position: number;
		productId: string;
		subscriptionPlanId: string;
		subscriptionPlan: {
			interval: number;
			id: string;
			name: string;
			createdAt: string;
			updatedAt: string;
			storeId: string;
			active: boolean;
			position: number;
			description: string | null;
			cadence: "month" | "week";
			discountPercent: number;
			benefits: string | null;
		};
	}[];
	productTaxRate: {
		createdAt: string;
		updatedAt: string;
		productId: string;
		taxRateId: string;
		taxRate: {
			id: string;
			name: string;
			createdAt: string;
			updatedAt: string;
			storeId: string;
			label: string | null;
			rate: string;
		};
	} | null;
	productCollections: ContractShape7[];
	variants: ContractShape8[] & ({ id: string; price: string } & { prePromotionPrice: string | null })[];
	translations: { locale: string }[];
};
type ContractShape10 = {
	[K in keyof ContractShape5["variant"]]: K extends "prices"
		? Array<
				(ContractShape5["variant"][K] extends readonly (infer TElement)[] ? TElement : never) & {
					priceGross: string;
					calculatedPriceGross: string | null;
				}
			>
		: ContractShape5["variant"][K];
};
type ContractShape11 = {
	[K in Extract<
		keyof ContractShape5["variant"],
		"calculatedPrice" | "originalPrice" | "prePromotionPrice" | "omnibusPrice"
	> as `${K}Gross`]: string | null;
};
type ContractShape12 = {
	[K in keyof ContractShape5]: K extends "variant"
		? ContractShape10 & { priceGross: string } & ContractShape11
		: ContractShape5[K];
};
type ContractShape13 = {
	id: string;
	createdAt: string;
	updatedAt: string;
	storeId: string;
	images: string[];
	description: string | null;
	productId: string;
	sku: string | null;
	barcode: string | null;
	width: number | null;
	height: number | null;
	depth: number | null;
	weight: number | null;
	attributes: unknown;
	price: string;
	calculatedPrice: string | null;
	cost: string | null;
	digital: string[] | null;
	shippable: boolean;
	stock: number | null;
	externalId: string | null;
	originalPrice: string;
	combinations: {
		createdAt: string;
		updatedAt: string;
		productVariantId: string;
		variantValueId: string;
		variantValue: {
			id: string;
			value: string;
			position: number | null;
			colorValue: string | null;
			variantType: { id: string; type: "string" | "color"; label: string };
		};
	}[];
	prices: {
		createdAt: string;
		updatedAt: string;
		storeId: string;
		currency: string;
		price: string;
		calculatedPrice: string | null;
		variantId: string;
	}[];
};
type ContractShape14 = {
	id: string;
	price: string;
	sku: string | null;
	stock: number | null;
	images: string[];
	productName: string;
	productSlug: string;
	productImages: string[];
	taxRate: { id: string; name: string; rate: number; label: string | null } | null;
	productStatus: "published" | "draft" | "hidden";
	sellable: boolean;
	options: { type: string; value: string; colorValue: string | null }[];
};
type ContractShape15 = {
	id: string;
	productId: string;
	title: string;
	description: string | null;
	image: string | null;
	startsAt: string;
	endsAt: string;
	status: "published" | "draft";
	items: {
		productVariantId: string;
		productId: string;
		name: string;
		variantLabel: string | null;
		sku: string | null;
		image: string | null;
		quantity: number;
	}[];
	createdAt: string;
	updatedAt: string;
};
type ContractShape16 = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	type: "courier" | "parcel" | "pickup_point" | "in_store";
	storeId: string;
	position: number | null;
	description: string | null;
	price: string;
	minShippingTime: number | null;
	maxShippingTime: number | null;
	freeShippingThreshold: string | null;
	addonId: string | null;
	addonData: unknown;
	deliverySlots: unknown;
	countries: string[] | null;
	shippingAddon: {
		id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
		type: "shipping" | "products" | "analytics" | "invoicing" | "orders";
		storeId: string;
	} | null;
	shippingTaxRate: {
		createdAt: string;
		updatedAt: string;
		shippingId: string;
		taxRateId: string;
		taxRate: {
			id: string;
			name: string;
			createdAt: string;
			updatedAt: string;
			storeId: string;
			label: string | null;
			rate: string;
		};
	} | null;
	prices: {
		createdAt: string;
		updatedAt: string;
		storeId: string;
		currency: string;
		price: string;
		freeShippingThreshold: string | null;
		shippingId: string;
	}[];
};
type ContractShape17 = {
	type: "fixed" | "percentage";
	value: string;
	code: string;
	startDate: string | null;
	endDate: string | null;
	minProductCount: number | null;
	maxProductCount: number | null;
	products: { id: string }[];
	brands: { id: string }[];
	collections: { id: string }[];
	categories: { id: string }[];
	prices: {
		createdAt: string;
		updatedAt: string;
		storeId: string;
		value: string;
		currency: string;
		couponId: string;
	}[];
};
type ContractShape18 = {
	id: string;
	name: string | null;
	createdAt: string;
	updatedAt: string;
	type: "shipping" | "billing" | "merchant";
	company: string | null;
	city: string | null;
	country: string | null;
	line1: string | null;
	line2: string | null;
	postalCode: string | null;
	state: string | null;
	phone: string | null;
	taxId: string | null;
};
type ContractShape19 = {
	id: string;
	email: string | null;
	createdAt: string;
	updatedAt: string;
	userId: string | null;
	storeId: string;
	stripeCustomerId: string | null;
	couponId: string | null;
	coupon: ContractShape17 | null;
	user: { id: string; name: string; email: string } | null;
};
type ContractShape20 = {
	coupon: Omit<ContractShape17, "prices">;
	id: string;
	email: string | null;
	createdAt: string;
	updatedAt: string;
	userId: string | null;
	storeId: string;
	stripeCustomerId: string | null;
	couponId: string | null;
	user: { id: string; name: string; email: string } | null;
};
type ContractShape21 = {
	storeId: string | null;
	product: {
		productTaxRate: { taxRate: { rate: string; label: string | null } } | null;
		id: string;
		name: string;
		slug: string;
		images: string[];
	};
	id: string;
	createdAt: string;
	updatedAt: string;
	images: string[];
	description: string | null;
	productId: string;
	sku: string | null;
	barcode: string | null;
	width: number | null;
	height: number | null;
	depth: number | null;
	weight: number | null;
	attributes: unknown;
	price: string;
	calculatedPrice: string | null;
	digital: string[] | null;
	shippable: boolean;
	stock: number | null;
	externalId: string | null;
	originalPrice: string;
	prices: {
		createdAt: string;
		updatedAt: string;
		storeId: string;
		currency: string;
		price: string;
		calculatedPrice: string | null;
		variantId: string;
	}[];
};
type ContractShape22 = {
	variant: Omit<ContractShape21, "prices">;
	createdAt: string;
	updatedAt: string;
	position: number;
	bundleId: string;
	variantId: string;
	quantity: number;
	maxQuantity: number | null;
	groupId: string | null;
	forced: boolean;
	defaultSelected: boolean;
};
type ContractShape23 = {
	bundleProducts: ContractShape22[];
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	type: "set" | "product" | "bundle";
	storeId: string;
	slug: string;
	status: "published" | "draft" | "hidden" | null;
	flags: unknown;
	content: JSONContent | null;
	summary: string | null;
	images: string[];
	badge: unknown;
	subscriptionMode: "optional" | "only" | "rolling";
	bundleDiscountPercentage: string | null;
	bundlePriceMode: "fixed" | "amount" | "percent";
	bundleFixedPriceAmount: string | null;
	bundleAmountOffAmount: string | null;
	seo: {
		title?: string | null | undefined;
		description?: string | null | undefined;
		canonical?: string | null | undefined;
	} | null;
	stripeTaxCode: string | null;
	categoryId: string | null;
	brandId: string | null;
	bundleGroups: { id: string; minQuantity: number; maxQuantity: number | null; allowDuplicates: boolean }[];
	productTaxRate: {
		createdAt: string;
		updatedAt: string;
		productId: string;
		taxRateId: string;
		taxRate: {
			id: string;
			name: string;
			createdAt: string;
			updatedAt: string;
			storeId: string;
			label: string | null;
			rate: string;
		};
	} | null;
	productCollections: ContractShape7[];
	setProduct: { allowDuplicates: boolean; selectionCount: number; discountPercentage: string } | null;
};
type ContractShape24 = {
	product: ContractShape23;
	id: string;
	createdAt: string;
	updatedAt: string;
	storeId: string;
	images: string[];
	description: string | null;
	productId: string;
	sku: string | null;
	barcode: string | null;
	width: number | null;
	height: number | null;
	depth: number | null;
	weight: number | null;
	attributes: unknown;
	price: string;
	calculatedPrice: string | null;
	digital: string[] | null;
	shippable: boolean;
	stock: number | null;
	externalId: string | null;
	originalPrice: string;
	prePromotionPrice: string | null;
	preVolumePricingPrice: string | null;
	combinations: {
		createdAt: string;
		updatedAt: string;
		productVariantId: string;
		variantValueId: string;
		variantValue: { id: string; value: string; variantType: { id: string; label: string } };
	}[];
};
type ContractShape25 = {
	selectedVariant: {
		combinations: {
			createdAt: string;
			updatedAt: string;
			productVariantId: string;
			variantValueId: string;
			variantValue: { id: string; value: string; variantType: { id: string; label: string } };
		}[];
		id: string;
		price: string;
		product: { id: string; name: string };
	};
	id: string;
	createdAt: string;
	updatedAt: string;
	position: number;
	quantity: number;
	lineItemId: string;
	selectedVariantId: string;
};
type ContractShape26 = {
	productVariant: ContractShape24;
	preVolumePricingPrice: string | null;
	setSelections: ContractShape25[];
	id: string;
	createdAt: string;
	updatedAt: string;
	quantity: number;
	subscriptionPlanId: string | null;
	productVariantId: string;
	cartId: string;
	attendees: { name: string; email: string | null }[] | null;
	subscriptionPlan: {
		interval: number;
		id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
		storeId: string;
		active: boolean;
		position: number;
		description: string | null;
		cadence: "month" | "week";
		discountPercent: number;
		benefits: string | null;
	} | null;
};
type ContractShape27 = {
	[K in keyof ContractShape24]: K extends "prices"
		? Array<
				(ContractShape24[K] extends readonly (infer TElement)[] ? TElement : never) & {
					priceGross: string;
					calculatedPriceGross: string | null;
				}
			>
		: ContractShape24[K];
};
type ContractShape28 = {
	[K in Extract<
		keyof ContractShape24,
		"calculatedPrice" | "originalPrice" | "prePromotionPrice" | "omnibusPrice"
	> as `${K}Gross`]: string | null;
};
type ContractShape29 = { productVariant: ContractShape27 & { priceGross: string } & ContractShape28 };
type ContractShape30 = {
	id: string;
	createdAt: string;
	updatedAt: string;
	shipping: Omit<ContractShape16, "prices"> | null;
	storeId: string;
	currency: string | null;
	couponId: string | null;
	customerId: string | null;
	stripePaymentIntentId: string | null;
	checkoutSessionId: string | null;
	addonData: Record<string, unknown> | null | undefined;
	shippingId: string | null;
	shippingAddressId: string | null;
	billingAddressId: string | null;
	deliverySlot: unknown;
	ucpSessionStatus:
		| "incomplete"
		| "ready_for_complete"
		| "requires_escalation"
		| "complete_in_progress"
		| "completed"
		| "canceled"
		| null;
	ucpMetadata: {
		buyerEmail?: string;
		buyerName?: string;
		buyerPhone?: string;
		agentId?: string;
		externalReference?: string;
		escalationReason?: string;
	} | null;
	acpSessionStatus: "completed" | "canceled" | "not_ready_for_payment" | "ready_for_payment" | null;
	acpMetadata: {
		buyerEmail?: string;
		buyerName?: string;
		buyerPhone?: string;
		agentId?: string;
		externalReference?: string;
		idempotencyKey?: string;
	} | null;
	coupon: Omit<ContractShape17, "prices"> | null;
	billingAddress: ContractShape18 | null;
	shippingAddress: ContractShape18 | null;
	customer: ContractShape19 | ContractShape20 | null;
	lineItems: (Omit<ContractShape26, "productVariant"> & ContractShape29)[];
	subtotalNet: number | null;
	subtotalGross: number | null;
	subtotal: number | null;
	totalNet: number | null;
	totalGross: number | null;
	total: number | null;
	shippingGross: number | null;
	totalTax: number | null;
	taxBreakdown: Record<
		string,
		{
			taxRate: {
				id: string;
				name: string;
				createdAt: string;
				updatedAt: string;
				storeId: string;
				label: string | null;
				rate: string;
			};
			tax: number;
			ratePercent: number;
		}
	> | null;
	freeShippingThreshold: number | null;
	freeShippingUnlocked: boolean | null;
};
type ContractShape31 = {
	id: string;
	storeId: string;
	name: string;
	price: string;
	freeShippingThreshold: string | null;
	minShippingTime: number | null;
	maxShippingTime: number | null;
	description: string | null;
	addonId: string | null;
	shippingAddon: {
		type: "shipping" | "products" | "analytics" | "invoicing" | "orders";
		storeId: string;
		id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
	} | null;
	type: "courier" | "parcel" | "pickup_point" | "in_store";
	addonData:
		| {
				id: number;
				name: string;
				service: "dpd" | "fedex" | "ups" | "gls" | "poczta" | "inpost" | "orlen" | "dhl";
		  }
		| { carrier: "inpost"; name: string; service: "inpost" }
		| { carrier: "gls"; name: string; service: "gls" }
		| null;
	deliverySlots: unknown;
	shippingTaxRate: {
		shippingId: string;
		taxRateId: string;
		taxRate: {
			id: string;
			storeId: string;
			name: string;
			rate: string;
			label: string | null;
			createdAt: string;
			updatedAt: string;
		};
		createdAt: string;
		updatedAt: string;
	} | null;
	position: number | null;
	createdAt: string;
	updatedAt: string;
	countries: string[] | null;
};
type ContractShape32 = {
	gold?: boolean | null | undefined;
	event?:
		| {
				enabled: boolean;
				startsAt?: string | null | undefined;
				location?: string | null | undefined;
				capacity?: number | null | undefined;
				guestLabel?: string | null | undefined;
				guest?: string | null | undefined;
				attendeeInfo?: "optional" | "none" | "required" | null | undefined;
				salesPaused?: boolean | null | undefined;
		  }
		| null
		| undefined;
	scheduledPublishAt?: string | null | undefined;
	gpsr?:
		| {
				safetyInformation?:
					| { type: "NO_SAFETY_INFORMATION" }
					| { type: "TEXT"; description: string }
					| null
					| undefined;
		  }
		| null
		| undefined;
};
type ContractShape33 = {
	createdAt: string;
	description: unknown;
	id: string;
	image: string | null;
	name: string;
	slug: string;
	storeId: string;
	updatedAt: string;
	filter:
		| { type: "manual" }
		| { type: "dynamicPrice"; min?: number | null | undefined; max?: number | null | undefined }
		| { type: "variantValues"; values: Record<string, string[]> }
		| { type: "newest"; days?: number | null | undefined };
	active: boolean;
	seo?:
		| {
				title?: string | null | undefined;
				description?: string | null | undefined;
				canonical?: string | null | undefined;
		  }
		| null
		| undefined;
};
type ContractShape34 = {
	collection: ContractShape33;
	collectionId: string;
	position: string | null;
	productId: string;
};
type ContractShape35 = {
	id: string;
	sku: string | null;
	barcode: string | null;
	description: string | null;
	price: string;
	shippable: boolean;
	calculatedPrice: string | null;
	stock: number | null;
	depth: number | null;
	width: number | null;
	height: number | null;
	weight: number | null;
	images: string[];
	digital: string[] | null;
	externalId: string | null;
	product: {
		id: string;
		name: string;
		slug: string;
		images: string[];
		productTaxRate: { taxRate: { rate: string; label: string | null } } | null;
	};
	createdAt: string;
	productId: string;
	updatedAt: string;
	attributes: { checked: boolean | null; key: string; value: string }[] | null;
	storeId: string;
	originalPrice?: string | null | undefined;
};
type ContractShape36 = {
	bundleId: string;
	variantId: string;
	groupId: string | null;
	quantity: number;
	position: number;
	forced: boolean;
	defaultSelected: boolean;
	maxQuantity: number | null;
	createdAt: string;
	updatedAt: string;
	variant: ContractShape35 & { originalPrice: string };
};
type ContractShape37 = {
	id: string;
	name: string;
	slug: string;
	status: "published" | "draft" | "hidden" | null;
	images: string[];
	badge: {
		content?: string | undefined;
		backgroundColor?: string | undefined;
		textColor?: string | undefined;
	} | null;
	storeId: string;
	categoryId: string | null;
	brandId: string | null;
	summary: string | null;
	content: unknown;
	createdAt: string;
	updatedAt: string;
	productTaxRate: {
		productId: string;
		taxRateId: string;
		taxRate: {
			id: string;
			storeId: string;
			name: string;
			rate: string;
			label: string | null;
			createdAt: string;
			updatedAt: string;
		};
		createdAt: string;
		updatedAt: string;
	} | null;
	flags: ContractShape32 | null;
	type: "set" | "product" | "bundle";
	subscriptionMode: "optional" | "only" | "rolling";
	bundleDiscountPercentage: string | null;
	bundlePriceMode: "fixed" | "amount" | "percent";
	bundleFixedPriceAmount: string | null;
	bundleAmountOffAmount: string | null;
	productCollections: ContractShape34[];
	bundleGroups: { id: string; minQuantity: number; maxQuantity: number | null; allowDuplicates: boolean }[];
	bundleProducts: ContractShape36[];
	setProduct: { selectionCount: number; allowDuplicates: boolean; discountPercentage: string } | null;
	seo: {
		title?: string | null | undefined;
		description?: string | null | undefined;
		canonical?: string | null | undefined;
	} | null;
	stripeTaxCode: string | null;
	active?: boolean | null | undefined;
};
type ContractShape38 = {
	id: string;
	sku: string | null;
	barcode: string | null;
	description: string | null;
	price: string;
	calculatedPrice: string | null;
	prePromotionPrice: string | null;
	preVolumePricingPrice: string | null;
	stock: number | null;
	depth: number | null;
	width: number | null;
	height: number | null;
	weight: number | null;
	images: string[];
	digital: string[] | null;
	shippable: boolean;
	externalId: string | null;
	product: ContractShape37;
	createdAt: string;
	productId: string;
	updatedAt: string;
	combinations: {
		createdAt: string;
		updatedAt: string;
		productVariantId: string;
		variantValueId: string;
		variantValue: {
			id: string;
			value: string;
			variantType: {
				id: string;
				label: string;
				productId?: string | null | undefined;
				createdAt?: string | null | undefined;
				updatedAt?: string | null | undefined;
			};
			variantTypeId?: string | null | undefined;
		};
	}[];
	attributes: { checked: boolean | null; key: string; value: string }[] | null;
	storeId: string;
	originalPrice?: string | null | undefined;
};
type ContractShape39 = {
	id: string;
	price: string;
	product: { id: string; name: string };
	combinations: {
		createdAt: string;
		updatedAt: string;
		productVariantId: string;
		variantValueId: string;
		variantValue: {
			id: string;
			value: string;
			variantType: {
				id: string;
				label: string;
				productId?: string | null | undefined;
				createdAt?: string | null | undefined;
				updatedAt?: string | null | undefined;
			};
			variantTypeId?: string | null | undefined;
		};
	}[];
};
type ContractShape40 = {
	id: string;
	lineItemId: string;
	selectedVariantId: string;
	quantity: number;
	position: number;
	createdAt: string;
	updatedAt: string;
	selectedVariant: ContractShape39;
};
type ContractShape41 = {
	id: string;
	cartId: string;
	quantity: number;
	unitCost: string | null;
	createdAt: string;
	updatedAt: string;
	productVariant: ContractShape38 & { originalPrice: string };
	productVariantId: string;
	preVolumePricingPrice: string | null;
	subscriptionPlanId: string | null;
	subscriptionPlan: {
		id: string;
		name: string;
		cadence: "month" | "week";
		interval: number;
		discountPercent: number;
		description: string | null;
		benefits: string | null;
		active: boolean;
		createdAt: string;
		position: number;
		storeId: string;
		updatedAt: string;
	} | null;
	rollingCycle: {
		id: string;
		title: string;
		startsAt: string;
		items: {
			productVariantId: string;
			productId: string;
			name: string;
			variantLabel: string | null;
			sku: string | null;
			image: string | null;
			quantity: number;
		}[];
	} | null;
	slotId: string | null;
	attendees:
		| {
				name: string;
				email: string | null;
				phone: string | null;
				dietary: string | null;
				notes: string | null;
		  }[]
		| null;
	setSelections: ContractShape40[];
};
type ContractShape42 = {
	id: string;
	type: "shipping" | "billing" | "merchant";
	company: string | null;
	name: string | null;
	city: string | null;
	line1: string | null;
	line2: string | null;
	postalCode: string | null;
	state: string | null;
	country: string | null;
	phone: string | null;
	taxId: string | null;
	createdAt: string;
	updatedAt: string;
};
type ContractShape43 = {
	id: string;
	email: string | null;
	storeId: string;
	createdAt: string;
	updatedAt: string;
	userId: string | null;
	stripeCustomerId: string | null;
	user: { id: string; name: string; email: string } | null;
	couponId: string | null;
	coupon: {
		type: "fixed" | "percentage";
		value: string;
		code: string;
		startDate: string | null;
		endDate: string | null;
		minProductCount: number | null;
		maxProductCount: number | null;
	} | null;
};
type ContractShape44 = {
	id: string;
	storeId: string;
	shippingId: string | null;
	shipping: ContractShape31 | null;
	createdAt: string;
	lineItems: ContractShape41[];
	updatedAt: string;
	couponId: string | null;
	coupon: {
		type: "fixed" | "percentage";
		value: string;
		code: string;
		startDate: string | null;
		endDate: string | null;
		minProductCount: number | null;
		maxProductCount: number | null;
	} | null;
	billingAddress: ContractShape42 | null;
	shippingAddress: ContractShape42 | null;
	billingAddressId: string | null;
	shippingAddressId: string | null;
	stripePaymentIntentId: string | null;
	checkoutSessionId: string | null;
	stripeInvoice: { id: string; amountPaid: number; currency: string } | null;
	customerId: string | null;
	customer: ContractShape43 | null;
	addonData: { [x: string]: unknown } | null;
	deliverySlot: unknown;
	ucpSessionStatus:
		| "incomplete"
		| "ready_for_complete"
		| "requires_escalation"
		| "complete_in_progress"
		| "completed"
		| "canceled"
		| null;
	ucpMetadata: {
		buyerEmail?: string | undefined;
		buyerName?: string | undefined;
		buyerPhone?: string | undefined;
		agentId?: string | undefined;
		externalReference?: string | undefined;
		escalationReason?: string | undefined;
	} | null;
	acpSessionStatus: "completed" | "canceled" | "not_ready_for_payment" | "ready_for_payment" | null;
	acpMetadata: {
		buyerEmail?: string | undefined;
		buyerName?: string | undefined;
		buyerPhone?: string | undefined;
		agentId?: string | undefined;
		externalReference?: string | undefined;
		idempotencyKey?: string | undefined;
	} | null;
	inventory: { committedAt: string; lines: { variantId: string; quantity: number }[] } | null;
	reservation: { expiredAt: string | null; transferDeclaredAt: string | null } | null;
	freeShippingThreshold: number | null;
	totalNet: number | null;
	subtotalNet: number | null;
	totalGross: number | null;
	subtotalGross: number | null;
	shippingGross: number | null;
	total: number | null;
	subtotal: number | null;
	totalTax: number | null;
	taxBreakdown: Record<
		string,
		{
			taxRate: {
				id: string;
				storeId: string;
				name: string;
				rate: string;
				label: string | null;
				createdAt: string;
				updatedAt: string;
			};
			tax: number | null;
		}
	> | null;
	stripeTaxData: {
		amountTax: number;
		breakdown?:
			| {
					amount: number;
					rate: { displayName: string; percentage: number; jurisdiction?: string | null | undefined };
			  }[]
			| null
			| undefined;
	} | null;
	currency: string | null;
	checkoutConsents:
		| { id: string; content: unknown; required: boolean; accepted: boolean; type: "general" | "newsletter" }[]
		| null;
};
type ContractShape45 = {
	id: string;
	name: string;
	image: string | null;
	createdAt: string;
	updatedAt: string;
	storeId: string;
	slug: string;
	active: boolean;
	position: string;
	description: JSONContent | null;
	seo: {
		title?: string | null | undefined;
		description?: string | null | undefined;
		canonical?: string | null | undefined;
	} | null;
	longDescription: JSONContent | null;
	parentId: string | null;
	products: {
		id: string;
		name: string;
		slug: string;
		status: "published" | "draft" | "hidden" | null;
		summary: string | null;
		images: string[];
	}[];
};
type ContractShape46 = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	type: "set" | "product" | "bundle";
	storeId: string;
	slug: string;
	status: "published" | "draft" | "hidden" | null;
	flags: unknown;
	content: JSONContent | null;
	summary: string | null;
	images: string[];
	badge: unknown;
	subscriptionMode: "optional" | "only" | "rolling";
	bundleDiscountPercentage: string | null;
	bundlePriceMode: "fixed" | "amount" | "percent";
	bundleFixedPriceAmount: string | null;
	bundleAmountOffAmount: string | null;
	seo: {
		title?: string | null | undefined;
		description?: string | null | undefined;
		canonical?: string | null | undefined;
	} | null;
	stripeTaxCode: string | null;
	categoryId: string | null;
	brandId: string | null;
};
type ContractShape47 = {
	position: string | null;
	productId: string;
	collectionId: string;
	product: ContractShape46;
};
type ContractShape48 = {
	id: string;
	name: string;
	image: string | null;
	createdAt: string;
	updatedAt: string;
	storeId: string;
	slug: string;
	active: boolean;
	kind: "product" | "event";
	description: JSONContent | null;
	seo: {
		title?: string | null | undefined;
		description?: string | null | undefined;
		canonical?: string | null | undefined;
	} | null;
	longDescription: JSONContent | null;
	filter:
		| { type: "manual" }
		| { type: "dynamicPrice"; min?: number | null | undefined; max?: number | null | undefined }
		| { type: "variantValues"; values: Record<string, string[]> }
		| { type: "newest"; days?: number | null | undefined };
	group: string | null;
	productCollections: ContractShape47[];
};
export type JSONContent = Record<string, unknown>;
export type APIProductsBrowseResult = Omit<
	{
		data: (
			| ContractShape9
			| ContractShape9
			| ContractShape9
			| {
					matchedVariantIds?: string[] | undefined;
					bundleGroups: {
						id: string;
						minQuantity: number;
						maxQuantity: number | null;
						allowDuplicates: boolean;
					}[];
					id: string;
					name: string;
					createdAt: string;
					updatedAt: string;
					type: "set" | "product" | "bundle";
					storeId: string;
					slug: string;
					status: "published" | "draft" | "hidden" | null;
					flags: unknown;
					content: JSONContent | null;
					summary: string | null;
					images: string[];
					badge: unknown;
					subscriptionMode: "optional" | "only" | "rolling";
					bundleDiscountPercentage: string | null;
					bundlePriceMode: "fixed" | "amount" | "percent";
					bundleFixedPriceAmount: string | null;
					bundleAmountOffAmount: string | null;
					seo: {
						title?: string | null | undefined;
						description?: string | null | undefined;
						canonical?: string | null | undefined;
					} | null;
					stripeTaxCode: string | null;
					categoryId: string | null;
					brandId: string | null;
					category: ContractShape1 | null;
					bundleProducts: ContractShape5[];
					subscriptionPlanProducts: {
						createdAt: string;
						updatedAt: string;
						position: number;
						productId: string;
						subscriptionPlanId: string;
						subscriptionPlan: {
							interval: number;
							id: string;
							name: string;
							createdAt: string;
							updatedAt: string;
							storeId: string;
							active: boolean;
							position: number;
							description: string | null;
							cadence: "month" | "week";
							discountPercent: number;
							benefits: string | null;
						};
					}[];
					productTaxRate: {
						createdAt: string;
						updatedAt: string;
						productId: string;
						taxRateId: string;
						taxRate: {
							id: string;
							name: string;
							createdAt: string;
							updatedAt: string;
							storeId: string;
							label: string | null;
							rate: string;
						};
					} | null;
					productCollections: ContractShape7[];
					variants: ContractShape8[] &
						({ id: string; price: string } & { price: string } & { prePromotionPrice: string | null })[];
					translations: { locale: string }[];
			  }
			| ContractShape9
		)[];
		meta: {
			count: number;
			countPublished: number;
			countDraft: number;
			countHidden: number;
			nextCursor: string | undefined;
		};
	},
	"data"
> & {
	data: Array<
		{
			matchedVariantIds?: string[] | undefined;
			bundleGroups: {
				id: string;
				minQuantity: number;
				maxQuantity: number | null;
				allowDuplicates: boolean;
			}[];
			id: string;
			name: string;
			createdAt: string;
			updatedAt: string;
			type: "set" | "product" | "bundle";
			storeId: string;
			slug: string;
			status: "published" | "draft" | "hidden" | null;
			flags: unknown;
			content: JSONContent | null;
			summary: string | null;
			images: string[];
			badge: unknown;
			subscriptionMode: "optional" | "only" | "rolling";
			bundleDiscountPercentage: string | null;
			bundlePriceMode: "fixed" | "amount" | "percent";
			bundleFixedPriceAmount: string | null;
			bundleAmountOffAmount: string | null;
			seo: {
				title?: string | null | undefined;
				description?: string | null | undefined;
				canonical?: string | null | undefined;
			} | null;
			stripeTaxCode: string | null;
			categoryId: string | null;
			brandId: string | null;
			category: ContractShape1 | null;
			bundleProducts: ContractShape12[];
			subscriptionPlanProducts: {
				createdAt: string;
				updatedAt: string;
				position: number;
				productId: string;
				subscriptionPlanId: string;
				subscriptionPlan: {
					interval: number;
					id: string;
					name: string;
					createdAt: string;
					updatedAt: string;
					storeId: string;
					active: boolean;
					position: number;
					description: string | null;
					cadence: "month" | "week";
					discountPercent: number;
					benefits: string | null;
				};
			}[];
			productTaxRate: {
				createdAt: string;
				updatedAt: string;
				productId: string;
				taxRateId: string;
				taxRate: {
					id: string;
					name: string;
					createdAt: string;
					updatedAt: string;
					storeId: string;
					label: string | null;
					rate: string;
				};
			} | null;
			productCollections: ContractShape7[];
			variants: ({
				[K in keyof Omit<
					| (ContractShape8 & { id: string; price: string } & { prePromotionPrice: string | null })
					| (ContractShape8 & { id: string; price: string } & { price: string } & {
							prePromotionPrice: string | null;
					  })
					| (ContractShape8 & { id: string; price: string } & { prePromotionPrice: string | null }),
					"cost"
				>]: K extends "prices"
					? Array<
							(Omit<
								| (ContractShape8 & { id: string; price: string } & { prePromotionPrice: string | null })
								| (ContractShape8 & { id: string; price: string } & { price: string } & {
										prePromotionPrice: string | null;
								  })
								| (ContractShape8 & { id: string; price: string } & { prePromotionPrice: string | null }),
								"cost"
							>[K] extends readonly (infer TElement)[]
								? TElement
								: never) & { priceGross: string; calculatedPriceGross: string | null }
						>
					: Omit<
							| (ContractShape8 & { id: string; price: string } & { prePromotionPrice: string | null })
							| (ContractShape8 & { id: string; price: string } & { price: string } & {
									prePromotionPrice: string | null;
							  })
							| (ContractShape8 & { id: string; price: string } & { prePromotionPrice: string | null }),
							"cost"
						>[K];
			} & { priceGross: string } & {
				[K in Extract<
					keyof Omit<
						| (ContractShape8 & { id: string; price: string } & { prePromotionPrice: string | null })
						| (ContractShape8 & { id: string; price: string } & { price: string } & {
								prePromotionPrice: string | null;
						  })
						| (ContractShape8 & { id: string; price: string } & { prePromotionPrice: string | null }),
						"cost"
					>,
					"calculatedPrice" | "originalPrice" | "prePromotionPrice" | "omnibusPrice"
				> as `${K}Gross`]: string | null;
			})[];
			translations: { locale: string }[];
		} & { taxRate: { id: string; name: string; rate: number; label: string | null } | null } & {
			lang?: string;
		}
	>;
};
export type APIProductsBrowseQueryParams = {
	offset?: number | undefined;
	limit?: number | undefined;
	cursor?: string | undefined;
	category?: string | undefined;
	collection?: string | undefined;
	brand?: string | undefined;
	priceMin?: number | undefined;
	priceMax?: number | undefined;
	vts?: string | undefined;
	query?: string | undefined;
	active?: boolean | undefined;
	excludeBundles?: boolean | undefined;
	includeEvents?: boolean | undefined;
	orderBy?: "name" | "createdAt" | "price" | undefined;
	orderDirection?: "asc" | "desc" | undefined;
	currency?: string | undefined;
	lang?: string | undefined;
};
export type APIProductFiltersResult = {
	priceBounds: { min: number; max: number };
	variantTypes: { label: string; values: string[] }[];
	categories: { name: string; slug: string }[];
	collections: { name: string; slug: string }[];
	brands: { name: string; slug: string }[];
};
export type APIProductGetByIdResult = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	type: "set" | "product" | "bundle";
	storeId: string;
	slug: string;
	status: "published" | "draft" | "hidden" | null;
	flags: unknown;
	content: JSONContent | null;
	summary: string | null;
	images: string[];
	badge: unknown;
	subscriptionMode: "optional" | "only" | "rolling";
	bundleDiscountPercentage: string | null;
	bundlePriceMode: "fixed" | "amount" | "percent";
	bundleFixedPriceAmount: string | null;
	bundleAmountOffAmount: string | null;
	seo: {
		title?: string | null | undefined;
		description?: string | null | undefined;
		canonical?: string | null | undefined;
	} | null;
	stripeTaxCode: string | null;
	categoryId: string | null;
	brandId: string | null;
	category: ContractShape1 | null;
	bundleProducts: ContractShape12[];
	bundleGroups: {
		id: string;
		position: number;
		minQuantity: number;
		maxQuantity: number | null;
		allowDuplicates: boolean;
	}[];
	subscriptionPlanProducts: {
		createdAt: string;
		updatedAt: string;
		position: number;
		productId: string;
		subscriptionPlanId: string;
		subscriptionPlan: {
			interval: number;
			id: string;
			name: string;
			createdAt: string;
			updatedAt: string;
			storeId: string;
			active: boolean;
			position: number;
			description: string | null;
			cadence: "month" | "week";
			discountPercent: number;
			benefits: string | null;
		};
	}[];
	productTaxRate: {
		createdAt: string;
		updatedAt: string;
		productId: string;
		taxRateId: string;
		taxRate: {
			id: string;
			name: string;
			createdAt: string;
			updatedAt: string;
			storeId: string;
			label: string | null;
			rate: string;
		};
	} | null;
	productCollections: ContractShape7[];
	volumePricingTiers: ({
		id: string;
		createdAt: string;
		updatedAt: string;
		storeId: string;
		productId: string | null;
		price: string;
		minQuantity: number;
		maxQuantity: number | null;
		productVariantId: string | null;
	} & { priceGross: string })[];
	variants: ({
		[K in keyof (Omit<
			ContractShape13 & { id: string; price: string } & { prePromotionPrice: string | null },
			"cost"
		> & { omnibusPrice: string | null })]: K extends "prices"
			? Array<
					((Omit<
						ContractShape13 & { id: string; price: string } & { prePromotionPrice: string | null },
						"cost"
					> & { omnibusPrice: string | null })[K] extends readonly (infer TElement)[]
						? TElement
						: never) & { priceGross: string; calculatedPriceGross: string | null }
				>
			: (Omit<
					ContractShape13 & { id: string; price: string } & { prePromotionPrice: string | null },
					"cost"
				> & { omnibusPrice: string | null })[K];
	} & { priceGross: string } & {
		[K in Extract<
			keyof (Omit<
				ContractShape13 & { id: string; price: string } & { prePromotionPrice: string | null },
				"cost"
			> & { omnibusPrice: string | null }),
			"calculatedPrice" | "originalPrice" | "prePromotionPrice" | "omnibusPrice"
		> as `${K}Gross`]: string | null;
	})[];
	variantsTypes: {
		id: string;
		type: "string" | "color";
		label: string;
		variantValues: { id: string; value: string; position: number | null; colorValue: string | null }[];
	}[];
	translations: { locale: string }[];
} & {
	lang?: string;
	taxRate: { id: string; name: string; rate: number; label: string | null } | null;
	bundle?: {
		discountPercentage: number | null;
		groups: {
			id: string;
			name: string | null;
			position: number;
			minQuantity: number;
			maxQuantity: number | null;
			allowDuplicates: boolean;
			items: {
				variantId: string;
				position: number;
				forced: boolean;
				defaultSelected: boolean;
				fixedQuantity: number;
				maxQuantity: number | null;
				variant: {
					[K in keyof ContractShape14]: K extends "prices"
						? Array<
								(ContractShape14[K] extends readonly (infer TElement)[] ? TElement : never) & {
									priceGross: string;
									calculatedPriceGross: string | null;
								}
							>
						: ContractShape14[K];
				} & { priceGross: string } & {
					[K in Extract<
						keyof ContractShape14,
						"calculatedPrice" | "originalPrice" | "prePromotionPrice" | "omnibusPrice"
					> as `${K}Gross`]: string | null;
				};
			}[];
		}[];
	};
	bundleFixedPriceAmountGross: string | null;
	bundleAmountOffAmountGross: string | null;
	subscriptionCycles?: { current: ContractShape15 | null; upcoming: ContractShape15 | null };
};
export type APIProductGetByIdParams = { idOrSlug: string };
export type APIProductGetByIdQueryParams = { lang?: string; currency?: string };
export type APICartGetResult = ContractShape30;
export type APICartCreateBody = {
	variantId?: string | undefined;
	quantity?: number | undefined;
	mode?: "set" | "add" | undefined;
	cartId?: string | undefined;
	subscriptionPlanId?: string | null | undefined;
	currency?: string | undefined;
	bundleId?: string | undefined;
	selections?: { variantId: string; groupId: string; quantity: number }[] | undefined;
};
export type APICartCreateResult = ContractShape30 | null | undefined;
export type APICartCouponApplyResult = ContractShape30 | null | undefined;
export type APICartCouponRemoveResult = { ok: boolean };
export type APICouponGetByIdResult = {
	id: string;
	code: string;
	type: "fixed" | "percentage";
	value: number;
	timesRedeemed: number;
	maxUses: number | null;
	startDate: string | null;
	endDate: string | null;
	minProductCount: number | null;
	maxProductCount: number | null;
	productIds: string[];
	collectionIds: string[];
	categoryIds: string[];
	brandIds: string[];
	currencyAmounts: { [k: string]: number };
	createdAt: string;
	updatedAt: string;
};
export type APICouponGetByIdParams = { idOrCode: string };
export type APIShipment = {
	id: string;
	status: "unknown" | "pre_transit" | "transit" | "out_for_delivery" | "delivered" | "returned" | "failure";
	carrier: string | null;
	trackingNumber: string | null;
	trackingUrl: string | null;
	shippedAt: string | null;
	deliveredAt: string | null;
	createdAt: string;
	updatedAt: string;
};
export type APIOrderGetByIdResult = Omit<
	{
		id: string;
		createdAt: string;
		updatedAt: string;
		storeId: string;
		status:
			| "completed"
			| "cancelled"
			| "paid"
			| "created"
			| "processing"
			| "shipped"
			| "refunded"
			| "partially_refunded"
			| "reserved";
		environment: "live" | "test";
		source: string | null;
		externalId: string | null;
		customerId: string | null;
		attribution: {
			firstTouch: {
				source: string | null;
				medium: string | null;
				campaign: string | null;
				referrerHost: string | null;
				ts: number;
			};
			lastTouch: {
				source: string | null;
				medium: string | null;
				campaign: string | null;
				referrerHost: string | null;
				ts: number;
			};
		} | null;
		lookup: number;
		cartId: string | null;
		orderData: ContractShape44;
		externalShipmentId: string | null;
		paymentDeduplicationId: string | null;
		paymentProvider: string | null;
		ticketCode: string | null;
		shareToken: string | null;
		reservationExpiresAt: string | null;
		activeSubscriptionId: string | null;
		packedAt: string | null;
		packedBy: string | null;
		tags: string[];
		activeSubscription: {
			interval: number;
			id: string;
			createdAt: string;
			updatedAt: string;
			storeId: string;
			status:
				| "active"
				| "incomplete"
				| "canceled"
				| "trialing"
				| "past_due"
				| "paused"
				| "unpaid"
				| "incomplete_expired";
			stripeCustomerId: string | null;
			environment: "live" | "test";
			stripeSubscriptionId: string;
			cancelAtPeriodEnd: boolean | null;
			productId: string;
			quantity: number;
			cadence: "month" | "week";
			productVariantId: string;
			originalOrderId: string;
			canceledAt: Date | null;
			cancelAt: Date | null;
			cancellationDetails: {
				comment?: string | null;
				feedback?: string | null;
				reason?: string | null;
			} | null;
			productSnapshot: unknown;
			productVariantSnapshot: unknown;
			shippingSnapshot: unknown;
			pausedAt: Date | null;
			resumeAt: Date | null;
			skippedUntil: Date | null;
			skipCount: number;
			nextBillingDate: Date | null;
			stripeDeduplicationId: string | null;
		} | null;
	} & { orderData: ContractShape44 },
	"attribution" | "orderData"
> & {
	orderData: {
		id: string;
		storeId: string;
		shippingId: string | null;
		shipping: (ContractShape31 & { priceGross: string }) | null;
		createdAt: string;
		lineItems: {
			id: string;
			cartId: string;
			quantity: number;
			unitCost: string | null;
			createdAt: string;
			updatedAt: string;
			productVariant: {
				[K in keyof (ContractShape38 & { originalPrice: string })]: K extends "prices"
					? Array<
							((ContractShape38 & { originalPrice: string })[K] extends readonly (infer TElement)[]
								? TElement
								: never) & { priceGross: string; calculatedPriceGross: string | null }
						>
					: (ContractShape38 & { originalPrice: string })[K];
			} & { priceGross: string } & {
				[K in Extract<
					keyof (ContractShape38 & { originalPrice: string }),
					"calculatedPrice" | "originalPrice" | "prePromotionPrice" | "omnibusPrice"
				> as `${K}Gross`]: string | null;
			};
			productVariantId: string;
			preVolumePricingPrice: string | null;
			subscriptionPlanId: string | null;
			subscriptionPlan: {
				id: string;
				name: string;
				cadence: "month" | "week";
				interval: number;
				discountPercent: number;
				description: string | null;
				benefits: string | null;
				active: boolean;
				createdAt: string;
				position: number;
				storeId: string;
				updatedAt: string;
			} | null;
			rollingCycle: {
				id: string;
				title: string;
				startsAt: string;
				items: {
					productVariantId: string;
					productId: string;
					name: string;
					variantLabel: string | null;
					sku: string | null;
					image: string | null;
					quantity: number;
				}[];
			} | null;
			slotId: string | null;
			attendees:
				| {
						name: string;
						email: string | null;
						phone: string | null;
						dietary: string | null;
						notes: string | null;
				  }[]
				| null;
			setSelections: ContractShape40[];
		}[];
		updatedAt: string;
		couponId: string | null;
		coupon: {
			type: "fixed" | "percentage";
			value: string;
			code: string;
			startDate: string | null;
			endDate: string | null;
			minProductCount: number | null;
			maxProductCount: number | null;
		} | null;
		billingAddress: ContractShape42 | null;
		shippingAddress: ContractShape42 | null;
		billingAddressId: string | null;
		shippingAddressId: string | null;
		stripePaymentIntentId: string | null;
		checkoutSessionId: string | null;
		stripeInvoice: { id: string; amountPaid: number; currency: string } | null;
		customerId: string | null;
		customer: ContractShape43 | null;
		addonData: { [x: string]: unknown } | null;
		deliverySlot: unknown;
		ucpSessionStatus:
			| "incomplete"
			| "ready_for_complete"
			| "requires_escalation"
			| "complete_in_progress"
			| "completed"
			| "canceled"
			| null;
		ucpMetadata: {
			buyerEmail?: string | undefined;
			buyerName?: string | undefined;
			buyerPhone?: string | undefined;
			agentId?: string | undefined;
			externalReference?: string | undefined;
			escalationReason?: string | undefined;
		} | null;
		acpSessionStatus: "completed" | "canceled" | "not_ready_for_payment" | "ready_for_payment" | null;
		acpMetadata: {
			buyerEmail?: string | undefined;
			buyerName?: string | undefined;
			buyerPhone?: string | undefined;
			agentId?: string | undefined;
			externalReference?: string | undefined;
			idempotencyKey?: string | undefined;
		} | null;
		inventory: { committedAt: string; lines: { variantId: string; quantity: number }[] } | null;
		reservation: { expiredAt: string | null; transferDeclaredAt: string | null } | null;
		freeShippingThreshold: number | null;
		totalNet: number | null;
		subtotalNet: number | null;
		totalGross: number | null;
		subtotalGross: number | null;
		shippingGross: number | null;
		total: number | null;
		subtotal: number | null;
		totalTax: number | null;
		taxBreakdown: Record<
			string,
			{
				taxRate: {
					id: string;
					storeId: string;
					name: string;
					rate: string;
					label: string | null;
					createdAt: string;
					updatedAt: string;
				};
				tax: number | null;
			}
		> | null;
		stripeTaxData: {
			amountTax: number;
			breakdown?:
				| {
						amount: number;
						rate: { displayName: string; percentage: number; jurisdiction?: string | null | undefined };
				  }[]
				| null
				| undefined;
		} | null;
		currency: string | null;
		checkoutConsents:
			| {
					id: string;
					content: unknown;
					required: boolean;
					accepted: boolean;
					type: "general" | "newsletter";
			  }[]
			| null;
	};
	trackingNumber: string | null;
	shipments: APIShipment[];
};
export type APIOrderGetByIdParams = { id: string };
export type APICategoriesBrowseResult = Omit<
	{
		data: {
			id: string;
			name: string;
			image: string | null;
			createdAt: string;
			updatedAt: string;
			slug: string;
			active: boolean;
			position: string;
			description: JSONContent | null;
			parentId: string | null;
		}[];
		meta: { count: number };
	},
	"data"
> & {
	data: Array<
		{
			data: {
				id: string;
				name: string;
				image: string | null;
				createdAt: string;
				updatedAt: string;
				slug: string;
				active: boolean;
				position: string;
				description: JSONContent | null;
				parentId: string | null;
			}[];
			meta: { count: number };
		}["data"][number] & { lang?: string }
	>;
};
export type APICategoriesBrowseQueryParams = {
	offset?: number | undefined;
	limit?: number | undefined;
	query?: string | undefined;
	active?: boolean | undefined;
	lang?: string | undefined;
};
export type APICategoryGetByIdResult = (
	| {
			id: string;
			name: string;
			image: string | null;
			createdAt: string;
			updatedAt: string;
			storeId: string;
			slug: string;
			active: boolean;
			position: string;
			description: JSONContent | null;
			seo: {
				title?: string | null | undefined;
				description?: string | null | undefined;
				canonical?: string | null | undefined;
			} | null;
			longDescription: JSONContent | null;
			parentId: string | null;
			products: {
				id: string;
				name: string;
				slug: string;
				status: "published" | "draft" | "hidden" | null;
				summary: string | null;
				images: string[];
			}[];
			parent: {
				id: string;
				name: string;
				image: string | null;
				createdAt: string;
				updatedAt: string;
				storeId: string;
				slug: string;
				active: boolean;
				position: string;
				description: JSONContent | null;
				seo: {
					title?: string | null | undefined;
					description?: string | null | undefined;
					canonical?: string | null | undefined;
				} | null;
				longDescription: JSONContent | null;
				parentId: string | null;
				products: {
					id: string;
					name: string;
					slug: string;
					status: "published" | "draft" | "hidden" | null;
					summary: string | null;
					images: string[];
				}[];
				parent: ContractShape45 | null;
			} | null;
			children: {
				id: string;
				name: string;
				image: string | null;
				createdAt: string;
				updatedAt: string;
				storeId: string;
				slug: string;
				active: boolean;
				position: string;
				description: JSONContent | null;
				seo: {
					title?: string | null | undefined;
					description?: string | null | undefined;
					canonical?: string | null | undefined;
				} | null;
				longDescription: JSONContent | null;
				parentId: string | null;
				products: {
					id: string;
					name: string;
					slug: string;
					status: "published" | "draft" | "hidden" | null;
					summary: string | null;
					images: string[];
				}[];
				children: ContractShape45[];
			}[];
	  }
	| ContractShape1
) & { lang?: string };
export type APICategoryGetByIdParams = { idOrSlug: string };
export type APICollectionsBrowseResult = Omit<
	{
		data: {
			id: string;
			name: string;
			image: string | null;
			createdAt: string;
			slug: string;
			active: boolean;
			description: JSONContent | null;
			group: string | null;
			productCollections: { productId: string }[];
			translations: { locale: string }[];
		}[];
		meta: { count: number };
	},
	"data"
> & {
	data: Array<
		{
			data: {
				id: string;
				name: string;
				image: string | null;
				createdAt: string;
				slug: string;
				active: boolean;
				description: JSONContent | null;
				group: string | null;
				productCollections: { productId: string }[];
				translations: { locale: string }[];
			}[];
			meta: { count: number };
		}["data"][number] & { lang?: string }
	>;
};
export type APICollectionsBrowseQueryParams = {
	offset?: number | undefined;
	limit?: number | undefined;
	query?: string | undefined;
	active?: boolean | undefined;
	group?: string | undefined;
	lang?: string | undefined;
};
export type APICollectionGetByIdResult = (ContractShape48 | ContractShape48) & { lang?: string };
export type APICollectionGetByIdParams = { idOrSlug: string };
export type APIMeStore = {
	id: string;
	name: string;
	subdomain: string;
	domain: string | null;
	domainVerified: boolean;
	currency: string;
	taxBehavior: "inclusive" | "exclusive";
	locale: string;
	published: boolean;
	environment: "live" | "test";
	settings: {
		storeName: string | null | undefined;
		storeDescription: string | null | undefined;
		socials:
			| {
					email?: string | null | undefined;
					instagram?: string | null | undefined;
					linkedin?: string | null | undefined;
					x?: string | null | undefined;
					facebook?: string | null | undefined;
					youtube?: string | null | undefined;
					tiktok?: string | null | undefined;
			  }
			| null
			| undefined;
		freeShippingThreshold: string | number | bigint | null | undefined;
		freeShippingThresholds: Record<string, string> | null | undefined;
		pageWidth: "default" | "full" | "narrow" | "wider" | "widest" | null | undefined;
		fontFamily:
			| "default"
			| "roboto"
			| "poppins"
			| "inter"
			| "merriweather"
			| "montserrat"
			| "nunito"
			| "inconsolata"
			| "ibmPlexSans"
			| "cardo"
			| "spaceMono"
			| "buenard"
			| "titanOne"
			| "bartok"
			| "robotoSlab"
			| "playwritePl"
			| "jetBrainsMono"
			| null
			| undefined;
		fontFamilyHeadings:
			| "default"
			| "roboto"
			| "poppins"
			| "inter"
			| "merriweather"
			| "montserrat"
			| "nunito"
			| "inconsolata"
			| "ibmPlexSans"
			| "cardo"
			| "spaceMono"
			| "buenard"
			| "titanOne"
			| "bartok"
			| "robotoSlab"
			| "playwritePl"
			| "jetBrainsMono"
			| null
			| undefined;
		fontSizes:
			| {
					h2?: number | null | undefined;
					h3?: number | null | undefined;
					h4?: number | null | undefined;
					h5?: number | null | undefined;
					text?: number | null | undefined;
			  }
			| null
			| undefined;
		logo:
			| string
			| { imageUrl: string; width?: number | null | undefined; height?: number | null | undefined }
			| null
			| undefined;
		ogimage: string | null | undefined;
		favicon:
			| { imageUrl: string; width?: number | null | undefined; height?: number | null | undefined }
			| null
			| undefined;
		colors:
			| {
					paletteName?: string | null | undefined;
					palette?:
						| {
								theme?: { background?: string | undefined } | undefined;
								"theme-primary"?:
									| { DEFAULT?: string | undefined; background?: string | undefined }
									| undefined;
								"theme-button"?:
									| { DEFAULT?: string | undefined; background?: string | undefined }
									| undefined;
						  }
						| undefined;
			  }
			| null
			| undefined;
		buttons:
			| {
					borderWidth?: number | null | undefined;
					borderRadius?: "none" | "sm" | "md" | "lg" | "full" | null | undefined;
					shadow?: "none" | "sm" | "md" | "lg" | null | undefined;
					colors?:
						| {
								background?: string | null | undefined;
								text?: string | null | undefined;
								backgroundHover?: string | null | undefined;
								textHover?: string | null | undefined;
								border?: string | null | undefined;
						  }
						| null
						| undefined;
			  }
			| null
			| undefined;
		cartIcon: "shopping-bag" | "shopping-cart" | "shopping-basket" | null | undefined;
		checkoutAppearance:
			| {
					summaryPosition?: "left" | "right" | null | undefined;
					summaryBackground?: "custom" | "tint" | "plain" | null | undefined;
					summaryBackgroundColor?: string | null | undefined;
					cornerRadius?: "small" | "none" | "medium" | "large" | null | undefined;
					payButtonLabel?: "pay" | "completeOrder" | "placeOrder" | null | undefined;
					showHeader?: boolean | null | undefined;
					showPolicyLinks?: boolean | null | undefined;
					hideExpressWallets?: boolean | null | undefined;
					fontFamily?:
						| "default"
						| "roboto"
						| "poppins"
						| "inter"
						| "merriweather"
						| "montserrat"
						| "nunito"
						| "inconsolata"
						| "ibmPlexSans"
						| "cardo"
						| "spaceMono"
						| "buenard"
						| "titanOne"
						| "bartok"
						| "robotoSlab"
						| "playwritePl"
						| "jetBrainsMono"
						| null
						| undefined;
					colors?:
						| { buttonBackground?: string | null | undefined; buttonText?: string | null | undefined }
						| null
						| undefined;
			  }
			| null
			| undefined;
		productCards: { borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | null | undefined } | null | undefined;
		blogFilterConfig:
			| {
					mode: "simple" | "faceted";
					facets: {
						id: string;
						label: string;
						type: "single" | "multiple";
						options: { value: string; label: string }[];
					}[];
			  }
			| null
			| undefined;
		omnibus: boolean | null | undefined;
		enabledTools: {
			blog: boolean;
			newsletter: boolean;
			loyalty: boolean;
			reviews: boolean;
			productSubscriptions: boolean;
			contactForm: boolean;
			wishlist: boolean;
			cookieConsent: boolean;
			auctions: boolean;
			surveys: boolean;
			bookings: boolean;
			productSets: boolean;
			restockNotifications: boolean;
			abandonedCarts: boolean;
			newsletterPopup: boolean;
			stripeTaxes: boolean;
			translations: boolean;
			cartRecommendations: boolean;
			withdrawalButton: boolean;
			events: boolean;
			storeChat: boolean;
			serialNumbers: boolean;
			wholesale: boolean;
		} | null;
		defaultLanguage: "en-US" | "fr-FR" | "it-IT" | "pl-PL" | "es-ES" | "de-DE" | null | undefined;
		enabledLanguages: {
			"en-US": boolean;
			"fr-FR": boolean;
			"it-IT": boolean;
			"pl-PL": boolean;
			"es-ES": boolean;
			"de-DE": boolean;
		} | null;
		enabledCurrencies: string[] | null | undefined;
		newsletterPopup:
			| {
					delaySeconds: number;
					heading?: string | undefined;
					subheading?: string | undefined;
					ctaText?: string | undefined;
					teaserText?: string | undefined;
					imageUrl?: string | undefined;
					discountCode?: string | undefined;
			  }
			| null
			| undefined;
		welcomeOffer:
			| {
					enabled: boolean;
					mode: "shared" | "unique";
					discountType: "fixed" | "percentage";
					expiryDays: number;
					sharedCouponId?: string | null | undefined;
					sharedCouponCode?: string | null | undefined;
					uniquePrefix?: string | null | undefined;
					discountValue?: number | null | undefined;
					reminderDaysBefore?: number | null | undefined;
			  }
			| null
			| undefined;
		cartRecommendations: { layout: "inline" | "sidebar" } | null | undefined;
		storeChat: {
			assistantName: string | null;
			greeting: string | null;
			suggestedQuestions: string[] | null;
		} | null;
	} | null;
};
export type APIMeGetResult = { store: APIMeStore; storeBaseUrl: string; publicUrl: string };
export type APIPostsBrowseResult = {
	data: {
		id: string;
		title: string;
		slug: string;
		content: JSONContent;
		image: string | null;
		tag: string | null;
		filters: unknown;
		active: boolean;
		publishedAt: string | null;
		createdAt: string;
	}[];
	meta: { count: number; offset: number; limit: number };
};
export type APIPostsBrowseQueryParams = {
	offset?: number;
	limit?: number;
	query?: string;
	active?: boolean;
	tag?: string;
	categoryId?: string;
};
export type APIPostGetByIdResult =
	| {
			id: string;
			image: string | null;
			createdAt: string;
			updatedAt: string;
			storeId: string;
			slug: string;
			active: boolean;
			content: JSONContent;
			title: string;
			seo: {
				title?: string | null | undefined;
				description?: string | null | undefined;
				canonical?: string | null | undefined;
			} | null;
			tag: string | null;
			filters: unknown;
			publishedAt: string | null;
	  }
	| null
	| undefined;
export type APIPostGetByIdParams = { idOrSlug: string };
export type APISubscriberCreateBody = {
	email: string;
	name?: string;
	placement?: string;
	marketingConsent?: boolean;
};
export type APISubscriberCreateResult = {
	id: string;
	email: string;
	name: string | null;
	source: string;
	placement: string | null;
	pending: boolean;
	marketingConsentAt: string | null;
	createdAt: string;
	welcomeOffer: { status: "queued" | "pending_confirmation" | "off" };
};
export type APIContactMessageCreateBody = { email: string; message: string };
export type APIContactMessageCreateResult =
	| {
			id: string;
			email: string;
			createdAt: string;
			updatedAt: string;
			storeId: string;
			message: string;
			routingKey: string | null;
			readAt: string | null;
	  }
	| undefined;
export type APILegalPagesBrowseResult = {
	data: {
		id: string;
		key: "terms" | "privacyPolicy" | "returns";
		label: string;
		contentHtml: string | null;
		contentJson: JSONContent;
		href: string;
		locale: "en-US" | "fr-FR" | "it-IT" | "pl-PL" | "es-ES" | "de-DE";
		isFallback: boolean;
		createdAt: string;
		updatedAt: string;
	}[];
};
export type APILegalPagesBrowseQueryParams = { lang?: string };
export type APILegalPageGetByPathResult = {
	id: string;
	key: "terms" | "privacyPolicy" | "returns";
	label: string;
	contentHtml: string | null;
	contentJson: JSONContent;
	href: string;
	locale: "en-US" | "fr-FR" | "it-IT" | "pl-PL" | "es-ES" | "de-DE";
	isFallback: boolean;
	createdAt: string;
	updatedAt: string;
} | null;
export type APILegalPageGetByPathQueryParams = { lang?: string };
export type APIProductReviewsBrowseResult = {
	data: Array<{ id: string; author: string; content: string; rating: number; createdAt: string }>;
	meta: { count: number; offset: number; limit: number };
	summary: { averageRating: number; reviewCount: number };
};
export type APIProductReviewsBrowseQueryParams = { offset?: number; limit?: number };
export type APIProductReviewCreateBody = { author: string; email: string; content: string; rating: number };
export type APIProductReviewCreateResult = {
	id: string;
	author: string;
	content: string;
	rating: number;
	createdAt: string;
};
export type APISearchResult = {
	items: {
		type: "product";
		id: string;
		name: string;
		slug: string;
		summary: string | null;
		image: string | null;
		relevance: number;
	}[];
	pagination: { total: number; offset: number; limit: number; hasMore: boolean };
};
export type APISearchQueryParams = { query: string; limit?: number; offset?: number };
export interface CommerceAdapter {
	meGet(): Promise<APIMeGetResult>;
	productBrowse(params: APIProductsBrowseQueryParams): Promise<APIProductsBrowseResult>;
	productGet(
		params: APIProductGetByIdParams & APIProductGetByIdQueryParams,
	): Promise<APIProductGetByIdResult | null>;
	productFilters(): Promise<APIProductFiltersResult>;
	orderGet(params: APIOrderGetByIdParams): Promise<APIOrderGetByIdResult | null>;
	cartUpsert(body: APICartCreateBody): Promise<APICartCreateResult>;
	cartAddBundle(params: {
		bundleId: string;
		selections: NonNullable<APICartCreateBody["selections"]>;
		cartId?: string;
		currency?: string;
	}): Promise<APICartCreateResult>;
	cartGet(params: { cartId: string }): Promise<APICartGetResult | null>;
	cartCouponApply(params: { cartId: string; code: string }): Promise<APICartCouponApplyResult>;
	cartCouponRemove(params: { cartId: string }): Promise<APICartCouponRemoveResult>;
	couponGet(params: APICouponGetByIdParams): Promise<APICouponGetByIdResult | null>;
	collectionBrowse(params: APICollectionsBrowseQueryParams): Promise<APICollectionsBrowseResult>;
	collectionGet(params: APICollectionGetByIdParams): Promise<APICollectionGetByIdResult | null>;
	categoriesBrowse(params: APICategoriesBrowseQueryParams): Promise<APICategoriesBrowseResult>;
	categoryGet(params: APICategoryGetByIdParams): Promise<APICategoryGetByIdResult | null>;
	postBrowse(params?: APIPostsBrowseQueryParams): Promise<APIPostsBrowseResult>;
	postGet(params: APIPostGetByIdParams): Promise<APIPostGetByIdResult | null>;
	legalPageBrowse(queryParams?: APILegalPagesBrowseQueryParams): Promise<APILegalPagesBrowseResult>;
	legalPageGet(
		key: string,
		queryParams?: APILegalPageGetByPathQueryParams,
	): Promise<APILegalPageGetByPathResult>;
	productReviewsBrowse(
		params: APIProductGetByIdParams,
		queryParams?: APIProductReviewsBrowseQueryParams,
	): Promise<APIProductReviewsBrowseResult>;
	productReviewCreate(
		params: APIProductGetByIdParams,
		body: APIProductReviewCreateBody,
	): Promise<APIProductReviewCreateResult>;
	subscriberCreate(body: APISubscriberCreateBody): Promise<APISubscriberCreateResult>;
	contactMessageCreate(body: APIContactMessageCreateBody): Promise<APIContactMessageCreateResult>;
	request<TResponse = unknown, TBody = unknown>(
		pathname: `/${string}`,
		options?: {
			method?: "GET" | "POST" | "PATCH" | "DELETE";
			body?: TBody;
			query?: Record<string, string | number | boolean | null | undefined>;
		},
	): Promise<TResponse>;
	search(params: APISearchQueryParams): Promise<APISearchResult>;
}
