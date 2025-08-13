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
				return false; // Navigation blocked
			}
			return true; // Navigation allowed
		},
		[hasUnsavedChanges]
	);

	useEffect(() => {
		const handleNavigationAttempt = (event: CustomEvent<NavigationEventDetail>) => {
			const { targetUrl, isBrowserNavigation, navigationType } = event.detail;

			if (hasUnsavedChanges) {
				// For browser navigation, we might want to handle it differently
				if (isBrowserNavigation) {
					console.log('Browser navigation detected:', {
						targetUrl,
						navigationType,
						hasUnsavedChanges
					});
				}
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
