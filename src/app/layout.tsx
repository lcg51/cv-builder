import type { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider';
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
				<head>
					<script
						dangerouslySetInnerHTML={{
							__html: `
							// On page load or when changing themes, best to add inline in \`head\` to avoid FOUC
							document.documentElement.classList.toggle(
								"dark",
								localStorage.theme === "dark" ||
									(!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
							);
							// Whenever the user explicitly chooses light mode
							localStorage.theme = "light";
							// Whenever the user explicitly chooses dark mode
							localStorage.theme = "dark";
							// Whenever the user explicitly chooses to respect the OS preference
							localStorage.removeItem("theme");
						`
						}}
					/>
				</head>
				<body className="antialiased">
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						<TopBar user={(session?.user as unknown as UserProps) || null} />
						{children}
					</ThemeProvider>
				</body>
			</html>
		</HypertuneProvider>
	);
}
