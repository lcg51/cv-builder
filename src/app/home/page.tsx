'use client';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { loginBG } from '../../assets';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { FileText, CheckCircle, ArrowRight, Sparkles, Clock, Shield } from 'lucide-react';
import { features, stats, steps, templates } from './sections';

export default function Home() {
	const { push } = useRouter();

	const onClick = useCallback(() => {
		push('/resume/create');
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/30 dark:from-slate-900 dark:to-slate-800">
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<div className="container mx-auto px-4 py-20 lg:py-32">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="space-y-8">
							<div className="space-y-4">
								<Badge
									variant="secondary"
									className="px-4 py-2 text-sm font-medium dark:bg-slate-700 dark:text-slate-200"
								>
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
								<Button size="lg" onClick={onClick} className="text-lg px-8 py-6">
									Start Building Free
									<ArrowRight className="ml-2 w-5 h-5" />
								</Button>
								<Button variant="outline" size="lg" className="text-lg px-8 py-6">
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

						<div className="relative lg:ml-8">
							<div className="relative z-10 bg-white dark:bg-card dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
								<div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
									<div className="text-center space-y-4">
										<FileText className="w-16 h-16 text-primary mx-auto" />
										<div className="space-y-2">
											<div className="h-3 bg-primary/20 rounded w-32 mx-auto"></div>
											<div className="h-2 bg-primary/10 rounded w-24 mx-auto"></div>
											<div className="h-2 bg-primary/10 rounded w-28 mx-auto"></div>
										</div>
									</div>
								</div>
								<div className="mt-4 space-y-2">
									<div className="h-3 bg-muted-foreground/40 rounded w-full"></div>
									<div className="h-3 bg-muted-foreground/40 rounded w-3/4"></div>
								</div>
							</div>
							<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl transform scale-110"></div>
						</div>
					</div>
				</div>
			</section>

			{/* Template Preview Section */}
			<section className="py-20 bg-gradient-to-b from-muted/30 to-background dark:from-slate-800 dark:to-slate-900">
				<div className="container mx-auto px-4">
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
												<div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full"></div>
												<div className="space-y-1">
													<div className="h-3 bg-foreground/80 dark:bg-foreground/80 rounded w-24"></div>
													<div className="h-2 bg-foreground/50 dark:bg-foreground/50 rounded w-20"></div>
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

									{/* Hover overlay */}
									{/* <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
										<Button variant="secondary" size="sm">
											Use This Template
										</Button>
									</div> */}
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
						<Button variant="outline" size="lg">
							View All Templates
							<ArrowRight className="ml-2 w-5 h-5" />
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-muted/50 dark:bg-slate-800">
				<div className="container mx-auto px-4">
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
								className="p-6 h-full hover:shadow-lg dark:bg-slate-700 dark:hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
							>
								<div className="space-y-4">
									<div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center transition-colors group-hover:bg-primary/20 dark:group-hover:bg-primary/30">
										<feature.icon className="w-6 h-6 text-primary dark:text-primary" />
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2 text-foreground dark:text-slate-200">
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
			<section className="py-20 bg-background dark:bg-background">
				<div className="container mx-auto px-4">
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
									<div className="w-16 h-16 bg-primary text-foreground dark:bg-primary dark:text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
										{step.number}
									</div>
								</div>
								<div>
									<h3 className="text-xl font-semibold mb-2 text-foreground dark:text-slate-200">
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
							<Image
								src={loginBG}
								alt="Professional CV Design"
								width="600"
								height="400"
								className="rounded-2xl shadow-2xl dark:shadow-xl"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/40 dark:to-transparent rounded-2xl"></div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-background dark:bg-background">
				<div className="container mx-auto px-4">
					<Card className="p-12 text-center bg-gradient-to-r from-primary/10 to-secondary/10 dark:bg-slate-700 dark:from-primary/20 dark:to-secondary/20 border-0">
						<div className="space-y-6 max-w-2xl mx-auto">
							<h2 className="text-3xl lg:text-4xl font-bold text-foreground dark:text-slate-200">
								Ready to Land Your Dream Job?
							</h2>
							<p className="text-xl text-muted-foreground dark:text-slate-400">
								Join thousands of professionals who have successfully created their perfect CV with our
								easy-to-use builder.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" onClick={onClick} className="text-lg px-8 py-6">
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
