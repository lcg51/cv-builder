'use client';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { loginBG } from '../../assets';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { FileText, Download, Eye, Zap, CheckCircle, ArrowRight, Sparkles, Clock, Shield } from 'lucide-react';

export default function Home() {
	const { push } = useRouter();

	const onClick = useCallback(() => {
		push('/resume/create');
	}, []);

	const features = [
		{
			icon: FileText,
			title: 'Professional Templates',
			description: 'Choose from beautifully designed templates crafted by industry experts'
		},
		{
			icon: Eye,
			title: 'Real-time Preview',
			description: 'See your CV come to life as you edit with instant visual feedback'
		},
		{
			icon: Download,
			title: 'PDF Export',
			description: 'Download your polished CV as a high-quality PDF ready for applications'
		},
		{
			icon: Zap,
			title: 'Quick & Easy',
			description: 'Create a professional CV in minutes with our intuitive step-by-step process'
		}
	];

	const steps = [
		{
			number: '01',
			title: 'Fill Your Information',
			description: 'Add your contact details, experience, education, and skills'
		},
		{
			number: '02',
			title: 'Choose Template',
			description: 'Select from our collection of professional CV templates'
		},
		{
			number: '03',
			title: 'Preview & Export',
			description: 'Review your CV in real-time and download as PDF'
		}
	];

	const stats = [
		{ label: 'CVs Created', value: '10,000+' },
		{ label: 'Job Interviews', value: '5,000+' },
		{ label: 'Success Rate', value: '92%' }
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<div className="container mx-auto px-4 py-20 lg:py-32">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="space-y-8">
							<div className="space-y-4">
								<Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
									<Sparkles className="w-4 h-4 mr-2" />
									AI-Powered CV Builder
								</Badge>
								<h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
									Create Your
									<span className="text-primary block">Dream CV</span>
									in Minutes
								</h1>
								<p className="text-xl text-muted-foreground max-w-lg">
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
										<div className="text-2xl font-bold text-primary">{stat.value}</div>
										<div className="text-sm text-muted-foreground">{stat.label}</div>
									</div>
								))}
							</div>
						</div>

						<div className="relative lg:ml-8">
							<div className="relative z-10 bg-white dark:bg-card rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
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
									<div className="h-3 bg-muted rounded w-full"></div>
									<div className="h-3 bg-muted rounded w-3/4"></div>
								</div>
							</div>
							<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl transform scale-110"></div>
						</div>
					</div>
				</div>
			</section>

			{/* Template Preview Section */}
			<section className="py-20 bg-gradient-to-b from-muted/30 to-background">
				<div className="container mx-auto px-4">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold">Professional Templates</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Choose from our collection of expertly designed templates that help you stand out
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{[
							{
								name: 'Modern Professional',
								description: 'Clean and contemporary design perfect for tech and business roles',
								preview: 'template1'
							},
							{
								name: 'Executive Elite',
								description: 'Sophisticated layout ideal for senior management positions',
								preview: 'template2'
							},
							{
								name: 'Creative Focus',
								description: 'Distinctive design for creative and design professionals',
								preview: 'template3'
							}
						].map((template, index) => (
							<Card
								key={index}
								className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
							>
								<div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-secondary/5 p-6 relative overflow-hidden">
									<div className="absolute inset-4 bg-white dark:bg-card rounded-lg shadow-lg p-4 border">
										<div className="space-y-3">
											{/* Header simulation */}
											<div className="flex items-center space-x-3">
												<div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full"></div>
												<div className="space-y-1">
													<div className="h-3 bg-foreground/80 rounded w-24"></div>
													<div className="h-2 bg-foreground/50 rounded w-20"></div>
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
									<div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
										<Button variant="secondary" size="sm">
											Use This Template
										</Button>
									</div>
								</div>
								<div className="p-6">
									<h3 className="text-xl font-semibold mb-2">{template.name}</h3>
									<p className="text-muted-foreground text-sm">{template.description}</p>
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
			<section className="py-20 bg-muted/50">
				<div className="container mx-auto px-4">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold">Why Choose Our CV Builder?</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Everything you need to create a standout resume that gets results
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<Card
								key={index}
								className="p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
							>
								<div className="space-y-4">
									<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center transition-colors group-hover:bg-primary/20">
										<feature.icon className="w-6 h-6 text-primary" />
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
										<p className="text-muted-foreground">{feature.description}</p>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold">How It Works</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Create your professional CV in just three simple steps
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						{steps.map((step, index) => (
							<div key={index} className="text-center space-y-4">
								<div className="relative">
									<div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
										{step.number}
									</div>
									{index < steps.length - 1 && (
										<div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border transform translate-x-4"></div>
									)}
								</div>
								<div>
									<h3 className="text-xl font-semibold mb-2">{step.title}</h3>
									<p className="text-muted-foreground">{step.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 bg-muted/50">
				<div className="container mx-auto px-4">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="space-y-8">
							<div>
								<h2 className="text-3xl lg:text-4xl font-bold mb-4">Stand Out From the Competition</h2>
								<p className="text-xl text-muted-foreground">
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
										<CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
										<p className="text-muted-foreground">{benefit}</p>
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
								className="rounded-2xl shadow-2xl"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<Card className="p-12 text-center bg-gradient-to-r from-primary/10 to-secondary/10 border-0">
						<div className="space-y-6 max-w-2xl mx-auto">
							<h2 className="text-3xl lg:text-4xl font-bold">Ready to Land Your Dream Job?</h2>
							<p className="text-xl text-muted-foreground">
								Join thousands of professionals who have successfully created their perfect CV with our
								easy-to-use builder.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" onClick={onClick} className="text-lg px-8 py-6">
									Create Your CV Now
									<ArrowRight className="ml-2 w-5 h-5" />
								</Button>
							</div>
							<div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
								<div className="flex items-center gap-1">
									<Clock className="w-4 h-4" />5 minutes to complete
								</div>
								<div className="flex items-center gap-1">
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
