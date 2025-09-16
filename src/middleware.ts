import { NextResponse, type NextRequest } from 'next/server';
import { auth as googleAuth } from './auth';
import { getClientIP, isLocalIP } from './lib/ip-utils';

export const API_AUTH_PREFIX = '/api/auth';

export const AUTH_ROUTES = ['/login'];

export const auth = googleAuth;

export async function middleware(request: NextRequest) {
	try {
		const pathname = request.nextUrl.pathname;

		// Get client IP for logging
		const clientIP = getClientIP(request);
		const isLocal = isLocalIP(clientIP);

		// Log request with IP (you can customize this based on your needs)
		if (process.env.NODE_ENV === 'development' || !isLocal) {
			console.log(
				`[${new Date().toISOString()}] ${request.method} ${pathname} - IP: ${clientIP}${isLocal ? ' (local)' : ''}`
			);
		}

		const session = await auth();
		const isAccessingAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

		if (session && isAccessingAuthRoute) {
			return NextResponse.redirect(new URL('/', request.url));
		}

		// Add IP to response headers (optional - for debugging purposes)
		const response = NextResponse.next();
		if (process.env.NODE_ENV === 'development') {
			response.headers.set('x-client-ip', clientIP);
		}

		// Add URL to headers for i18n locale detection
		response.headers.set('x-url', request.url);

		return response;
	} catch (error) {
		console.error(error);
		return NextResponse.error();
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
		 * Feel free to modify this pattern to include more paths.
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
	]
};
