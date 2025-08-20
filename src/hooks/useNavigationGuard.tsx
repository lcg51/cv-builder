import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseNavigationGuardProps {
	hasUnsavedChanges: boolean;
	onConfirmExit: () => void;
}

interface NavigationEventDetail {
	targetUrl: string;
	isBrowserNavigation?: boolean;
	previousPath?: string;
	navigationType?: 'forward' | 'back';
}

export function useNavigationGuard({ hasUnsavedChanges, onConfirmExit }: UseNavigationGuardProps) {
	const [showExitDialog, setShowExitDialog] = useState(false);
	const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
	const router = useRouter();

	const attemptNavigation = useCallback(
		(targetUrl: string) => {
			if (hasUnsavedChanges) {
				setPendingNavigation(targetUrl);
				setShowExitDialog(true);
				return false;
			}
			return true;
		},
		[hasUnsavedChanges]
	);

	useEffect(() => {
		const handleNavigationAttempt = (event: CustomEvent<NavigationEventDetail>) => {
			const { targetUrl } = event.detail;
			if (hasUnsavedChanges) {
				attemptNavigation(targetUrl);
			}
		};

		window.addEventListener('navigation-attempt', handleNavigationAttempt as EventListener);
		return () => window.removeEventListener('navigation-attempt', handleNavigationAttempt as EventListener);
	}, [hasUnsavedChanges, attemptNavigation]);

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [hasUnsavedChanges]);

	const confirmExit = useCallback(() => {
		onConfirmExit();
		setShowExitDialog(false);

		if (pendingNavigation) {
			router.push(pendingNavigation);
		} else {
			router.push('/');
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
