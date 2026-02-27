'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/ui/components/button';
import { HomeIcon, RefreshCwIcon } from '@/ui/icons';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	const $t = useTranslations('ErrorPage');

	return (
		<div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8">
			<div className="text-center max-w-md space-y-8">
				{/* Error hero number */}
				<div className="relative select-none">
					<span className="text-[11rem] lg:text-[14rem] font-black leading-none text-slate-200 dark:text-slate-700/60">
						500
					</span>
					<span className="absolute inset-0 flex items-center justify-center text-6xl lg:text-7xl font-black text-red-400">
						!
					</span>
				</div>

				{/* Text content */}
				<div className="space-y-3">
					<h1 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200">{$t('title')}</h1>
					<p className="text-slate-500 dark:text-slate-400 leading-relaxed">{$t('description')}</p>
				</div>

				{/* Accent separator */}
				<div className="w-12 h-1 bg-red-400/40 rounded-full mx-auto" />

				{/* CTA buttons */}
				<div className="flex items-center justify-center gap-4 flex-wrap">
					<Button onClick={reset} variant="default" className="h-12 px-8 text-base font-medium gap-2">
						<RefreshCwIcon className="w-4 h-4" />
						{$t('retry')}
					</Button>
					<Link href="/">
						<Button variant="outline" className="h-12 px-8 text-base font-medium gap-2">
							<HomeIcon className="w-4 h-4" />
							{$t('goHome')}
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
