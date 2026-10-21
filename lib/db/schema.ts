import { relations } from "drizzle-orm";
import {
	bigint,
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	image: text("image"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verifications = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const rateLimit = pgTable("rate_limit", {
	id: text("id").primaryKey(),
	key: text("key").notNull().unique(),
	count: integer("count").notNull(),
	lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

export const staffRoles = pgTable("staff_role", {
	userId: text("user_id")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	role: text("role", { enum: ["owner", "editor", "catalog", "operations"] }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminWorkspace = pgTable("admin_workspace", {
	id: text("id").primaryKey(),
	state: jsonb("state").$type<import("@/lib/admin/model").DemoState>().notNull(),
	revision: integer("revision").notNull().default(0),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const mediaAssets = pgTable("media_asset", {
	id: uuid("id").defaultRandom().primaryKey(),
	contentType: text("content_type").notNull(),
	data: text("data").notNull(),
	createdBy: text("created_by")
		.notNull()
		.references(() => users.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("product", {
	id: uuid("id").defaultRandom().primaryKey(),
	sourceId: text("source_id").unique(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	description: text("description").notNull().default(""),
	status: text("status", { enum: ["draft", "active", "archived"] })
		.notNull()
		.default("draft"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const variants = pgTable(
	"variant",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		sourceId: text("source_id").unique(),
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		sku: text("sku").notNull().unique(),
		name: text("name").notNull(),
		stock: integer("stock").notNull().default(0),
		active: boolean("active").notNull().default(true),
	},
	(table) => [index("variant_product_idx").on(table.productId)],
);

export const prices = pgTable(
	"price",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		variantId: uuid("variant_id")
			.notNull()
			.references(() => variants.id, { onDelete: "cascade" }),
		currency: text("currency", { enum: ["INR", "USD"] }).notNull(),
		amountMinor: integer("amount_minor").notNull(),
		approved: boolean("approved").notNull().default(false),
	},
	(table) => [uniqueIndex("price_variant_currency_idx").on(table.variantId, table.currency)],
);

export const carts = pgTable("cart", {
	id: uuid("id").defaultRandom().primaryKey(),
	accessTokenHash: text("access_token_hash").notNull().unique(),
	userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
	currency: text("currency", { enum: ["INR", "USD"] }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cartItems = pgTable(
	"cart_item",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		cartId: uuid("cart_id")
			.notNull()
			.references(() => carts.id, { onDelete: "cascade" }),
		variantId: uuid("variant_id")
			.notNull()
			.references(() => variants.id),
		quantity: integer("quantity").notNull(),
	},
	(table) => [uniqueIndex("cart_item_variant_idx").on(table.cartId, table.variantId)],
);

export const orders = pgTable("store_order", {
	id: uuid("id").defaultRandom().primaryKey(),
	guestAccessTokenHash: text("guest_access_token_hash").notNull().unique(),
	userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
	email: text("email").notNull(),
	currency: text("currency", { enum: ["INR", "USD"] }).notNull(),
	subtotalMinor: integer("subtotal_minor").notNull(),
	discountMinor: integer("discount_minor").notNull().default(0),
	shippingMinor: integer("shipping_minor").notNull(),
	taxMinor: integer("tax_minor").notNull(),
	totalMinor: integer("total_minor").notNull(),
	status: text("status", { enum: ["pending_payment", "paid", "cancelled", "fulfilled"] })
		.notNull()
		.default("pending_payment"),
	shippingAddress: jsonb("shipping_address").notNull(),
	adminNote: text("admin_note"),
	trackingNumber: text("tracking_number"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable(
	"order_item",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		orderId: uuid("order_id")
			.notNull()
			.references(() => orders.id, { onDelete: "cascade" }),
		variantId: uuid("variant_id").references(() => variants.id, { onDelete: "set null" }),
		sku: text("sku").notNull(),
		name: text("name").notNull(),
		quantity: integer("quantity").notNull(),
		unitPriceMinor: integer("unit_price_minor").notNull(),
	},
	(table) => [index("order_item_order_idx").on(table.orderId)],
);

export const paymentAttempts = pgTable(
	"payment_attempt",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		orderId: uuid("order_id")
			.notNull()
			.references(() => orders.id),
		provider: text("provider", { enum: ["razorpay"] }).notNull(),
		providerOrderId: text("provider_order_id").unique(),
		providerPaymentId: text("provider_payment_id").unique(),
		status: text("status", { enum: ["created", "authorized", "captured", "failed", "refunded"] })
			.notNull()
			.default("created"),
		amountMinor: integer("amount_minor").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [index("payment_attempt_order_idx").on(table.orderId)],
);

export const paymentEvents = pgTable("payment_event", {
	id: text("id").primaryKey(),
	provider: text("provider", { enum: ["razorpay"] }).notNull(),
	type: text("type").notNull(),
	payload: jsonb("payload").notNull(),
	receivedAt: timestamp("received_at").notNull().defaultNow(),
});

export const productRelations = relations(products, ({ many }) => ({ variants: many(variants) }));
export const variantRelations = relations(variants, ({ one, many }) => ({
	product: one(products, { fields: [variants.productId], references: [products.id] }),
	prices: many(prices),
}));
