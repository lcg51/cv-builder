import Link from 'next/link';

import LoginForm from './components/LoginForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { notebookBG, notebookBGJPG } from '../../../assets';
import { Message, OptimizedImage } from '@/components/ui';

export default async function Login(props: { searchParams: Promise<Message> }) {
	const searchParams = await props.searchParams;
	return (
		<div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<div className="w-full flex justify-center min-h-[calc(100vh-3.5rem)] xl:min-h-[calc(100vh-3.75rem)] xl:grid xl:grid-cols-2">
				{/* Login Form Section */}
				<div className="flex items-center justify-center p-8">
					<div className="w-full max-w-md">
						{/* Header */}
						<div className="text-center mb-8">
							<h1 className="text-3xl lg:text-4xl font-bold text-muted dark:text-slate-200 mb-2">
								Welcome Back
							</h1>
							<p className="text-slate-600 dark:text-slate-400 text-lg">
								Sign in to continue building your professional resume
							</p>
						</div>

						{/* Login Card */}
						<Card className="w-full shadow-xl border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
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

				{/* Background Image Section */}
				<div className="hidden xl:block relative overflow-hidden">
					<OptimizedImage
						webpSrc={notebookBG}
						jpgSrc={notebookBGJPG}
						alt="Professional workspace background"
						width={1920}
						height={1080}
						className="h-full w-full object-cover"
						priority
					/>
					{/* Enhanced Overlay for Better Readability */}
					<div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>
					<div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent"></div>

					{/* Content Overlay */}
					<div className="absolute inset-0 flex items-center justify-center p-6">
						<div className="text-center text-white max-w-sm relative z-10">
							<h2 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">
								Create Professional Resumes
							</h2>
							<p className="text-lg text-white/95 mb-6 leading-relaxed drop-shadow-md">
								Build stunning resumes that stand out and help you land your dream job
							</p>
							<div className="flex flex-col gap-3 text-base text-white/95">
								<div className="flex items-center gap-3">
									<div className="w-3 h-3 bg-white rounded-full shadow-sm flex-shrink-0"></div>
									<span className="font-medium drop-shadow-sm">Professional templates</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-3 h-3 bg-white rounded-full shadow-sm flex-shrink-0"></div>
									<span className="font-medium drop-shadow-sm">Easy customization</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-3 h-3 bg-white rounded-full shadow-sm flex-shrink-0"></div>
									<span className="font-medium drop-shadow-sm">PDF export</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
