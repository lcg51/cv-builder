import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

export const areFilterTemplatesEnabled = flag({
	key: 'areFilterTemplatesEnabled',
	adapter: vercelAdapter()
});

export const isEmailAuthEnabled = flag({
	key: 'isEmailAuthEnabled',
	adapter: vercelAdapter()
});
