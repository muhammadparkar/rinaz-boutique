"use client";
import { type Area, canEdit } from "@/lib/admin/model";
import { Administration } from "./administration";
import { Categories, Products } from "./catalog";
import { Cms } from "./cms";
import { DesignSystem } from "./design-system";
import { Inventory } from "./inventory";
import { MediaLibrary } from "./media";
import { Preview } from "./preview";
import { useAdmin } from "./provider";
import { EmptyState } from "./shared";

const modules = {
	cms: { component: Cms, area: "cms" },
	products: { component: Products, area: "catalog" },
	categories: { component: Categories, area: "catalog" },
	inventory: { component: Inventory, area: "catalog" },
	media: { component: MediaLibrary, area: "media" },
	team: { component: Administration, area: "administration" },
	"design-system": { component: DesignSystem, area: null },
	preview: { component: Preview, area: null },
} as const;
export type AdminModuleName = keyof typeof modules;
export function AdminModule({ name }: { name: AdminModuleName }) {
	const { role } = useAdmin();
	const module = modules[name];
	if (module.area && !canEdit(role, module.area as Area))
		return (
			<EmptyState
				title="This role has a different workspace"
				description="Switch the demo role in the header to access this module. This is a permission simulation, not authentication."
			/>
		);
	const Component = module.component;
	return <Component key={`${name}-${role}`} />;
}
