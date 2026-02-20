'use client';
import React, { useState } from 'react';
import { Button } from '@/ui/components/button';
import { Input } from '@/ui/components/input';

import { googleSignIn, credentialsSignIn } from '../../server-actions/session';
import { FormMessage, Message } from '@/ui/components';
import { useTranslations } from 'next-intl';
import { GoogleIcon } from '@/ui/icons';
import { useFlags } from '@/hooks/useFlags';

export default function LoginForm({ searchParams }: { searchParams: Message }) {
	const $t = useTranslations('LoginPage');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { flags } = useFlags();
	const isEmailSignInEnabled = flags?.isEmailSignInEnabled;

	const handleCredentialsSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const result = await credentialsSignIn(email, password);
			if (result?.error) {
				setError($t('invalidCredentials'));
			}
		} catch {
			// NEXT_REDIRECT is re-thrown — this is expected on success
		} finally {
			setIsLoading(false);
		}
	};

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
			</form>

			{isEmailSignInEnabled && (
				<>
					{/* Divider */}
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-slate-300 dark:border-slate-600" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">
								{$t('or')}
							</span>
						</div>
					</div>
					{/* Email/Password Sign In */}
					<form onSubmit={handleCredentialsSubmit} className="space-y-4">
						<div className="space-y-2">
							<Input
								type="email"
								placeholder={$t('emailPlaceholder')}
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>
						<div className="space-y-2">
							<Input
								type="password"
								placeholder={$t('passwordPlaceholder')}
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>

						{error && <p className="text-sm text-red-500 text-center">{error}</p>}

						<Button
							type="submit"
							variant="outline"
							className="w-full h-12 text-base font-medium"
							disabled={isLoading}
						>
							{isLoading ? $t('signingIn') : $t('signInWithEmail')}
						</Button>
					</form>
				</>
			)}

			{/* Error/Success Messages */}
			<FormMessage message={searchParams} />
		</div>
	);
}
