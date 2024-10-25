import { createClient } from '@/utils/supabase/server';

export const getProducts = async () => {
	const { data: products, error } = await createClient().from('Products').select('*');

	if (error) {
		throw error;
	}

	return products ?? [];
};

export const getProductById = async (id: string) => {
	const { data: product, error } = await createClient().from('Products').select('*').eq('id', id);

	if (error) {
		throw error;
	}

	return product ?? [];
};
