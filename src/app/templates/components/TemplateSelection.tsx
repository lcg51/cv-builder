'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@/ui/components/button';
import { SearchIcon, FilterIcon, ArrowRight } from '@/ui/icons';
import { type Template as TemplateType, type TemplateCategory } from '@/templates';
import { Template } from '../../components/Template';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useRouter } from 'next/navigation';
import { SearchFilters } from '@/ui/components';
import { useTranslations } from 'next-intl';

interface TemplateSelectionProps {
	templates: TemplateType[];
	searchTemplatesByQuery: (query: string) => void;
	resetToAllTemplates: () => void;
	loadTemplatesByCategory: (category: TemplateCategory) => void;
}

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({
	templates,
	searchTemplatesByQuery,
	resetToAllTemplates,
	loadTemplatesByCategory
}) => {
	const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const { push } = useRouter();
	const setSelectedTemplate = resumeDataStore((state: ResumeDataStoreType) => state.setSelectedTemplate);
	const tags = ['professional', 'creative', 'modern', 'minimal'] as TemplateCategory[];
	const $t = useTranslations('TemplatesPage');

	const handleProceedToTemplate = useCallback(() => {
		setSelectedTemplate(selectedTemplateId);
		push(`/templates/${selectedTemplateId}`);
	}, [push, selectedTemplateId]);

	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query);
			if (query.trim()) {
				searchTemplatesByQuery(query);
			} else {
				resetToAllTemplates();
			}
		},
		[searchQuery, searchTemplatesByQuery, resetToAllTemplates]
	);

	const handleCategoryFilter = useCallback(
		(category: TemplateCategory | 'all') => {
			if (category === 'all') {
				resetToAllTemplates();
			} else {
				loadTemplatesByCategory(category);
			}
		},
		[resetToAllTemplates, loadTemplatesByCategory]
	);

	const noTemplateMatchText = useMemo(() => {
		if (searchQuery.trim()) {
			return $t('noTemplatesMatch', { query: searchQuery });
		} else {
			return $t('noTemplatesMatchCurrentFilters');
		}
	}, [searchQuery, $t]);

	const resetFilters = useCallback(() => {
		setSearchQuery('');
		resetToAllTemplates();
	}, [setSearchQuery, resetToAllTemplates]);

	const templateGridSection = useMemo(() => {
		return (
			<div className="container mx-auto p-4 lg:p-0">
				<div className="w-full max-w-5xl mx-auto">
					{/* Template Grid */}
					{templates.length > 0 ? (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 pt-4">
							{templates.map(template => (
								<Template
									key={template.id}
									template={template}
									selectedTemplateId={selectedTemplateId}
									onClickTemplate={setSelectedTemplateId}
								/>
							))}
						</div>
					) : (
						/* No Results Component */
						<div className="flex flex-col items-center justify-center py-16 text-center">
							<div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
								<SearchIcon className="w-12 h-12 text-slate-400" />
							</div>
							<h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
								{$t('noTemplatesFound')}
							</h3>
							<p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">{noTemplateMatchText}</p>
							<div className="flex gap-3">
								<Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
									<FilterIcon className="w-4 h-4" />
									{$t('clearFilters')}
								</Button>
								{searchQuery.trim() && (
									<Button variant="outline" onClick={resetFilters}>
										{$t('clearSearch')}
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}, [templates, selectedTemplateId, setSelectedTemplateId, noTemplateMatchText, resetFilters]);

	return (
		<div className="template-selection-container flex flex-col min-h-screen">
			{/* Header Section */}
			<div className="container mx-auto p-4 pb-0 lg:pt-6 ">
				<div className="w-full mx-auto">
					{/* Header */}
					<div className="text-center">
						<h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
							{$t('title')}
						</h1>
						<p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
							{$t('description')}
						</p>
					</div>
				</div>
			</div>

			<SearchFilters
				searchQuery={searchQuery}
				onSearch={handleSearch}
				placeholderText={$t('searchPlaceholder')}
				onSelectCategory={handleCategoryFilter}
				tags={tags}
			/>

			{/* Scrollable Template Grid Section */}
			<div className="min-h-[calc(100vh-300px)]">{templateGridSection}</div>

			{/* Sticky Action Buttons Section */}
			<div className="sticky bottom-0 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 z-20 border-t border-slate-200 dark:border-slate-700 py-4">
				<div className="container mx-auto px-4 lg:px-6">
					<div className="w-full">
						{/* Action Buttons */}
						<div className="text-center">
							<Button
								onClick={handleProceedToTemplate}
								disabled={!selectedTemplateId}
								size="lg"
								className="px-8 py-3 text-lg"
							>
								{$t.rich('continueWith', {
									templateName: selectedTemplateId
										? (templates.find(t => t.id === selectedTemplateId)?.name ??
											$t('defaultTemplateName'))
										: $t('defaultTemplateName')
								})}
								<ArrowRight className="ml-2 w-5 h-5" />
							</Button>
						</div>

						{/* Help Text */}
						<div className="text-center mt-4">
							<p className="text-sm text-slate-500 dark:text-slate-400">{$t('helpText')}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
