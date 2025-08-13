'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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

import { googleSignOut } from '../server-actions/session';
import { UserProps } from '@/lib/models';
import { getFirstTwoCapitalLetters, getGoogleProfileImage } from '@/lib/helpers';
import { useMemo } from 'react';
import { useBrowserBackNavigation } from '@/hooks/useBrowserBackNavigation';

export type TopBarProps = {
	user?: UserProps | null;
};

export default function TopBar({ user }: TopBarProps) {
	const pathname = usePathname();
	const { push } = useRouter();
	const isResumeCreatePage = pathname.includes('/resume/create');

	const { triggerNavigationEvent } = useBrowserBackNavigation();

	const handleNavigation = (targetUrl: string) => {
		if (!isResumeCreatePage) {
			push(targetUrl);
			return;
		}

		triggerNavigationEvent(targetUrl);
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
			{/* Back Navigation / Home Button */}
			{/* {isOnCreatePage && (
				<Button
					variant="ghost"
					size="sm"
					className="inline-flex items-center gap-2"
					onClick={() => handleNavigation('/')}
				>
					<ArrowLeft className="h-4 w-4" color="var(--primary)" />
					<span className="hidden sm:inline text-muted hover:text-foreground">Back to Home</span>
				</Button>
			)} */}

			{/* Logo - Always visible */}
			<div
				onClick={() => handleNavigation('/')}
				className="logo-container text-lg font-semibold text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
			>
				<img src="/assets/logo.svg" alt="CV Builder Logo" className="logo-svg" />
			</div>

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
