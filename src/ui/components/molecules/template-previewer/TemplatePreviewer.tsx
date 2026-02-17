'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TemplateDataType } from '@/types/payload-types';
import './TemplatePreviewer.css';
import { TemplatePreviewerSkeleton } from './TemplatePreviewerSkeleton';

type TemplateProps = {
	userData: TemplateDataType;
	templateStyles: string;
	compiledTemplate: ((userData: TemplateDataType) => string) | null;
	isLoading?: boolean;
};

export const TemplatePreviewer = ({ userData, templateStyles, compiledTemplate, isLoading }: TemplateProps) => {
	const [processedHtml, setProcessedHtml] = useState('');
	const [scopedStyles, setScopedStyles] = useState('');
	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);

	const calculateOptimalScale = useCallback(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;

		// Standard A4 dimensions (8.5in x 11in) in pixels at 96 DPI
		const standardWidth = 8.5 * 96; // 816px
		const standardHeight = 11 * 96; // 1056px

		// Check if container is hidden (width or height is 0)
		const isHidden = containerWidth === 0 || containerHeight === 0;

		let effectiveWidth = containerWidth;
		let effectiveHeight = containerHeight;
		let minScale = 0.75;

		if (isHidden) {
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			if (viewportWidth < 1024) {
				effectiveWidth = Math.min(viewportWidth, 800);
				effectiveHeight = Math.min(viewportHeight * 0.6, 800);
				minScale = 0.5;
			}
		}

		// Calculate scale based on container dimensions
		const scaleX = (effectiveWidth - 32) / standardWidth; // 32px for padding
		const scaleY = (effectiveHeight - 32) / standardHeight; // 32px for padding

		// Use the smaller scale to ensure the entire template fits
		// Add minimum scale threshold to prevent extremely small scales
		const optimalScale = Math.max(Math.min(scaleX, scaleY, 1), minScale);

		setScale(optimalScale);
	}, [containerRef]);

	useEffect(() => {
		if (compiledTemplate) {
			setProcessedHtml(compiledTemplate(userData));
			calculateOptimalScale();
		}
		window.addEventListener('resize', calculateOptimalScale);
		return () => window.removeEventListener('resize', calculateOptimalScale);
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

	if (isLoading) {
		return <TemplatePreviewerSkeleton />;
	}

	return (
		<div className="flex flex-col h-full">
			{/* Preview Content */}
			<div className="bg-slate-100 dark:bg-slate-900 p-4 xl:flex-1 overflow-y-auto min-h-0" ref={containerRef}>
				<div className="max-w-[8.5in] mx-auto bg-white shadow-lg template-preview-scope" id="cv-preview">
					<style dangerouslySetInnerHTML={{ __html: scopedStyles }} />
					<div
						className="cv-wrapper"
						dangerouslySetInnerHTML={{ __html: processedHtml }}
						style={{
							transform: `scale(${scale})`,
							transformOrigin: 'top left',
							width: `${100 / scale}%`,
							height: `${100 / scale}%`
						}}
					/>
				</div>
			</div>
		</div>
	);
};
