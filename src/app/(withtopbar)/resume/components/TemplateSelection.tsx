'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon, EyeIcon, RefreshCwIcon } from 'lucide-react';
import { TemplateSkeleton } from './TemplateSkeleton';

interface Template {
	id: string;
	name: string;
	description: string;
	preview: string;
}

interface TemplateSelectionProps {
	onTemplateSelect: (templateId: string) => void;
}

// Simulated API call for templates
const fetchTemplates = async (): Promise<Template[]> => {
	// Simulate network delay
	await new Promise(resolve => setTimeout(resolve, 800));

	return [
		{
			id: 'template1',
			name: 'Classic Header',
			description:
				'Clean and professional design with a traditional header layout, perfect for corporate environments and traditional industries.',
			preview: 'template1'
		},
		{
			id: 'template2',
			name: 'Modern Sidebar',
			description:
				'Contemporary design with a sidebar layout, ideal for creative professionals and modern workplaces.',
			preview: 'template2'
		},
		{
			id: 'template3',
			name: 'Card Layout',
			description:
				'Innovative card-based design that stands out, perfect for tech professionals and creative portfolios.',
			preview: 'template3'
		}
	];
};

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({ onTemplateSelect }) => {
	const [selectedTemplate, setSelectedTemplate] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [templates, setTemplates] = useState<Template[]>([]);
	const [error, setError] = useState<string | null>(null);

	// Fetch templates on component mount
	useEffect(() => {
		const loadTemplates = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const fetchedTemplates = await fetchTemplates();
				setTemplates(fetchedTemplates);
			} catch (err) {
				setError('Failed to load templates. Please try again.');
				console.error('Error loading templates:', err);
			} finally {
				setIsLoading(false);
			}
		};

		loadTemplates();
	}, []);

	// Retry loading templates
	const handleRetry = () => {
		setIsLoading(true);
		setError(null);
		fetchTemplates()
			.then(fetchedTemplates => {
				setTemplates(fetchedTemplates);
			})
			.catch(err => {
				setError('Failed to load templates. Please try again.');
				console.error('Error loading templates:', err);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	// Show skeleton while loading
	if (isLoading) {
		return <TemplateSkeleton />;
	}

	// Show error state
	if (error) {
		return (
			<div className="container mx-auto p-4 lg:p-6 pb-10">
				<div className="w-full max-w-4xl mx-auto text-center">
					<div className="mb-8">
						<h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
							Oops! Something went wrong
						</h1>
						<p className="text-lg text-slate-600 dark:text-slate-400 mb-6">{error}</p>
						<Button onClick={handleRetry} size="lg" className="px-8 py-3 text-lg">
							<RefreshCwIcon className="w-5 h-5 mr-2" />
							Try Again
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 lg:p-6 pb-10">
			<div className="w-full max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
						Choose Your Template
					</h1>
					<p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
						Select a professional template that best represents your style and industry. You can preview how
						your resume will look and change templates later.
					</p>
				</div>

				{/* Template Grid */}
				<div className="grid md:grid-cols-3 gap-6 mb-8">
					{templates.map(template => (
						<Card
							key={template.id}
							className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
								selectedTemplate === template.id
									? 'ring-2 ring-primary shadow-lg scale-105'
									: 'hover:scale-105'
							}`}
							onClick={() => setSelectedTemplate(template.id)}
						>
							{/* Template Preview */}
							<div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 p-6 flex items-center justify-center">
								<div className="text-center">
									<EyeIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
									<div className="text-sm text-slate-500 dark:text-slate-400">{template.preview}</div>
								</div>

								{/* Selection Indicator */}
								{selectedTemplate === template.id && (
									<div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
										<CheckIcon className="w-4 h-4 text-white" />
									</div>
								)}
							</div>

							{/* Template Info */}
							<div className="p-6">
								<h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
									{template.name}
								</h3>
								<p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
									{template.description}
								</p>
							</div>

							{/* Selection Overlay */}
							{selectedTemplate === template.id && (
								<div className="absolute inset-0 bg-primary/5 border-2 border-primary rounded-lg" />
							)}
						</Card>
					))}
				</div>

				{/* Action Buttons */}
				<div className="text-center">
					<Button
						onClick={() => onTemplateSelect(selectedTemplate)}
						disabled={!selectedTemplate}
						size="lg"
						className="px-8 py-3 text-lg"
					>
						Continue with{' '}
						{selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : 'Template'}
						<svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</Button>
				</div>

				{/* Help Text */}
				<div className="text-center mt-6">
					<p className="text-sm text-slate-500 dark:text-slate-400">
						Don&apos;t worry! You can change your template at any time during the creation process.
					</p>
				</div>
			</div>
		</div>
	);
};
