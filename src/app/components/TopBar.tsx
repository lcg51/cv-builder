'use client';
import Link from 'next/link';
import { ArrowLeft, LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';

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
import { Sheet, SheetContent } from '@/components/ui/sheet';

import { signOut } from '../server-actions/session';
import { UserProps } from '@/lib/models';
import { getFirstTwoCapitalLetters } from '@/lib/helpers';
import { useDashboardNavItems } from '@/hooks/useNavItems';

export type TopBarProps = {
	user?: UserProps | null;
};

export default function TopBar({ user }: TopBarProps) {
	const navItems = useDashboardNavItems();
	const pathname = usePathname();

	// Check if we're on a page that should show back navigation
	const isOnCreatePage = pathname?.includes('/resume/create');
	const isOnResumePage = pathname?.includes('/resume') && !pathname?.includes('/resume/create');

	return (
		<header className="flex h-14 items-center gap-4 border-b bg-muted px-4 lg:h-[60px] lg:px-6">
			<Sheet>
				<SheetContent side="left" className="flex flex-col">
					<nav className="grid gap-2 text-lg font-medium">
						{/* Quick Back Navigation for Create Page */}
						{isOnCreatePage && (
							<Link
								href="/home"
								className="flex items-center gap-4 rounded-xl px-3 py-2 bg-primary/10 border border-primary/20"
							>
								<ArrowLeft className="h-6 w-6" color="white" />
								<span className="text-white">Back to Home</span>
							</Link>
						)}

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

						{/* Mobile Login/Logout */}
						{user ? (
							<button
								onClick={() => signOut()}
								className="flex items-center gap-4 rounded-xl px-3 py-2 text-destructive hover:text-destructive/80 bg-destructive/10 border border-destructive/20 mt-4"
							>
								<LogIn className="h-6 w-6 rotate-180" />
								Logout
							</button>
						) : (
							<Link
								href="/login"
								className="flex items-center gap-4 rounded-xl px-3 py-2 text-primary hover:text-primary/80 bg-primary/10 border border-primary/20 mt-4"
							>
								<LogIn className="h-6 w-6" />
								Login
							</Link>
						)}
					</nav>
				</SheetContent>
			</Sheet>

			{/* Back Navigation / Home Button */}
			{isOnCreatePage && (
				<Link href="/home">
					<Button
						variant="ghost"
						size="sm"
						className="flex items-center gap-2 text-white hover:text-foreground"
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="hidden sm:inline text-white hover:text-foreground">Back to Home</span>
					</Button>
				</Link>
			)}

			{isOnResumePage && (
				<Link href="/home">
					<Button
						variant="ghost"
						size="sm"
						className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
					>
						<span className="hidden sm:inline">Home</span>
					</Button>
				</Link>
			)}

			{!isOnCreatePage && !isOnResumePage && (
				<Link
					href="/home"
					className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-muted-foreground transition-colors"
				>
					<span className="sm:inline text-white">CV Builder</span>
				</Link>
			)}

			<div className="w-full flex-1"></div>

			{/* User Menu - Conditional Rendering */}
			{user ? (
				// Logged in user - show avatar dropdown
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="secondary" size="icon" className="rounded-full">
							<Avatar>
								<AvatarImage src={user?.image} />
								<AvatarFallback>{getFirstTwoCapitalLetters(user?.email)}</AvatarFallback>
							</Avatar>
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
			) : (
				// Not logged in - show login button
				<Link href="/login">
					<Button variant="default" size="sm" className="flex items-center gap-2">
						<span className="sm:inline text-white">Login</span>
						<LogIn className="h-4 w-4" />
					</Button>
				</Link>
			)}
		</header>
	);
}
