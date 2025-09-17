'use client';
import React from 'react';
import { Button } from '@/ui/components/button';

import { googleSignIn } from '../../server-actions/session';
import { FormMessage, Message } from '@/ui/components';
import { useTranslations } from 'next-intl';
import { GoogleIcon } from '@/ui/icons';

export default function LoginForm({ searchParams }: { searchParams: Message }) {
	const $t = useTranslations('LoginPage');
	return (
		<div className="space-y-6">
			{/* Google Sign In Button */}
			<form action={() => googleSignIn('/')} className="space-y-4">
				<Button
					variant="default"
					formAction={() => googleSignIn('/')}
					className="w-full h-12 text-base font-medium"
				>
					<GoogleIcon />
					{$t('continueWithGoogle')}
				</Button>

				{/* Divider */}
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-slate-300 dark:border-slate-600" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">
							{$t('secureAuthentication')}
						</span>
					</div>
				</div>

				{/* Benefits */}
				<div className="text-center space-y-2">
					<p className="text-sm text-slate-600 dark:text-slate-400">{$t('benefits')}</p>
				</div>
			</form>

			{/* Error/Success Messages */}
			<FormMessage message={searchParams} />
		</div>
	);
}
