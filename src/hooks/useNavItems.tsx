import { Home, FileText, User } from 'lucide-react';

export const useDashboardNavItems = () => {
	const navItems = [
		{
			href: '/home',
			label: 'Home',
			icon: <Home className="h-6 w-6" />
		},
		{
			href: '/resume',
			label: 'My Resumes',
			icon: <FileText className="h-6 w-6" />
		},
		{
			href: '/resume/create',
			label: 'Create Resume',
			icon: <User className="h-6 w-6" />
		}
	];

	return navItems;
};
