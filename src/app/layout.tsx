import type { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
	title: 'Portfolio App',
	description: 'Portfolio brought by Next.js'
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
