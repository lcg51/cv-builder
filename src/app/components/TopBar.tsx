'use client';
import Link from 'next/link';
import { ArrowLeft, LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import './TopBar.css';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent } from '@/components/ui/sheet';

import { googleSignOut } from '../server-actions/session';
import { UserProps } from '@/lib/models';
import { getFirstTwoCapitalLetters, getGoogleProfileImage } from '@/lib/helpers';
import { useMemo } from 'react';
import { resumeDataStore } from '@/app/store/resume';

export type TopBarProps = {
	user?: UserProps | null;
};

export default function TopBar({ user }: TopBarProps) {
	const pathname = usePathname();

	const isOnCreatePage = pathname?.includes('/resume/create');

	const userResumeData = resumeDataStore(state => state.userResumeData);
	const shouldShowExitDialog =
		isOnCreatePage &&
		Object.values(userResumeData).some(value => value !== '' && value !== null && value !== undefined);

	// Handle navigation with guard for create page
	const handleNavigation = (targetUrl: string) => {
		if (shouldShowExitDialog) {
			// Dispatch a custom event that the create page can listen to
			window.dispatchEvent(
				new CustomEvent('navigation-attempt', {
					detail: { targetUrl }
				})
			);
			return;
		}
		// For other pages, allow normal navigation
		window.location.href = targetUrl;
	};

	const LoginButton = useMemo(() => {
		return (
			<Link href="/login">
				<Button variant="default" size="sm" className="flex items-center gap-2">
					<span className="sm:inline">Sign In</span>
				</Button>
			</Link>
		);
	}, []);

	return (
		<header className="flex justify-between sticky top-0 z-40 h-14 items-center gap-4 bg-white dark:bg-slate-900 px-4 lg:h-[60px] lg:px-6 topbar-header">
			<Sheet>
				<SheetContent side="left" className="flex flex-col">
					{/* Logo in mobile navigation */}
					<div className="mb-6 p-4 border-b">
						<Link href="/home" className="logo-container">
							<img src="/assets/logo.svg" alt="CV Builder Logo" className="logo-svg" />
						</Link>
					</div>
					<nav className="grid gap-2 text-lg font-medium">
						{/* Quick Back Navigation for Create Page */}
						{isOnCreatePage && (
							<button
								onClick={() => handleNavigation('/home')}
								className="items-center gap-4 rounded-xl px-3 py-2 bg-primary/10 border border-primary/20"
							>
								<ArrowLeft className="h-6 w-6" color="white" />
								<span className="text-white">Back to Home</span>
							</button>
						)}

						{/* Mobile Login/Logout */}
						{user ? (
							<button
								onClick={() => googleSignOut(pathname)}
								className="flex items-center gap-4 rounded-xl px-3 py-2 text-destructive hover:text-destructive/80 bg-destructive/10 border border-destructive/20 mt-4"
							>
								<LogIn className="h-6 w-6 rotate-180" />
								Logout
							</button>
						) : (
							LoginButton
						)}
					</nav>
				</SheetContent>
			</Sheet>

			{/* Back Navigation / Home Button */}
			{isOnCreatePage && (
				<Button
					variant="ghost"
					size="sm"
					className="inline-flex items-center gap-2"
					onClick={() => handleNavigation('/home')}
				>
					<ArrowLeft className="h-4 w-4" color="var(--primary)" />
					<span className="hidden sm:inline text-muted hover:text-foreground">Back to Home</span>
				</Button>
			)}

			{/* Logo - Always visible */}
			<Link
				href="/home"
				className="logo-container text-lg font-semibold text-foreground hover:text-muted-foreground transition-colors"
			>
				<img src="/assets/logo.svg" alt="CV Builder Logo" className="logo-svg" />
			</Link>

			{/* User Menu - Conditional Rendering */}
			{user ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="secondary" size="icon" className="rounded-full">
							<Avatar>
								<AvatarImage
									src={getGoogleProfileImage(user?.image)}
									alt={user?.name || 'User avatar'}
									onError={e => {
										console.log('Avatar image failed to load:', user?.image);
										e.currentTarget.style.display = 'none';
									}}
								/>
								<AvatarFallback>{getFirstTwoCapitalLetters(user?.name)}</AvatarFallback>
							</Avatar>
							<span className="sr-only">Toggle user menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								googleSignOut(pathname);
							}}
						>
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				LoginButton
			)}
		</header>
	);
}
