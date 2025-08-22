import { resumeDataStore } from '@/app/store/resume';
import { useEffect, useState } from 'react';

/**
 * Hook to check if the resume store has been hydrated from persistence
 * This prevents race conditions where store values are empty during initial load
 */
export const useStoreHydration = () => {
	const _hasHydrated = resumeDataStore(state => state._hasHydrated);
	const [isStable, setIsStable] = useState(false);

	useEffect(() => {
		if (_hasHydrated) {
			// Add a small delay to ensure the store is fully stable
			const timer = setTimeout(() => {
				setIsStable(true);
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [_hasHydrated]);

	return {
		isHydrated: _hasHydrated,
		isStable,
		isLoading: !_hasHydrated || !isStable
	};
};
