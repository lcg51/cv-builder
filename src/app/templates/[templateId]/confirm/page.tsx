import { auth } from '@/auth';
import ConfirmPageClient from './ConfirmPageClient';

export default async function ConfirmPage() {
	const session = await auth();

	return <ConfirmPageClient isAuthenticated={!!session?.user} />;
}
