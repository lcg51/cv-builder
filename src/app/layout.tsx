import type { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider';
import { NavigationGuardProvider } from './providers/NavigationGuardProvider';
import { IPProvider } from './providers/IPProvider';
import { FormValidationProvider } from '../hooks/useFormValidation';
import './globals.css';
import React from 'react';
import { TopBar } from '@/ui/components';
import { auth } from '@/auth';
import getHypertune from '@/hypertune';
import { HypertuneProvider } from '../../generated/hypertune.react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { User } from '@/lib/db';

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
	const messages = await getMessages();

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
					<NextIntlClientProvider messages={messages}>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
							<IPProvider debugMode={process.env.NODE_ENV === 'development'}>
								<FormValidationProvider>
									<NavigationGuardProvider>
										<TopBar user={session?.user as User} />
										{children}
									</NavigationGuardProvider>
								</FormValidationProvider>
							</IPProvider>
						</ThemeProvider>
					</NextIntlClientProvider>
				</body>
			</html>
		</HypertuneProvider>
	);
}
