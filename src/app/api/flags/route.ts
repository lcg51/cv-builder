import { NextResponse } from 'next/server';
import { evaluate } from 'flags/next';
import { areFilterTemplatesEnabled } from '@/flags';

export async function GET() {
	const [areFilterTemplatesEnabledValue] = await evaluate([areFilterTemplatesEnabled]);
	return NextResponse.json({
		areFilterTemplatesEnabled: areFilterTemplatesEnabledValue
	});
}
