'use client';
import { DisplayErrorMessage } from './components/DisplayErrorMessage';
import { useRouter } from 'next/navigation';
import { HomeIcon } from '@/ui/icons';

export default function NotFound() {
	const router = useRouter();

	const handleGoHome = () => {
		router.push('/');
	};

	return (
		<div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
			<DisplayErrorMessage
				errorTitle="Page Not Found"
				errorMsg="Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL."
				errorButtonText="Go Home"
				onClickCallback={handleGoHome}
				errorIcon={<HomeIcon className="w-4 h-4 mr-2" />}
			/>
		</div>
	);
}
