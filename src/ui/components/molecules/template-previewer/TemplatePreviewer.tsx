'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TemplateDataType } from '@/types/payload-types';
import { TemplatePreviewerSkeleton } from './TemplatePreviewerSkeleton';

type TemplateProps = {
	userData: TemplateDataType;
	templateStyles: string;
	compiledTemplate: ((userData: TemplateDataType) => string) | null;
	isLoading?: boolean;
};

export const TemplatePreviewer = ({ userData, templateStyles, compiledTemplate, isLoading }: TemplateProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const shadowHostRef = useRef<HTMLDivElement>(null);
	const shadowRootRef = useRef<ShadowRoot | null>(null);
	const attachedNodeRef = useRef<HTMLDivElement | null>(null);
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
		const optimalScale = Math.max(Math.min(scaleX, scaleY, 1), minScale);

		setScale(optimalScale);
	}, [containerRef]);

	useEffect(() => {
		if (!shadowHostRef.current || !compiledTemplate) return;

		if (attachedNodeRef.current !== shadowHostRef.current) {
			shadowRootRef.current = shadowHostRef.current.attachShadow({ mode: 'closed' });
			attachedNodeRef.current = shadowHostRef.current;
		}

		const html = compiledTemplate(userData);
		calculateOptimalScale();

		shadowRootRef.current!.innerHTML = `
			<style>
				:host {
					all: initial;
					display: block;
					user-select: none;
					-webkit-user-select: none;
					pointer-events: none;
				}
				* { box-sizing: border-box; }
				.cv-wrapper {
					transform: scale(${scale});
					transform-origin: top left;
					width: ${100 / scale}%;
				}
				${templateStyles}
			</style>
			<div class="cv-wrapper">${html}</div>
		`;
	}, [userData, compiledTemplate, templateStyles, scale, calculateOptimalScale]);

	// Disable right-click context menu on the preview
	useEffect(() => {
		const host = shadowHostRef.current;
		if (!host) return;
		const preventContextMenu = (e: Event) => e.preventDefault();
		host.addEventListener('contextmenu', preventContextMenu);
		return () => host.removeEventListener('contextmenu', preventContextMenu);
	}, []);

	useEffect(() => {
		window.addEventListener('resize', calculateOptimalScale);
		return () => window.removeEventListener('resize', calculateOptimalScale);
	}, [calculateOptimalScale]);

	if (isLoading) {
		return <TemplatePreviewerSkeleton />;
	}

	return (
		<div className="flex flex-col h-full">
			{/* Preview Content */}
			<div className="bg-slate-100 dark:bg-slate-900 p-4 xl:flex-1 overflow-y-auto min-h-0" ref={containerRef}>
				<div className="max-w-[8.5in] mx-auto shadow-lg" id="cv-preview">
					<div ref={shadowHostRef} />
				</div>
			</div>
		</div>
	);
};
