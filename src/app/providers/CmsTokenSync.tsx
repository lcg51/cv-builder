'use client';
import { useEffect } from 'react';
import { cmsApi } from '@/api';

export function CmsTokenSync({ token }: { token?: string }) {
	useEffect(() => {
		if (token) cmsApi.setToken(token);
	}, [token]);

	return null;
}
