import type { Metadata, Viewport } from 'next';
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
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { User } from '@/app/models/auth';
import { CmsTokenSync } from './providers/CmsTokenSync';

export const metadata: Metadata = {
	title: 'CV Builder',
	description: 'Create professional CVs and resumes with ease',
	icons: {
		icon: '/favicon.svg',
		shortcut: '/favicon.svg',
		apple: '/favicon.svg'
	}
};

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#0f172a' }
	],
	colorScheme: 'light dark'
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	const messages = await getMessages();
	const locale = await getLocale();
	const $t = await getTranslations('common');

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className="antialiased bg-white dark:bg-slate-900">
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:shadow dark:focus:bg-slate-900 dark:focus:text-white"
				>
					{$t('skipToContent')}
				</a>
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						<IPProvider debugMode={process.env.NODE_ENV === 'development'}>
							<FormValidationProvider>
								<NavigationGuardProvider>
									<ModalProvider>
										<CmsTokenSync token={session?.cmsToken} />
										<TopBar user={session?.user as User} />
										<main id="main-content">{children}</main>
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
