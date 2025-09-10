'use client';

import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModalDisclaimer } from '@/ui/components';

interface NavigationGuardContextType {
	showExitDialog: boolean;
	attemptNavigation: (targetUrl: string) => boolean;
	confirmExit: () => void;
	cancelExit: () => void;
	setHasUnsavedChanges: (hasChanges: boolean) => void;
	setOnConfirmExit: (callback: () => void) => void;
}

const NavigationGuardContext = createContext<NavigationGuardContextType | undefined>(undefined);

interface NavigationGuardProviderProps {
	children: ReactNode;
}

interface NavigationEventDetail {
	targetUrl: string;
	isBrowserNavigation?: boolean;
	previousPath?: string;
	navigationType?: 'forward' | 'back';
}

export function NavigationGuardProvider({ children }: NavigationGuardProviderProps) {
	const [showExitDialog, setShowExitDialog] = useState(false);
	const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [onConfirmExit, setOnConfirmExit] = useState<() => void>(() => {});
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

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			cancelExit();
		}
		setShowExitDialog(newOpen);
	};

	const contextValue: NavigationGuardContextType = {
		showExitDialog,
		attemptNavigation,
		confirmExit,
		cancelExit,
		setHasUnsavedChanges,
		setOnConfirmExit
	};

	return (
		<NavigationGuardContext.Provider value={contextValue}>
			{children}
			<ModalDisclaimer
				open={showExitDialog}
				onOpenChange={handleOpenChange}
				onConfirm={confirmExit}
				onCancel={cancelExit}
			/>
		</NavigationGuardContext.Provider>
	);
}

export function useNavigationGuardContext() {
	const context = useContext(NavigationGuardContext);
	if (context === undefined) {
		throw new Error('useNavigationGuardContext must be used within a NavigationGuardProvider');
	}
	return context;
}
