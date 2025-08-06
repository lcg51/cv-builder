'use server';
import { UserProps } from '@/lib/models';
import TopBar from '../components/TopBar';
import { auth } from '@/auth';
import { Suspense } from 'react';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();

	return (
		<div>
			<div className="flex flex-col">
				<Suspense fallback={<div>Loading...</div>}>
					<TopBar user={(session?.user as unknown as UserProps) || null} />
				</Suspense>
				<main className="flex flex-1 flex-col">{children}</main>
			</div>
		</div>
	);
}
