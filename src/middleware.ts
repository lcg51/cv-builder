import { NextResponse, type NextRequest } from 'next/server';
import { auth as googleAuth } from './auth';

export const API_AUTH_PREFIX = '/api/auth';

export const AUTH_ROUTES = ['/login'];

export const auth = googleAuth;

export async function middleware(request: NextRequest) {
	try {
		const pathname = request.nextUrl.pathname;
		const session = await auth();
		const isAccessingAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

		if (session && isAccessingAuthRoute) {
			return NextResponse.redirect(new URL('/', request.url));
		}

		if (!session && isAccessingAuthRoute) {
			return NextResponse.redirect(new URL('/login', request.url));
		}

		return NextResponse.next();
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
