import { NextRequest } from 'next/server';

/**
 * Extracts the real IP address from a request, handling various proxy scenarios
 * @param request - The Next.js request object
 * @returns The client's IP address
 */
export function getClientIP(request: NextRequest): string {
	// Check for common proxy headers in order of preference
	const forwardedFor = request.headers.get('x-forwarded-for');
	const realIP = request.headers.get('x-real-ip');
	const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
	const forwarded = request.headers.get('forwarded');

	// x-forwarded-for can contain multiple IPs, the first one is the client
	if (forwardedFor) {
		const ips = forwardedFor.split(',').map(ip => ip.trim());
		const clientIP = ips[0];
		if (clientIP && isValidIP(clientIP)) {
			return clientIP;
		}
	}

	// Cloudflare's connecting IP header
	if (cfConnectingIP && isValidIP(cfConnectingIP)) {
		return cfConnectingIP;
	}

	// x-real-ip header
	if (realIP && isValidIP(realIP)) {
		return realIP;
	}

	// Parse forwarded header (RFC 7239)
	if (forwarded) {
		const forMatch = forwarded.match(/for=([^;,\s]+)/);
		if (forMatch) {
			const ip = forMatch[1].replace(/["[\]]/g, ''); // Remove quotes and brackets
			if (isValidIP(ip)) {
				return ip;
			}
		}
	}

	// Fallback to request.headers (Next.js doesn't expose request.ip directly)
	// In production with proper proxy setup, this should be handled by the headers above
	// For development or edge cases, we'll try to get from the socket if available
	const remoteAddress = (request as unknown as { socket?: { remoteAddress?: string } })?.socket?.remoteAddress;
	if (remoteAddress && isValidIP(remoteAddress)) {
		return remoteAddress;
	}

	// If all else fails, return localhost (common in development)
	return '127.0.0.1';
}

/**
 * Validates if a string is a valid IP address (IPv4 or IPv6)
 * @param ip - The IP address string to validate
 * @returns True if valid IP address
 */
function isValidIP(ip: string): boolean {
	// Remove port if present
	const cleanIP = ip.split(':')[0];

	// IPv4 regex
	const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;

	// IPv6 regex (simplified)
	const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;

	if (ipv4Regex.test(cleanIP)) {
		// Validate IPv4 octets are in range 0-255
		const octets = cleanIP.split('.');
		return octets.every(octet => {
			const num = parseInt(octet, 10);
			return num >= 0 && num <= 255;
		});
	}

	return ipv6Regex.test(cleanIP);
}

/**
 * Gets IP address information including geographical data
 * @param ip - The IP address to lookup
 * @returns Promise with IP information
 */
export async function getIPInfo(ip: string): Promise<{
	ip: string;
	country?: string;
	region?: string;
	city?: string;
	timezone?: string;
	isp?: string;
}> {
	// List of free IP geolocation services as fallbacks
	const services = [
		{
			name: 'ipapi.co',
			url: `https://ipapi.co/${ip}/json/`,
			parser: (data: {
				country_name?: string;
				region?: string;
				city?: string;
				timezone?: string;
				org?: string;
			}) => ({
				ip,
				country: data.country_name,
				region: data.region,
				city: data.city,
				timezone: data.timezone,
				isp: data.org
			})
		},
		{
			name: 'ip-api.com',
			url: `http://ip-api.com/json/${ip}`,
			parser: (data: {
				country?: string;
				regionName?: string;
				city?: string;
				timezone?: string;
				isp?: string;
			}) => ({
				ip,
				country: data.country,
				region: data.regionName,
				city: data.city,
				timezone: data.timezone,
				isp: data.isp
			})
		}
	];

	for (const service of services) {
		try {
			console.log(`[IP Info] Trying ${service.name} for IP: ${ip}`);

			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

			const response = await fetch(service.url, {
				signal: controller.signal,
				headers: {
					'User-Agent': 'CV-Builder-App/1.0'
				}
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();

			// Check if the response contains error
			if (data.error || data.status === 'fail') {
				throw new Error(data.message || 'Service returned error');
			}

			const result = service.parser(data);
			console.log(`[IP Info] Success with ${service.name}:`, result);
			return result;
		} catch (error) {
			console.warn(`[IP Info] ${service.name} failed:`, error instanceof Error ? error.message : error);
			continue; // Try next service
		}
	}

	// All services failed, return basic info
	console.warn('[IP Info] All geolocation services failed, returning basic IP info');
	return { ip };
}

/**
 * Checks if an IP address is from a local/private network
 * @param ip - The IP address to check
 * @returns True if the IP is local/private
 */
export function isLocalIP(ip: string): boolean {
	// localhost
	if (ip === '127.0.0.1' || ip === '::1') {
		return true;
	}

	// Private IPv4 ranges
	const privateRanges = [
		/^10\./, // 10.0.0.0/8
		/^192\.168\./, // 192.168.0.0/16
		/^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
		/^169\.254\./ // 169.254.0.0/16 (link-local)
	];

	return privateRanges.some(range => range.test(ip));
}
