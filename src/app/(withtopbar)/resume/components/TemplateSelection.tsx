'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon, EyeIcon, SearchIcon, FilterIcon } from 'lucide-react';
import type { Template, TemplateCategory } from '@/templates';

type TemplateCategoryFilter = 'all' | TemplateCategory;

interface TemplateSelectionProps {
	templates: Template[];
	searchTemplatesByQuery: (query: string) => void;
	resetToAllTemplates: () => void;
	loadTemplatesByCategory: (category: TemplateCategory) => void;
	onTemplateSelect: (templateId: string) => void;
}

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({
	onTemplateSelect,
	templates,
	searchTemplatesByQuery,
	resetToAllTemplates,
	loadTemplatesByCategory
}) => {
	const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [selectedCategory, setSelectedCategory] = useState<TemplateCategoryFilter>('all');

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
	const handleCategoryFilter = (category: TemplateCategoryFilter) => {
		setSelectedCategory(category);
		if (category === 'all') {
			resetToAllTemplates();
		} else {
			loadTemplatesByCategory(category as Template['category']);
		}
	};

	const handleTemplateSelect = () => {
		onTemplateSelect(selectedTemplateId);
	};

	return (
		<div className="template-selection-container flex flex-col min-h-screen">
			{/* Header Section */}

			<div className="container mx-auto p-4 lg:p-6">
				<div className="w-full max-w-4xl mx-auto">
					{/* Header */}
					<div className="text-center mb-6">
						<h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
							Choose Your Template
						</h1>
						<p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
							Select a professional template that best represents your style and industry. You can preview
							how your resume will look and change templates later.
						</p>
					</div>
				</div>
			</div>

			{/* Search and Filter - Now properly sticky */}
			<div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 sticky top-[60px] z-20 space-y-4 p-4 lg:p-6">
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

			{/* Scrollable Template Grid Section */}
			<div className="min-h-[calc(100vh-300px)]">
				<div className="container mx-auto p-4 lg:p-6">
					<div className="w-full max-w-4xl mx-auto">
						{/* Template Grid */}
						{templates.length > 0 ? (
							<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 pb-4">
								{templates.map(template => (
									<Card
										key={template.id}
										className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
											selectedTemplateId === template.id
												? 'ring-2 ring-primary shadow-lg scale-105'
												: 'hover:scale-105'
										}`}
										onClick={() => setSelectedTemplateId(template.id)}
									>
										{/* Template Preview */}
										<div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 p-6 flex items-center justify-center">
											<div className="text-center">
												<EyeIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
												<div className="text-sm text-slate-500 dark:text-slate-400">
													{template.preview}
												</div>
											</div>

											{/* Selection Indicator */}
											{selectedTemplateId === template.id && (
												<div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
													<CheckIcon className="w-4 h-4 text-muted" />
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
										{selectedTemplateId === template.id && (
											<div className="absolute inset-0 bg-muted/5 border-2 border-muted rounded-lg" />
										)}
									</Card>
								))}
							</div>
						) : (
							/* No Results Component */
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
									<SearchIcon className="w-12 h-12 text-slate-400" />
								</div>
								<h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
									No templates found
								</h3>
								<p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
									{searchQuery.trim()
										? `No templates match "${searchQuery}". Try adjusting your search terms or category filter.`
										: 'No templates match your current filters. Try selecting a different category or clearing your filters.'}
								</p>
								<div className="flex gap-3">
									<Button
										variant="outline"
										onClick={() => {
											setSearchQuery('');
											setSelectedCategory('all');
											resetToAllTemplates();
										}}
										className="flex items-center gap-2"
									>
										<FilterIcon className="w-4 h-4" />
										Clear Filters
									</Button>
									{searchQuery.trim() && (
										<Button
											variant="outline"
											onClick={() => {
												setSearchQuery('');
												resetToAllTemplates();
											}}
										>
											Clear Search
										</Button>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Sticky Action Buttons Section */}
			<div className="sticky bottom-0 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 z-20 border-t border-slate-200 dark:border-slate-700 py-4">
				<div className="container mx-auto px-4 lg:px-6">
					<div className="w-full max-w-4xl mx-auto">
						{/* Action Buttons */}
						<div className="text-center">
							<Button
								onClick={handleTemplateSelect}
								disabled={!selectedTemplateId}
								size="lg"
								className="px-8 py-3 text-lg"
							>
								Continue with{' '}
								{selectedTemplateId
									? templates.find(t => t.id === selectedTemplateId)?.name
									: 'Template'}
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
						<div className="text-center mt-4">
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Don&apos;t worry! You can change your template at any time during the creation process.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
