import Image from "next/image";
import { AuthForm } from "@/components/auth-form";

export function AccountAccess() {
	return (
		<div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
			<div className="grid min-w-0 lg:min-h-[640px] lg:grid-cols-2">
				<div className="relative hidden overflow-hidden bg-secondary lg:block">
					<Image
						src="https://images.unsplash.com/photo-1724412665971-114bd351a42d?w=1400&q=80&auto=format&fit=crop"
						alt="Black abaya with champagne gold embroidery"
						fill
						sizes="(min-width: 1280px) 592px, 50vw"
						className="object-cover object-top"
					/>
					<div className="absolute inset-x-0 bottom-0 bg-neutral-950/80 p-8 text-[#faf7f2] xl:p-10">
						<p className="font-display text-3xl leading-tight xl:text-4xl">Timeless Style.</p>
						<p className="mt-2 font-display text-3xl leading-tight italic xl:text-4xl">Modern Luxury.</p>
					</div>
				</div>
				<div className="flex min-w-0 items-center justify-center lg:px-10 lg:py-12 xl:px-16">
					<AuthForm />
				</div>
			</div>
		</div>
	);
}
