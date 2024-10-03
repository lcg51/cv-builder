'use server';
import { AppSidebar } from '../../components/Sidebar';
import { createClient } from '@/utils/supabase/server';
import { UserProps } from '@/lib/models';
import TopBar from '../../components/TopBar';

export default async function Layout({ children }: { children: React.ReactNode }) {
	const { data } = await createClient().auth.getUser();

	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<div className="hidden border-r bg-muted/40 md:block">
				<AppSidebar />
			</div>
			<div className="flex flex-col">
				<TopBar user={data.user as unknown as UserProps} />
				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
			</div>
		</div>
	);
}
