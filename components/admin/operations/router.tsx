"use client";
import NextLink from "next/link";
import { useSearchParams as useNextSearchParams, usePathname, useRouter } from "next/navigation";
import { type ComponentProps, createContext, useContext, useEffect } from "react";

const Params = createContext<Record<string, string>>({});
export const RouteParams = Params.Provider;
export function adminHref(to: string) {
	const [path = "/", query] = to.split("?");
	const aliases: Record<string, string> = {
		"/": "/admin",
		"/catalog/products": "/admin/products",
		"/catalog/categories": "/admin/categories",
		"/catalog/inventory": "/admin/inventory",
		"/catalog/media": "/admin/media",
		"/cms/homepage": "/admin/cms",
		"/cms/banners": "/admin/cms?section=Hero%20slides",
		"/cms/pages": "/admin/cms?section=Pages%20%26%20SEO",
		"/cms/faqs": "/admin/cms?section=FAQs",
		"/cms/seo": "/admin/cms?section=Pages%20%26%20SEO",
		"/settings/team": "/admin/team",
		"/settings/activity": "/admin/team",
	};
	const target =
		aliases[path] ??
		(path.startsWith("/catalog/products/")
			? "/admin/products"
			: path.startsWith("/admin")
				? path
				: `/admin${path}`);
	return query ? `${target}${target.includes("?") ? "&" : "?"}${query}` : target;
}
export function Link({ to, ...props }: Omit<ComponentProps<typeof NextLink>, "href"> & { to: string }) {
	return <NextLink href={adminHref(to)} {...props} />;
}
export function NavLink({
	to,
	className,
	...props
}: Omit<ComponentProps<typeof NextLink>, "href" | "className"> & {
	to: string;
	className?: string | ((s: { isActive: boolean }) => string);
}) {
	const pathname = usePathname();
	const isActive = pathname === adminHref(to).split("?")[0];
	return (
		<Link
			to={to}
			className={typeof className === "function" ? className({ isActive }) : className}
			aria-current={isActive ? "page" : undefined}
			{...props}
		/>
	);
}
export function useNavigate() {
	const router = useRouter();
	return (to: string) => router.push(adminHref(to));
}
export function useParams() {
	return useContext(Params);
}
export function useSearchParams() {
	const params = useNextSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const set = (
		next: URLSearchParams | Record<string, string> | ((previous: URLSearchParams) => URLSearchParams),
		options?: { replace?: boolean },
	) => {
		const value = typeof next === "function" ? next(new URLSearchParams(params.toString())) : next;
		const target = `${pathname}?${new URLSearchParams(value).toString()}`;
		if (options?.replace) router.replace(target);
		else router.push(target);
	};
	return [params, set] as const;
}
export function Navigate({ to }: { to: string; replace?: boolean }) {
	const router = useRouter();
	useEffect(() => router.replace(adminHref(to)), [to]);
	return null;
}
