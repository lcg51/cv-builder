import { useEffect } from 'react';
import { useNavigationGuardContext } from '@/app/providers/NavigationGuardProvider';

interface UseNavigationGuardProviderProps {
	hasUnsavedChanges: boolean;
	onConfirmExit: () => void;
}

export function useNavigationGuardProvider({ hasUnsavedChanges, onConfirmExit }: UseNavigationGuardProviderProps) {
	const { setHasUnsavedChanges, setOnConfirmExit, attemptNavigation } = useNavigationGuardContext();

	useEffect(() => {
		setHasUnsavedChanges(hasUnsavedChanges);
	}, [hasUnsavedChanges, setHasUnsavedChanges]);

	useEffect(() => {
		setOnConfirmExit(() => onConfirmExit);
	}, [onConfirmExit, setOnConfirmExit]);

	return {
		attemptNavigation
	};
}
