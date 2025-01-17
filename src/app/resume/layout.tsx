'use server';
import { UserProps } from '@/lib/models';
import TopBar from '../components/TopBar';
import { auth } from '@/auth';
import { Suspense } from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
	const session = await auth();

	return (
		<div>
			<div className="flex flex-col">
				<Suspense fallback={<div>Loading...</div>}>
					<TopBar user={session?.user as unknown as UserProps} />
				</Suspense>
				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
			</div>
		</div>
	);
}
