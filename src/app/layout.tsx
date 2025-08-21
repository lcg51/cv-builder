import type { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider';
import { NavigationGuardProvider } from './providers/NavigationGuardProvider';
import './globals.css';
import React from 'react';
import TopBar from './components/TopBar';
import { auth } from '@/auth';
import { UserProps } from '@/lib/models';
import getHypertune from '@/hypertune';
import { HypertuneProvider } from '../../generated/hypertune.react';

export const metadata: Metadata = {
	title: 'CV Builder',
	description: 'Create professional CVs and resumes with ease',
	icons: {
		icon: '/favicon.svg',
		shortcut: '/favicon.svg',
		apple: '/favicon.svg'
	}
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	const hypertune = await getHypertune();

	const serverDehydratedState = hypertune.dehydrate();
	const serverRootArgs = hypertune.getRootArgs();

	return (
		<HypertuneProvider
			createSourceOptions={{
				token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN!
			}}
			dehydratedState={serverDehydratedState}
			rootArgs={serverRootArgs}
		>
			<html lang="en" suppressHydrationWarning>
				<body className="antialiased bg-white dark:bg-slate-900">
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						<NavigationGuardProvider>
							<TopBar user={(session?.user as unknown as UserProps) || null} />
							{children}
						</NavigationGuardProvider>
					</ThemeProvider>
				</body>
			</html>
		</HypertuneProvider>
	);
}
