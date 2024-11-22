'use server';
import { AppSidebar } from '../../components/Sidebar';
import { UserProps } from '@/lib/models';
import TopBar from '../../components/TopBar';
import { auth } from '@/auth';
import { Suspense } from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
	const session = await auth();

	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<div className="hidden border-r bg-muted/40 md:block">
				<AppSidebar />
			</div>
			<div className="flex flex-col">
				<Suspense fallback={<div>Loading...</div>}>
					<TopBar user={session?.user as unknown as UserProps} />
				</Suspense>
				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
			</div>
		</div>
	);
}
