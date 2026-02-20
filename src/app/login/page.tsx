import Link from 'next/link';

import LoginForm from './components/LoginForm';
import { Card, CardContent } from '@/ui/components/card';
import { notebookBG, notebookBGJPG } from '../../assets';
import { Message, OptimizedImage } from '@/ui/components';
import { getTranslations } from 'next-intl/server';

export default async function Login(props: { searchParams: Promise<Message> }) {
	const searchParams = await props.searchParams;
	const $t = await getTranslations('LoginPage');

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
						{/* Login Card */}
						<Card className="w-full shadow-2xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
							<CardContent className="pt-8 pb-8">
								<LoginForm searchParams={searchParams} />
							</CardContent>
						</Card>

						{/* Footer */}
						<div className="text-center mt-8">
							<p className="text-sm text-slate-500 dark:text-slate-400">
								{$t.rich('termsOfServiceAndPolicy', {
									termsOfService: chunks => (
										<Link href="/terms" className="text-primary hover:underline">
											{chunks}
										</Link>
									),
									privacyPolicy: chunks => (
										<Link href="/privacy" className="text-primary hover:underline">
											{chunks}
										</Link>
									)
								})}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
