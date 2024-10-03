export const useProducts = () => {
	const products = [
		{
			id: 1,
			name: 'Laser Lemonade Machine',
			price: 499.99,
			createdAt: '2023-07-12 10:42 AM',
			status: 'Draft'
		},
		{
			id: 2,
			name: 'Hypernova Headphones',
			price: 129.99,
			createdAt: '2023-07-12 10:42 AM',
			status: 'Active'
		},
		{
			id: 3,
			name: 'AeroGlow Desk Lamp',
			price: 100,
			createdAt: '2023-10-18 03:21 PM',
			status: 'Active'
		},
		{
			id: 4,
			name: 'AeroGlow Desk Lamp',
			price: 100,
			createdAt: '2023-10-18 03:21 PM',
			status: 'Active'
		},
		{
			id: 5,
			name: 'TechTonic Energy Drink',
			price: 2.99,
			createdAt: '2023-12-25 11:59 PM',
			status: 'Draft'
		}
	];

	return {
		products
	};
};
