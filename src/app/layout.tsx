import type { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider';
import { NavigationGuardProvider } from './providers/NavigationGuardProvider';
import { ModalProvider } from './providers/ModalProvider';
import { IPProvider } from './providers/IPProvider';
import { FormValidationProvider } from '../hooks/useFormValidation';
import './globals.css';
import React from 'react';
import { TopBar } from '@/ui/components';
import { auth } from '@/auth';
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

	return (
		<html lang="en" suppressHydrationWarning>
			<body className="antialiased bg-white dark:bg-slate-900">
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						<IPProvider debugMode={process.env.NODE_ENV === 'development'}>
							<FormValidationProvider>
								<NavigationGuardProvider>
									<ModalProvider>
										<TopBar user={session?.user as User} />
										{children}
									</ModalProvider>
								</NavigationGuardProvider>
							</FormValidationProvider>
						</IPProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
