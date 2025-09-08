import Link from 'next/link';

import LoginForm from './components/LoginForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { notebookBG, notebookBGJPG } from '../../../assets';
import { Message, OptimizedImage } from '@/components/ui';

export default async function Login(props: { searchParams: Promise<Message> }) {
	const searchParams = await props.searchParams;
	return (
		<div className="relative min-h-[calc(100vh-3.5rem)] xl:min-h-[calc(100vh-3.75rem)]">
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				<OptimizedImage
					webpSrc={notebookBG}
					jpgSrc={notebookBGJPG}
					alt="Professional workspace background"
					width={1920}
					height={1080}
					className="h-full w-full object-cover"
					priority
				/>
				{/* Overlay for better text readability */}
				<div className="absolute inset-0 bg-white/70 dark:bg-slate-900/60"></div>
			</div>

			{/* Content */}
			<div className="relative z-10 w-full flex justify-center min-h-[calc(100vh-3.5rem)] xl:min-h-[calc(100vh-3.75rem)]">
				<div className="flex items-center justify-center p-8">
					<div className="w-full max-w-md">
						{/* Header */}
						<div className="text-center mb-8">
							<h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
								Welcome Back
							</h1>
							<p className="text-slate-600 dark:text-slate-400 text-lg">
								Sign in to continue building your professional resume
							</p>
						</div>

						{/* Login Card */}
						<Card className="w-full shadow-2xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
							<CardHeader className="text-center pb-6">
								<CardTitle className="text-2xl font-bold text-muted dark:text-slate-200">
									Sign In
								</CardTitle>
								<CardDescription className="text-slate-600 dark:text-slate-400">
									Access your account to create and manage your resumes
								</CardDescription>
							</CardHeader>
							<CardContent className="pb-8">
								<LoginForm searchParams={searchParams} />
							</CardContent>
						</Card>

						{/* Footer */}
						<div className="text-center mt-8">
							<p className="text-sm text-slate-500 dark:text-slate-400">
								By signing in, you agree to our{' '}
								<Link href="/terms" className="text-primary hover:underline">
									Terms of Service
								</Link>{' '}
								and{' '}
								<Link href="/privacy" className="text-primary hover:underline">
									Privacy Policy
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
