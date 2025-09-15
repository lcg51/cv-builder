/**
 * Development IP configuration for testing location features
 * This file helps you test IP geolocation in development by mocking different IPs
 */

export interface MockIPConfig {
	enabled: boolean;
	ip: string;
	location: {
		country: string;
		region?: string;
		city?: string;
		timezone?: string;
		isp?: string;
	};
}

// Test IP addresses from different locations
export const TEST_IPS: Record<string, MockIPConfig> = {
	'new-york': {
		enabled: true,
		ip: '8.8.8.8', // Google DNS (Mountain View, but we'll mock as NY)
		location: {
			country: 'United States',
			region: 'New York',
			city: 'New York',
			timezone: 'America/New_York',
			isp: 'Google LLC'
		}
	},
	london: {
		enabled: true,
		ip: '1.1.1.1', // Cloudflare DNS (we'll mock as London)
		location: {
			country: 'United Kingdom',
			region: 'England',
			city: 'London',
			timezone: 'Europe/London',
			isp: 'Cloudflare, Inc.'
		}
	},
	madrid: {
		enabled: true,
		ip: '85.152.191.100', // Example Spanish IP
		location: {
			country: 'Spain',
			region: 'Madrid',
			city: 'Madrid',
			timezone: 'Europe/Madrid',
			isp: 'Telefónica'
		}
	},
	'mexico-city': {
		enabled: true,
		ip: '187.217.1.1', // Example Mexican IP
		location: {
			country: 'Mexico',
			region: 'Ciudad de México',
			city: 'Mexico City',
			timezone: 'America/Mexico_City',
			isp: 'Telmex'
		}
	},
	tokyo: {
		enabled: true,
		ip: '202.12.27.33', // Example Japanese IP
		location: {
			country: 'Japan',
			region: 'Tokyo',
			city: 'Tokyo',
			timezone: 'Asia/Tokyo',
			isp: 'NTT Communications'
		}
	},
	sydney: {
		enabled: true,
		ip: '203.206.40.1', // Example Australian IP
		location: {
			country: 'Australia',
			region: 'New South Wales',
			city: 'Sydney',
			timezone: 'Australia/Sydney',
			isp: 'Telstra Corporation'
		}
	},
	local: {
		enabled: true,
		ip: '192.168.1.100',
		location: {
			country: 'Local Network',
			region: 'Private',
			city: 'Local',
			timezone: 'Local',
			isp: 'Local Network'
		}
	}
};

/**
 * Current development configuration
 * Change this to test different locations in development
 */
export const DEV_CONFIG = {
	// Set to true to enable IP mocking in development
	mockingEnabled: process.env.NODE_ENV === 'development' && process.env.MOCK_IP_ENABLED === 'true',

	// Which test IP to use (key from TEST_IPS)
	activeTestIP: (process.env.MOCK_IP_LOCATION as keyof typeof TEST_IPS) || 'new-york',

	// Whether to log mock data
	debugMode: true
};

/**
 * Get the mock IP configuration for development testing
 */
export function getMockIPConfig(): MockIPConfig | null {
	if (!DEV_CONFIG.mockingEnabled) {
		return null;
	}

	const config = TEST_IPS[DEV_CONFIG.activeTestIP];

	if (DEV_CONFIG.debugMode && config) {
		console.log(`[DEV] Mocking IP location: ${DEV_CONFIG.activeTestIP}`, config);
	}

	return config || null;
}

/**
 * Instructions for using IP mocking in development
 */
export const DEVELOPMENT_INSTRUCTIONS = `
# Testing IP Location in Development

## Method 1: Environment Variables (Recommended)
Add to your .env.local file:

MOCK_IP_ENABLED=true
MOCK_IP_LOCATION=london

Available locations: ${Object.keys(TEST_IPS).join(', ')}

Test locale detection:
- madrid, mexico-city → Spanish (es)
- new-york, london, sydney → English (en)
- tokyo → English (en) - fallback

## Method 2: Modify dev-ip-config.ts
Change DEV_CONFIG.mockingEnabled to true
Change DEV_CONFIG.activeTestIP to desired location

## Method 3: Use Different Networks
- Connect to mobile hotspot
- Use VPN service
- Test on different WiFi networks

## Method 4: Deploy to Staging
Deploy to Vercel/Netlify to test with real IP detection

## Method 5: Browser DevTools
- Use Network tab to see actual headers
- Check /api/user-ip endpoint responses
- Monitor console for debug messages
`;

/**
 * Helper to set mock IP for testing (call from browser console)
 */
export function setTestLocation(location: keyof typeof TEST_IPS) {
	if (typeof window !== 'undefined') {
		console.log('To set test location, add this to your .env.local:');
		console.log(`MOCK_IP_ENABLED=true`);
		console.log(`MOCK_IP_LOCATION=${location}`);
		console.log('Then restart your development server.');
	}
}
