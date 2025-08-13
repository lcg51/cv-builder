import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseNavigationGuardProps {
	hasUnsavedChanges: boolean;
	onConfirmExit: () => void;
}

export function useNavigationGuard({ hasUnsavedChanges, onConfirmExit }: UseNavigationGuardProps) {
	const [showExitDialog, setShowExitDialog] = useState(false);
	const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [hasUnsavedChanges]);

	const attemptNavigation = useCallback(
		(targetUrl: string) => {
			if (hasUnsavedChanges) {
				setPendingNavigation(targetUrl);
				setShowExitDialog(true);
				return false; // Navigation blocked
			}
			return true; // Navigation allowed
		},
		[hasUnsavedChanges]
	);

	const confirmExit = useCallback(() => {
		onConfirmExit();
		setShowExitDialog(false);

		if (pendingNavigation) {
			router.push(pendingNavigation);
		} else {
			router.push('/home');
		}
	}, [onConfirmExit, pendingNavigation, router]);

	const cancelExit = useCallback(() => {
		setShowExitDialog(false);
		setPendingNavigation(null);
	}, []);

	return {
		showExitDialog,
		attemptNavigation,
		confirmExit,
		cancelExit
	};
}
