import { AuthForm } from "@/components/auth-form";

export function AccountAccess() {
	return (
		<div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-5 py-10 sm:px-8 sm:py-16 lg:min-h-[640px] lg:px-12">
			<AuthForm />
		</div>
	);
}
