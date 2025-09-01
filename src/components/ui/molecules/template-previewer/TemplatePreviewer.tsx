'use client';
import React, { useEffect, useState } from 'react';
import { UserDataType } from '@/app/models/user';
import './TemplatePreviewer.css';

type TemplateProps = {
	userData: UserDataType;
	templateStyles: string;
	compiledTemplate: ((userData: UserDataType) => string) | null;
};

export const TemplatePreviewer = ({ userData, templateStyles, compiledTemplate }: TemplateProps) => {
	const [processedHtml, setProcessedHtml] = useState('');
	const [scopedStyles, setScopedStyles] = useState('');

	// Process template with user data using compiled template function
	useEffect(() => {
		if (compiledTemplate) {
			setProcessedHtml(compiledTemplate(userData));
		}
	}, [userData, compiledTemplate]);

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
		</div>
	);
};
