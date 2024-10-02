'use client';
import Link from 'next/link';
import { CircleUser, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { signOut } from '../server-actions/session';
import { UserProps } from '@/lib/models';
import { getFirstTwoCapitalLetters } from '@/lib/helpers';
import { useDashboardNavItems } from '@/hooks/useNavItems';

export type TopBarProps = {
	user: UserProps;
};

export default function TopBar({ user }: TopBarProps) {
	const navItems = useDashboardNavItems();

	return (
		<header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="shrink-0 md:hidden">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="flex flex-col">
					<nav className="grid gap-2 text-lg font-medium">
						{navItems.map(item => (
							<Link
								href={item.href}
								key={item.href}
								className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
							>
								{item.icon && item.icon}
								{item.label}
							</Link>
						))}
					</nav>
				</SheetContent>
			</Sheet>
			<div className="w-full flex-1"></div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="secondary" size="icon" className="rounded-full">
						<Avatar>
							<AvatarImage src={user?.image ?? ''} />
							<AvatarFallback>{getFirstTwoCapitalLetters(user?.email)}</AvatarFallback>
						</Avatar>
						<CircleUser className="h-5 w-5" />
						<span className="sr-only">Toggle user menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							signOut();
						}}
					>
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
}
