import { Package } from 'lucide-react';

export const useDashboardNavItems = () => {
	const navItems = [
		{
			href: '/admin/products',
			label: 'Products',
			icon: <Package className="h-6 w-6" />
		}
	];

	return navItems;
};
