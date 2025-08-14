'use client';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { jobapplicantBG, laptopBG, loginBG, jobapplicantBGJPG, laptopBGJPG, loginBGJPG } from '../assets';
import { OptimizedImage } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { CheckCircle, ArrowRight, Sparkles, Clock, Shield } from 'lucide-react';
import { features, stats, steps, templates } from './models/sections';

export default function Home() {
	const { push } = useRouter();

	const redirectToTemplates = useCallback(() => {
		push('/resume/templates');
	}, []);

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

				<div className="container mx-auto px-8 pb-8 lg:pb-0 md:pb-12 relative z-10 w-full lg:max-w-7xl">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="py-8 lg:py-0 space-y-8">
							<div className="space-y-4">
								<Badge variant="secondary" className="px-0 py-0 lg:py-3 text-sm font-medium bg-primary">
									<Sparkles className="w-4 h-4 mr-2" />
									AI-Powered CV Builder
								</Badge>
								<h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground dark:text-slate-200">
									Create Your
									<span className="text-primary block">Dream CV</span>
									in Minutes
								</h1>
								<p className="text-xl text-muted-foreground dark:text-slate-400 max-w-lg">
									Build professional, ATS-friendly resumes that get you noticed by top employers. No
									design skills required.
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-4">
								<Button size="lg" onClick={redirectToTemplates} className="text-lg px-8 py-6">
									Start Building Free
									<ArrowRight className="ml-2 w-5 h-5" />
								</Button>
								<Button
									variant="outline"
									size="lg"
									className="text-lg px-8 py-6 bg-white dark:bg-slate-800"
									onClick={redirectToTemplates}
								>
									View Templates
								</Button>
							</div>

							<div className="flex items-center gap-8 pt-4">
								{stats.map((stat, index) => (
									<div key={index} className="text-center">
										<div className="text-2xl font-bold text-primary dark:text-primary">
											{stat.value}
										</div>
										<div className="text-sm text-muted-foreground dark:text-slate-400">
											{stat.label}
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="relative">
							<div className="relative z-10 md:max-w-md md:mx-auto lg:mx-0 lg:max-w-2xl bg-white dark:bg-card dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
								<div className="mt-4 space-y-2">
									<div className="h-3 bg-muted-foreground/40 rounded w-full"></div>
									<div className="h-3 bg-muted-foreground/40 rounded w-3/4"></div>
									<div className="h-3 bg-muted-foreground/40 rounded w-5/6"></div>
								</div>
								<div className="mt-4 space-y-2">
									<div className="h-3 bg-muted-foreground/40 rounded w-full"></div>
									<div className="h-3 bg-muted-foreground/40 rounded w-3/4"></div>
									<div className="h-3 bg-muted-foreground/40 rounded w-5/6"></div>
								</div>
								<div className="mt-4 space-y-2">
									<div className="h-3 bg-muted-foreground/40 rounded w-full"></div>
									<div className="h-3 bg-muted-foreground/40 rounded w-3/4"></div>
									<div className="h-3 bg-muted-foreground/40 rounded w-5/6"></div>
								</div>
								<div className="mt-4 space-y-2">
									<div className="h-3 bg-muted-foreground/40 rounded w-full"></div>
									<div className="h-3 bg-muted-foreground/40 rounded w-3/4"></div>
									<div className="h-3 bg-muted-foreground/40 rounded w-5/6"></div>
								</div>
								<div className="aspect-[7/5] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center"></div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Template Preview Section */}
			<section className="relative py-20 bg-gradient-to-b from-muted/30 to-background dark:from-slate-800 dark:to-slate-900 overflow-hidden">
				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold text-foreground dark:text-slate-200">
							Professional Templates
						</h2>
						<p className="text-xl text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
							Choose from our collection of expertly designed templates that help you stand out
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{templates.map((template, index) => (
							<Card
								key={index}
								className="group overflow-hidden hover:shadow-xl dark:hover:shadow-xl dark:bg-slate-700 dark:hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2"
							>
								<div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 p-6 relative overflow-hidden">
									<div className="absolute inset-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border dark:border-slate-700">
										<div className="space-y-3">
											{/* Header simulation */}
											<div className="flex items-center space-x-3">
												<div className="w-12 h-12 bg-foreground/40 rounded-full"></div>
												<div className="space-y-1">
													<div className="h-3 bg-foreground/50 dark:bg-foreground/80 rounded w-24"></div>
													<div className="h-2 bg-foreground/40 dark:bg-foreground/50 rounded w-20"></div>
												</div>
											</div>

											{/* Content simulation */}
											<div className="space-y-2">
												<div className="h-2 bg-primary rounded w-16"></div>
												<div className="h-1.5 bg-muted-foreground/40 rounded w-full"></div>
												<div className="h-1.5 bg-muted-foreground/40 rounded w-3/4"></div>
												<div className="h-1.5 bg-muted-foreground/40 rounded w-5/6"></div>
											</div>

											<div className="space-y-2">
												<div className="h-2 bg-primary rounded w-20"></div>
												<div className="h-1.5 bg-muted-foreground/40 rounded w-full"></div>
												<div className="h-1.5 bg-muted-foreground/40 rounded w-4/5"></div>
											</div>

											<div className="space-y-2">
												<div className="h-2 bg-primary rounded w-16"></div>
												<div className="h-1.5 bg-muted-foreground/40 rounded w-full"></div>
												<div className="h-1.5 bg-muted-foreground/40 rounded w-2/3"></div>
											</div>
										</div>
									</div>
								</div>
								<div className="p-6">
									<h3 className="text-xl font-semibold mb-2 text-foreground dark:text-slate-200">
										{template.name}
									</h3>
									<p className="text-muted-foreground dark:text-slate-400 text-sm">
										{template.description}
									</p>
								</div>
							</Card>
						))}
					</div>

					<div className="text-center mt-12">
						<Button variant="outline" size="lg" onClick={redirectToTemplates}>
							View All Templates
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
							Why Choose Our CV Builder?
						</h2>
						<p className="text-xl text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
							Everything you need to create a standout resume that gets results
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
							How It Works
						</h2>
						<p className="text-xl text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
							Create your professional CV in just three simple steps
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
									Stand Out From the Competition
								</h2>
								<p className="text-xl text-muted-foreground dark:text-slate-400">
									Our CV builder helps you create resumes that not only look professional but also
									pass through Applicant Tracking Systems (ATS).
								</p>
							</div>

							<div className="space-y-4">
								{[
									'ATS-optimized templates that get past automated screening',
									'Industry-specific designs for maximum impact',
									'Real-time formatting that ensures perfect layout',
									'One-click PDF export for instant applications'
								].map((benefit, index) => (
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
								Ready to Land Your Dream Job?
							</h2>
							<p className="text-xl text-muted-foreground dark:text-slate-400">
								Join thousands of professionals who have successfully created their perfect CV with our
								easy-to-use builder.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" onClick={redirectToTemplates} className="text-lg px-8 py-6">
									Create Your CV Now
									<ArrowRight className="ml-2 w-5 h-5" />
								</Button>
							</div>
							<div className="flex items-center justify-center gap-4 text-sm text-muted-foreground dark:text-muted-foreground">
								<div className="flex items-center gap-1 dark:text-slate-400">
									<Clock className="w-4 h-4" />5 minutes to complete
								</div>
								<div className="flex items-center gap-1 dark:text-slate-400">
									<Shield className="w-4 h-4" />
									100% Free to start
								</div>
							</div>
						</div>
					</Card>
				</div>
			</section>
		</div>
	);
}
