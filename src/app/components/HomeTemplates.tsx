'use client';
import { HomeTemplatesV2 } from '@/app/components/HomeTemplatesV2';
import { HomeTemplatesV1 } from '@/app/components/HomeTemplatesV1';

export const HomeTemplates = ({ isTemplatesV2Enabled }: { isTemplatesV2Enabled: boolean }) => {
	if (isTemplatesV2Enabled) {
		return <HomeTemplatesV2 />;
	}
	return <HomeTemplatesV1 />;
};
