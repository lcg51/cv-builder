'use client';
import { Button } from '@/ui/components';
import { Card } from '@/ui/components/card';
import { Badge } from '@/ui/components/badge';
import { jobapplicantBG, laptopBG, loginBG, jobapplicantBGJPG, laptopBGJPG, loginBGJPG } from '../assets';
import { OptimizedImage } from '@/ui/components';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { CheckCircle, ArrowRight, Sparkles, Clock, Shield } from '@/ui/icons';
import { useSectionsData } from './models/sections';
import { HomeTemplates } from './components/HomeTemplates';
import { useTranslations } from 'next-intl';

export default function Home() {
	const { push } = useRouter();

	const redirectToTemplates = useCallback(() => {
		push('/templates');
	}, []);

	const $t = useTranslations('HomePage');
	const { features, steps, stats, benefits } = useSectionsData();

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/30 dark:from-slate-900 dark:to-slate-800">
			{/* Hero Section */}
			<section className="relative overflow-hidden min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-3.75rem)] flex items-center">
				{/* Background Image */}
				<div className="absolute inset-0 z-0">
					<OptimizedImage
						webpSrc={laptopBG}
						jpgSrc={laptopBGJPG}
						alt=""
						fill
						className="object-cover opacity-10 dark:opacity-5"
						priority
					/>
				</div>

				<div className="flex flex-col items-center px-8 pb-8 lg:pb-0 relative z-10 w-full">
					<div className="py-8 lg:py-0 space-y-12">
						<div className="">
							<Badge variant="secondary" className="px-0 py-0 lg:py-3 text-sm font-medium bg-primary">
								<Sparkles className="w-4 h-4 mr-2" />
								{$t('heroSection.badge')}
							</Badge>
							<h1 className="text-4xl md:text-6xl font-bold text-foreground dark:text-slate-200 max-w-lg">
								{$t('heroSection.title')}
							</h1>
							<p className="text-xl text-muted-foreground dark:text-slate-400 max-w-lg">
								{$t('heroSection.description')}
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4">
							<Button size="lg" onClick={redirectToTemplates} className="text-lg px-8 py-6">
								{$t('heroSection.button')}
								<ArrowRight className="ml-2 w-5 h-5" />
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="text-lg px-8 py-6 bg-white dark:bg-slate-800"
								onClick={redirectToTemplates}
							>
								{$t('heroSection.button2')}
							</Button>
						</div>

						<div className="flex items-center gap-8 pt-4">
							{stats.map((stat, index) => (
								<div key={index} className="text-center">
									<div className="text-2xl font-bold text-foreground dark:text-primary">
										{stat.value}
									</div>
									<div className="text-sm text-muted-foreground dark:text-slate-400">
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Template Preview Section */}
			<section className="relative py-20 bg-gradient-to-b from-muted/30 to-background dark:from-slate-800 dark:to-slate-900 overflow-hidden">
				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold text-foreground dark:text-slate-200">
							{$t('templatesSection.title')}
						</h2>
						<p className="text-xl text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
							{$t('templatesSection.description')}
						</p>
					</div>

					<HomeTemplates />

					<div className="text-center mt-12">
						<Button variant="outline" size="lg" onClick={redirectToTemplates}>
							{$t('templatesSection.button')}
							<ArrowRight className="ml-2 w-5 h-5" />
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="relative py-20 bg-muted/50 dark:bg-slate-800 overflow-hidden">
				{/* Background Image */}
				<div className="absolute inset-0 z-0">
					<OptimizedImage
						webpSrc={jobapplicantBG}
						jpgSrc={jobapplicantBGJPG}
						alt=""
						fill
						className="object-cover opacity-5 dark:opacity-10"
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-muted/30 to-muted/50 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/90"></div>
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold text-foreground dark:text-slate-200">
							{$t('featuresSection.title')}
						</h2>
						<p className="text-xl text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
							{$t('featuresSection.description')}
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<Card
								key={index}
								className="p-6 h-full hover:shadow-lg dark:bg-slate-700 dark:hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-white/80 dark:bg-slate-700/90"
							>
								<div className="space-y-4">
									<div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center transition-colors group-hover:bg-primary/20 dark:group-hover:bg-primary/30">
										<feature.icon className="w-6 h-6 text-primary dark:text-primary" />
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2 text-muted dark:text-slate-200">
											{feature.title}
										</h3>
										<p className="text-muted-foreground dark:text-slate-400">
											{feature.description}
										</p>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="relative py-20 bg-background dark:bg-background overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M20%2020c0%2011.046-8.954%2020-20%2020s-20-8.954-20-20%208.954-20%2020-20%2020%208.954%2020%2020zm0-20c-11.046%200-20%208.954-20%2020s8.954%2020%2020%2020%2020-8.954%2020-20-8.954-20-20-20z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-60 dark:opacity-40"></div>
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold text-foreground dark:text-slate-400">
							{$t('howItWorksSection.title')}
						</h2>
						<p className="text-xl text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
							{$t('howItWorksSection.description')}
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						{steps.map((step, index) => (
							<div key={index} className="text-center space-y-4">
								<div className="relative">
									<div className="w-16 h-16 bg-primary text-muted dark:bg-primary dark:text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
										{step.number}
									</div>
								</div>
								<div>
									<h3 className="text-xl font-semibold mb-2 text-muted dark:text-slate-200">
										{step.title}
									</h3>
									<p className="text-muted-foreground dark:text-slate-400">{step.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 bg-muted/50 dark:bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="space-y-8">
							<div>
								<h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground dark:text-slate-200">
									{$t('benefitsSection.title')}
								</h2>
								<p className="text-xl text-muted-foreground dark:text-slate-400">
									{$t('benefitsSection.description')}
								</p>
							</div>

							<div className="space-y-4">
								{benefits.map((benefit, index) => (
									<div key={index} className="flex items-start gap-3">
										<CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
										<p className="text-muted-foreground dark:text-slate-400">{benefit}</p>
									</div>
								))}
							</div>
						</div>

						<div className="relative">
							<OptimizedImage
								webpSrc={loginBG}
								jpgSrc={loginBGJPG}
								alt="Professional CV Design"
								width={600}
								height={400}
								className="rounded-2xl shadow-2xl dark:shadow-xl w-full"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/40 dark:to-transparent rounded-2xl"></div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="relative py-20 bg-background dark:bg-background overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M20%2020c0%2011.046-8.954%2020-20%2020s-20-8.954-20-20%208.954-20%2020-20%2020%208.954%2020%2020zm0-20c-11.046%200-20%208.954-20%2020s8.954%2020%2020%2020%2020-8.954%2020-20-8.954-20-20-20z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-60 dark:opacity-40"></div>
				</div>
				<div className="container mx-auto px-4 relative z-10">
					<Card className="p-12 text-center bg-gradient-to-r from-primary/10 to-secondary/10 dark:bg-slate-700 dark:from-primary/20 dark:to-secondary/20 backdrop-blur-sm">
						<div className="space-y-6 max-w-2xl mx-auto">
							<h2 className="text-3xl lg:text-4xl font-bold text-foreground dark:text-slate-200">
								{$t('ctaSection.title')}
							</h2>
							<p className="text-xl text-muted-foreground dark:text-slate-400">
								{$t('ctaSection.description')}
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" onClick={redirectToTemplates} className="text-lg px-8 py-6">
									{$t('ctaSection.button')}
									<ArrowRight className="ml-2 w-5 h-5" />
								</Button>
							</div>
							<div className="flex items-center justify-center gap-4 text-sm text-muted-foreground dark:text-muted-foreground">
								<div className="flex items-center gap-1 dark:text-slate-400">
									<Clock className="w-4 h-4" />
									{$t('ctaSection.minutes')}
								</div>
								<div className="flex items-center gap-1 dark:text-slate-400">
									<Shield className="w-4 h-4" />
									{$t('ctaSection.free')}
								</div>
							</div>
						</div>
					</Card>
				</div>
			</section>
		</div>
	);
}
