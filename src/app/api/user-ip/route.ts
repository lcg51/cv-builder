import { NextRequest, NextResponse } from 'next/server';
import { getClientIP, getIPInfo, isLocalIP } from '@/lib/ip-utils';
import { getMockIPConfig } from '@/lib/dev-ip-config';

/**
 * GET /api/user-ip - Returns the client's IP address and optional geographical information
 */
export async function GET(request: NextRequest) {
	try {
		// Check if we should use mock data for development testing
		const mockConfig = getMockIPConfig();

		let clientIP: string;
		let isMocked = false;

		if (mockConfig) {
			clientIP = mockConfig.ip;
			isMocked = true;
			console.log('[DEV] Using mocked IP for testing:', clientIP);
		} else {
			clientIP = getClientIP(request);
		}

		// Get the 'detailed' query parameter to determine if we should fetch IP info
		const url = new URL(request.url);
		const detailed = url.searchParams.get('detailed') === 'true';

		const response: {
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
			__mocked?: boolean;
			__mockSource?: string;
		} = {
			ip: clientIP,
			isLocal: isLocalIP(clientIP),
			timestamp: new Date().toISOString(),
			...(isMocked && { __mocked: true, __mockSource: 'dev-ip-config' })
		};

		// If detailed info is requested and it's not a local IP, fetch geographical data
		if (detailed && !isLocalIP(clientIP)) {
			try {
				let geoInfo;

				if (mockConfig) {
					// Use mock geographical data
					geoInfo = {
						country: mockConfig.location.country,
						region: mockConfig.location.region,
						city: mockConfig.location.city,
						timezone: mockConfig.location.timezone,
						isp: mockConfig.location.isp
					};
					console.log('[DEV] Using mocked geo data:', geoInfo);
				} else {
					// Fetch real geographical data
					const ipInfo = await getIPInfo(clientIP);
					geoInfo = {
						country: ipInfo.country,
						region: ipInfo.region,
						city: ipInfo.city,
						timezone: ipInfo.timezone,
						isp: ipInfo.isp
					};
				}

				response.geoInfo = geoInfo;
			} catch (error) {
				console.error('Failed to fetch IP geo info:', error);
				response.geoError = 'Failed to fetch geographical information';
			}
		}

		return NextResponse.json(response, {
			status: 200,
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				Pragma: 'no-cache',
				Expires: '0'
			}
		});
	} catch (error) {
		console.error('Error getting user IP:', error);

		return NextResponse.json(
			{
				error: 'Failed to determine IP address',
				timestamp: new Date().toISOString()
			},
			{ status: 500 }
		);
	}
}
