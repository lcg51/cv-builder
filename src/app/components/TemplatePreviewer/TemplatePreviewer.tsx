'use client';
import React, { useEffect, useState } from 'react';
import { UserDataType } from '@/app/models/user';
import './TemplatePreviewer.css';
import { LockIcon } from '@/components/icons/FormIcons';
import { processTemplate } from '@/lib/templateProcessor';

type TemplateProps = {
	userData: UserDataType;
	templateHTML: string;
	templateStyles: string;
};

export const TemplatePreviewer = ({ userData, templateHTML, templateStyles }: TemplateProps) => {
	const [processedHtml, setProcessedHtml] = useState('');
	const [scopedStyles, setScopedStyles] = useState('');

	useEffect(() => {
		if (!templateHTML) return;
		const updatedTemplate = processTemplate(templateHTML, userData);
		setProcessedHtml(updatedTemplate);
	}, [userData, templateHTML]);

	useEffect(() => {
		if (!templateStyles) return;

		// Scope the CSS by prefixing all selectors with the template wrapper class
		const scopedCSS = templateStyles
			// Add the wrapper class prefix to all CSS rules
			.replace(/([^{}]+){/g, (match, selector) => {
				// Skip @media queries and other at-rules
				if (selector.trim().startsWith('@')) {
					return match;
				}
				// Add the wrapper class prefix to selectors
				return `.template-preview-scope ${selector.trim()}{`;
			})
			// Handle nested @media queries
			.replace(/@media([^{]+){/g, '@media$1{')
			// Add the wrapper class prefix inside @media queries
			.replace(/(@media[^{]+{)([^}]+)}/g, (match, mediaQuery, content) => {
				const scopedContent = content.replace(/([^{}]+){/g, (m: string, s: string) => {
					if (s.trim().startsWith('@')) return m;
					return `.template-preview-scope ${s.trim()}{`;
				});
				return `${mediaQuery}${scopedContent}}`;
			});

		setScopedStyles(scopedCSS);
	}, [templateStyles]);

	return (
		<div className="flex flex-col h-full">
			{/* Preview Content */}
			<div className="bg-slate-100 dark:bg-slate-900 p-4 xl:flex-1 overflow-y-auto min-h-0">
				<div className="max-w-[8.5in] mx-auto bg-white shadow-lg template-preview-scope" id="cv-preview">
					<style dangerouslySetInnerHTML={{ __html: scopedStyles }} />
					<div className="cv-wrapper" dangerouslySetInnerHTML={{ __html: processedHtml }} />
				</div>
			</div>

			{/* Controls */}
			<div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex-shrink-0">
				<div className="flex items-center justify-center gap-4">
					<div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
						<LockIcon />
						Preview updates automatically
					</div>
				</div>
			</div>
		</div>
	);
};
