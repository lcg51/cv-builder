'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon, EyeIcon, RefreshCwIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { TemplateSkeleton } from './TemplateSkeleton';
import { useTemplates } from '@/hooks/useTemplates';
import type { Template } from '@/templates';

interface TemplateSelectionProps {
	onTemplateSelect: (templateId: string) => void;
}

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({ onTemplateSelect }) => {
	const [selectedTemplate, setSelectedTemplate] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');

	const {
		templates,
		loading: isLoading,
		error,
		searchTemplatesByQuery,
		loadTemplatesByCategory,
		resetToAllTemplates,
		clearError
	} = useTemplates();

	// Handle search
	const handleSearch = (query: string) => {
		setSearchQuery(query);
		if (query.trim()) {
			searchTemplatesByQuery(query);
		} else {
			resetToAllTemplates();
		}
	};

	// Handle category filter
	const handleCategoryFilter = (category: string) => {
		setSelectedCategory(category);
		if (category === 'all') {
			resetToAllTemplates();
		} else {
			loadTemplatesByCategory(category as Template['category']);
		}
	};

	// Retry loading templates
	const handleRetry = () => {
		clearError();
		resetToAllTemplates();
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

				{/* Search and Filter */}
				<div className="mb-8 space-y-4">
					{/* Search Bar */}
					<div className="relative max-w-md mx-auto">
						<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
						<input
							type="text"
							placeholder="Search templates..."
							value={searchQuery}
							onChange={e => handleSearch(e.target.value)}
							className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>

					{/* Category Filter */}
					<div className="flex flex-wrap justify-center gap-2">
						<Button
							variant={selectedCategory === 'all' ? 'default' : 'outline'}
							size="sm"
							onClick={() => handleCategoryFilter('all')}
							className="flex items-center gap-2"
						>
							<FilterIcon className="w-4 h-4" />
							All
						</Button>
						<Button
							variant={selectedCategory === 'professional' ? 'default' : 'outline'}
							size="sm"
							onClick={() => handleCategoryFilter('professional')}
						>
							Professional
						</Button>
						<Button
							variant={selectedCategory === 'modern' ? 'default' : 'outline'}
							size="sm"
							onClick={() => handleCategoryFilter('modern')}
						>
							Modern
						</Button>
						<Button
							variant={selectedCategory === 'creative' ? 'default' : 'outline'}
							size="sm"
							onClick={() => handleCategoryFilter('creative')}
						>
							Creative
						</Button>
						<Button
							variant={selectedCategory === 'minimal' ? 'default' : 'outline'}
							size="sm"
							onClick={() => handleCategoryFilter('minimal')}
						>
							Minimal
						</Button>
					</div>
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
								<div className="flex items-center justify-between mb-2">
									<h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
										{template.name}
									</h3>
									<span className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full capitalize">
										{template.category}
									</span>
								</div>
								<p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">
									{template.description}
								</p>
								{/* Tags */}
								<div className="flex flex-wrap gap-1">
									{template.tags.slice(0, 3).map((tag, index) => (
										<span
											key={index}
											className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
										>
											{tag}
										</span>
									))}
								</div>
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
