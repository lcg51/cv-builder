import { useState, useEffect, useCallback } from 'react';

interface IPInfo {
	ip: string;
	isLocal: boolean;
	timestamp: string;
	geoInfo?: {
		country?: string;
		region?: string;
		city?: string;
		timezone?: string;
		isp?: string;
	};
	geoError?: string;
}

interface UseUserIPOptions {
	/**
	 * Whether to fetch detailed geographical information
	 * @default false
	 */
	detailed?: boolean;

	/**
	 * Whether to automatically fetch IP on mount
	 * @default true
	 */
	autoFetch?: boolean;

	/**
	 * Cache duration in milliseconds
	 * @default 300000 (5 minutes)
	 */
	cacheDuration?: number;
}

interface UseAppIPOptions {
	/**
	 * Cache duration in milliseconds
	 * @default 300000 (5 minutes)
	 */
	cacheDuration?: number;
}

interface UseUserIPResult {
	/** The IP information object */
	ipInfo: IPInfo | null;

	/** Whether the request is currently loading */
	loading: boolean;

	/** Any error that occurred during the request */
	error: string | null;

	/** Function to manually fetch/refresh the IP information */
	refetch: () => Promise<void>;

	/** Function to log the IP address for analytics */
	logIP: (context?: string) => Promise<void>;
}

// Simple in-memory cache
const ipCache = new Map<string, { data: IPInfo; timestamp: number }>();

/**
 * Custom hook to get the user's IP address and optional geographical information
 */
export function useUserIP(options: UseUserIPOptions = {}): UseUserIPResult {
	const {
		detailed = false,
		autoFetch = true,
		cacheDuration = 300000 // 5 minutes
	} = options;

	const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchIP = useCallback(async () => {
		const cacheKey = `ip-${detailed}`;
		const cached = ipCache.get(cacheKey);

		// Check if we have valid cached data
		if (cached && Date.now() - cached.timestamp < cacheDuration) {
			setIpInfo(cached.data);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const params = new URLSearchParams();
			if (detailed) {
				params.append('detailed', 'true');
			}

			const response = await fetch(`/api/user-ip?${params.toString()}`, {
				method: 'GET',
				cache: 'no-cache'
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: IPInfo = await response.json();

			// Cache the result
			ipCache.set(cacheKey, {
				data,
				timestamp: Date.now()
			});

			setIpInfo(data);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch IP address';
			setError(errorMessage);
			console.error('Error fetching user IP:', err);
		} finally {
			setLoading(false);
		}
	}, [detailed, cacheDuration]);

	const logIP = useCallback(async (context = 'user_action') => {
		try {
			const response = await fetch('/api/user-ip', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ context })
			});

			if (!response.ok) {
				throw new Error(`Failed to log IP: ${response.status}`);
			}

			const result = await response.json();
			console.log('IP logged successfully:', result);
		} catch (err) {
			console.error('Error logging IP:', err);
		}
	}, []);

	// Auto-fetch on mount if enabled
	useEffect(() => {
		if (autoFetch) {
			fetchIP();
		}
	}, [fetchIP, autoFetch]);

	return {
		ipInfo,
		loading,
		error,
		refetch: fetchIP,
		logIP
	};
}

/**
 * Simple hook that just returns the IP address string
 */
export function useSimpleUserIP(): {
	ip: string | null;
	loading: boolean;
	error: string | null;
} {
	const { ipInfo, loading, error } = useUserIP({ detailed: false });

	return {
		ip: ipInfo?.ip || null,
		loading,
		error
	};
}

/**
 * Hook specifically for app-level IP detection with full geographical data
 * Automatically fetches detailed IP information on mount
 */
export function useAppIP(options: UseAppIPOptions = {}): UseUserIPResult {
	return useUserIP({
		detailed: true,
		autoFetch: true,
		cacheDuration: options.cacheDuration
	});
}

/**
 * Hook for getting IP with geographical data that persists across the app
 * Uses a global cache key for app-wide consistency
 */
export function useGlobalIP(): UseUserIPResult {
	const { ipInfo, loading, error, refetch, logIP } = useUserIP({
		detailed: true,
		autoFetch: true,
		cacheDuration: 600000 // 10 minutes for app-level data
	});

	return {
		ipInfo,
		loading,
		error,
		refetch,
		logIP
	};
}
