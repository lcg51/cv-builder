'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAppIP } from '@/hooks/useUserIP';
import { LocaleSync } from '@/app/components/LocaleSync';

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

interface IPContextType {
	/** The IP information object with geographical data */
	ipInfo: IPInfo | null;

	/** Whether the IP detection is currently loading */
	loading: boolean;

	/** Any error that occurred during IP detection */
	error: string | null;

	/** Function to refresh the IP information */
	refetch: () => Promise<void>;
}

const IPContext = createContext<IPContextType | undefined>(undefined);

interface IPProviderProps {
	children: React.ReactNode;
	/**
	 * Whether to show loading state in console
	 * @default false
	 */
	debugMode?: boolean;
}

/**
 * Provider that automatically detects user IP with geographical data on app load
 * and makes it available throughout the app via context
 */
export function IPProvider({ children, debugMode = false }: IPProviderProps) {
	const { ipInfo, loading, error, refetch } = useAppIP();

	// Debug logging
	useEffect(() => {
		if (debugMode) {
			if (loading) {
				console.log('[IPProvider] Loading IP information...');
			} else if (error) {
				console.error('[IPProvider] Error detecting IP:', error);
			} else if (ipInfo) {
				console.log('[IPProvider] IP detected:', {
					ip: ipInfo.ip,
					isLocal: ipInfo.isLocal,
					country: ipInfo.geoInfo?.country,
					city: ipInfo.geoInfo?.city
				});
			}
		}
	}, [loading, error, ipInfo, debugMode]);

	const contextValue: IPContextType = {
		ipInfo,
		loading,
		error,
		refetch
	};

	return (
		<IPContext.Provider value={contextValue}>
			<LocaleSync />
			{children}
		</IPContext.Provider>
	);
}

/**
 * Hook to access IP information from anywhere in the app
 */
export function useIPContext(): IPContextType {
	const context = useContext(IPContext);

	if (context === undefined) {
		throw new Error('useIPContext must be used within an IPProvider');
	}

	return context;
}

/**
 * Hook to get just the IP address (convenience hook)
 */
export function useAppIPAddress(): string | null {
	const { ipInfo } = useIPContext();
	return ipInfo?.ip || null;
}

/**
 * Hook to get geographical information (convenience hook)
 */
export function useAppLocation(): {
	country?: string;
	region?: string;
	city?: string;
	timezone?: string;
	isp?: string;
} | null {
	const { ipInfo } = useIPContext();
	return ipInfo?.geoInfo || null;
}

/**
 * Hook to check if user is on local network (convenience hook)
 */
export function useIsLocalNetwork(): boolean {
	const { ipInfo } = useIPContext();
	return ipInfo?.isLocal ?? true; // Default to true for safety
}
