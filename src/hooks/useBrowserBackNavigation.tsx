import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useBrowserBackNavigation() {
	const pathname = usePathname();

	useEffect(() => {
		const originalReplaceState = history.replaceState;
		const popstateListener = (event: PopStateEvent) => {
			event.preventDefault();
			triggerNavigationEvent(window.location.pathname, event.state ? 'forward' : 'back');
		};

		window.addEventListener('popstate', popstateListener);

		history.replaceState = function (...args) {
			return originalReplaceState.apply(this, args);
		};

		return () => {
			// Restore original history methods
			history.replaceState = originalReplaceState;
			window.removeEventListener('popstate', popstateListener);
		};
	}, [pathname]);

	// Add a method to manually trigger navigation events (for testing)
	const triggerNavigationEvent = (targetUrl: string, navigationType: 'back' | 'forward' = 'back') => {
		window.dispatchEvent(
			new CustomEvent('navigation-attempt', {
				detail: {
					targetUrl,
					isBrowserNavigation: true,
					previousPath: pathname,
					navigationType
				}
			})
		);
	};

	return { triggerNavigationEvent };
}
