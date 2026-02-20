'use client';
import React, { useState } from 'react';
import { Button } from '@/ui/components/button';
import { Input } from '@/ui/components/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/components/tabs';
import { googleSignIn, credentialsSignIn, credentialsSignUp } from '../../server-actions/auth';
import { FormMessage, Message } from '@/ui/components';
import { useTranslations } from 'next-intl';
import { GoogleIcon } from '@/ui/icons';
import { useFlags } from '@/hooks/useFlags';

type Tab = 'sign-in' | 'sign-up';

export default function LoginForm({ searchParams }: { searchParams: Message }) {
	const $t = useTranslations('LoginPage');
	const { flags } = useFlags();
	const isEmailAuthEnabled = flags?.isEmailAuthEnabled;
	const [activeTab, setActiveTab] = useState<Tab>('sign-in');

	const [signInEmail, setSignInEmail] = useState('');
	const [signInPassword, setSignInPassword] = useState('');
	const [signInError, setSignInError] = useState('');
	const [isSignInLoading, setIsSignInLoading] = useState(false);

	const [name, setName] = useState('');
	const [signUpEmail, setSignUpEmail] = useState('');
	const [signUpPassword, setSignUpPassword] = useState('');
	const [signUpError, setSignUpError] = useState('');
	const [isSignUpLoading, setIsSignUpLoading] = useState(false);

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setSignInError('');
		setIsSignInLoading(true);
		try {
			const result = await credentialsSignIn(signInEmail, signInPassword);
			if (result?.error) setSignInError($t('invalidCredentials'));
		} catch {
			// NEXT_REDIRECT is re-thrown — this is expected on success
		} finally {
			setIsSignInLoading(false);
		}
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setSignUpError('');
		setIsSignUpLoading(true);
		try {
			const result = await credentialsSignUp(name, signUpEmail, signUpPassword);
			if (result?.error) setSignUpError($t('registrationFailed'));
		} catch {
			// NEXT_REDIRECT is re-thrown — this is expected on success
		} finally {
			setIsSignUpLoading(false);
		}
	};

	const googleButton = (
		<form action={() => googleSignIn('/')}>
			<Button
				variant="default"
				formAction={() => googleSignIn('/')}
				className="w-full h-12 text-base font-medium"
			>
				<GoogleIcon />
				{$t('continueWithGoogle')}
			</Button>
		</form>
	);

	const divider = (
		<div className="relative">
			<div className="absolute inset-0 flex items-center">
				<span className="w-full border-t border-slate-300 dark:border-slate-600" />
			</div>
			<div className="relative flex justify-center text-xs uppercase">
				<span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">{$t('or')}</span>
			</div>
		</div>
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center">
				<h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-1">
					{activeTab === 'sign-in' ? $t('title') : $t('titleSignUp')}
				</h1>
				<p className="text-slate-600 dark:text-slate-400 text-base">
					{activeTab === 'sign-in' ? $t('description') : $t('descriptionSignUp')}
				</p>
			</div>

			<Tabs defaultValue="sign-in" onValueChange={v => setActiveTab(v as Tab)}>
				<TabsList className="w-full">
					<TabsTrigger value="sign-in" className="flex-1">
						{$t('signIn')}
					</TabsTrigger>
					<TabsTrigger value="sign-up" className="flex-1">
						{$t('signUp')}
					</TabsTrigger>
				</TabsList>

				{/* Sign In Tab */}
				<TabsContent value="sign-in" className="space-y-4 mt-4">
					{isEmailAuthEnabled && (
						<>
							<form onSubmit={handleSignIn} className="space-y-4">
								<Input
									type="email"
									placeholder={$t('emailPlaceholder')}
									value={signInEmail}
									onChange={e => setSignInEmail(e.target.value)}
									required
									disabled={isSignInLoading}
								/>
								<Input
									type="password"
									placeholder={$t('passwordPlaceholder')}
									value={signInPassword}
									onChange={e => setSignInPassword(e.target.value)}
									required
									disabled={isSignInLoading}
								/>
								{signInError && <p className="text-sm text-red-500 text-center">{signInError}</p>}
								<Button
									type="submit"
									variant="outline"
									className="w-full h-12 text-base font-medium"
									disabled={isSignInLoading}
								>
									{isSignInLoading ? $t('signingIn') : $t('signInWithEmail')}
								</Button>
							</form>
							{divider}
						</>
					)}
					{googleButton}
				</TabsContent>

				{/* Sign Up Tab */}
				<TabsContent value="sign-up" className="space-y-4 mt-4">
					{isEmailAuthEnabled && (
						<>
							<form onSubmit={handleSignUp} className="space-y-4">
								<Input
									type="text"
									placeholder={$t('namePlaceholder')}
									value={name}
									onChange={e => setName(e.target.value)}
									required
									disabled={isSignUpLoading}
								/>
								<Input
									type="email"
									placeholder={$t('emailPlaceholder')}
									value={signUpEmail}
									onChange={e => setSignUpEmail(e.target.value)}
									required
									disabled={isSignUpLoading}
								/>
								<Input
									type="password"
									placeholder={$t('passwordPlaceholder')}
									value={signUpPassword}
									onChange={e => setSignUpPassword(e.target.value)}
									required
									disabled={isSignUpLoading}
								/>
								{signUpError && <p className="text-sm text-red-500 text-center">{signUpError}</p>}
								<Button
									type="submit"
									variant="outline"
									className="w-full h-12 text-base font-medium"
									disabled={isSignUpLoading}
								>
									{isSignUpLoading ? $t('creatingAccount') : $t('createAccount')}
								</Button>
							</form>
							{divider}
						</>
					)}
					{googleButton}
				</TabsContent>
			</Tabs>

			{/* Error/Success Messages */}
			<FormMessage message={searchParams} />
		</div>
	);
}
