import { getProductById } from '../products.actions';

export default async function ProductDetail({ params }: { params: { productId: string } }) {
	const product = await getProductById(params.productId);

	return <div className="flex flex-1 flex-col gap-4">This is a product page {JSON.stringify(product)}</div>;
}
