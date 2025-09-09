'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/ui/components/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/components/avatar';
import './TopBar.css';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/ui/components/dropdown-menu';

import { googleSignOut } from '../../../../app/server-actions/session';
import { UserProps } from '@/lib/models';
import { getFirstTwoCapitalLetters, getGoogleProfileImage } from '@/lib/helpers';
import { useBrowserBackNavigation } from '@/hooks/useBrowserBackNavigation';
import { uuidRegex } from '@/lib/utils';
import Image from 'next/image';

export type TopBarProps = {
	user?: UserProps | null;
};

export const TopBar = ({ user }: TopBarProps) => {
	const pathname = usePathname();
	const { push } = useRouter();

	const isTemplateDetailPage = pathname.includes('/templates') && uuidRegex.test(pathname);

	const { triggerNavigationEvent } = useBrowserBackNavigation();

	const handleNavigation = (targetUrl: string) => {
		if (!isTemplateDetailPage) {
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
			{/* Logo - Always visible */}
			<div
				onClick={() => handleNavigation('/')}
				className="logo-container text-lg font-semibold text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
			>
				<Image src="/assets/logo.svg" alt="CV Builder Logo" className="logo-svg" width={150} height={150} />
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
};
