import { NextRequest, NextResponse } from 'next/server';
import { detectUserLocale } from '@/lib/locale-detection';

/**
 * GET /api/locale-detection - Returns locale detection information
 * This endpoint provides information about how the user's locale was detected
 */
export async function GET(request: NextRequest) {
	try {
		// Detect the user's locale using all available strategies
		const detectionResult = await detectUserLocale(request);

		return NextResponse.json(
			{
				detectedLocale: detectionResult.locale,
				source: detectionResult.source,
				confidence: detectionResult.confidence,
				country: detectionResult.ipInfo?.country,
				ip: detectionResult.ipInfo?.ip,
				isLocal: detectionResult.ipInfo?.isLocal,
				browserLanguages: detectionResult.browserLanguages,
				debug: detectionResult.debug,
				timestamp: new Date().toISOString()
			},
			{
				status: 200,
				headers: {
					'Cache-Control': 'no-cache, no-store, must-revalidate',
					Pragma: 'no-cache',
					Expires: '0'
				}
			}
		);
	} catch (error) {
		console.error('Error in locale detection:', error);

		return NextResponse.json(
			{
				error: 'Failed to detect locale',
				timestamp: new Date().toISOString()
			},
			{ status: 500 }
		);
	}
}

/**
 * POST /api/locale-detection - Set user's preferred locale
 */
export async function POST(request: NextRequest) {
	try {
		const { locale } = await request.json();

		if (!locale || typeof locale !== 'string') {
			return NextResponse.json({ error: 'Locale is required' }, { status: 400 });
		}

		// Set the locale cookie
		const response = NextResponse.json({
			success: true,
			locale,
			message: 'Locale preference saved'
		});

		// Set cookie for 1 year
		response.cookies.set('locale', locale, {
			maxAge: 60 * 60 * 24 * 365,
			path: '/',
			httpOnly: false, // Allow client-side access
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax'
		});

		return response;
	} catch (error) {
		console.error('Error setting locale preference:', error);

		return NextResponse.json({ error: 'Failed to set locale preference' }, { status: 500 });
	}
}
