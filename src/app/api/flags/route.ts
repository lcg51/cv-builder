import { NextResponse } from 'next/server';
import { evaluate } from 'flags/next';
import { areFilterTemplatesEnabled, isEmailAuthEnabled } from '@/flags';

export async function GET() {
	const [areFilterTemplatesEnabledValue, isEmailAuthEnabledValue] = await evaluate([
		areFilterTemplatesEnabled,
		isEmailAuthEnabled
	]);
	return NextResponse.json({
		areFilterTemplatesEnabled: areFilterTemplatesEnabledValue,
		isEmailAuthEnabled: isEmailAuthEnabledValue
	});
}
