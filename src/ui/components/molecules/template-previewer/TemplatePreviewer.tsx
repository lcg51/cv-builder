'use client';
import React, { useEffect, useRef, useState } from 'react';
import { TemplateDataType } from '@/types/payload-types';
import { TemplatePreviewerSkeleton } from './TemplatePreviewerSkeleton';

type TemplateProps = {
	userData: TemplateDataType;
	templateStyles: string;
	compiledTemplate: ((userData: TemplateDataType) => string) | null;
	isLoading?: boolean;
};

// US Letter dimensions (8.5" × 11") at 96 DPI
const US_LETTER_WIDTH = 8.5 * 96; // 816px
const US_LETTER_HEIGHT = 11 * 96; // 1056px

function computeScale(width: number, height: number): number {
	const isHidden = width === 0 || height === 0;
	let effectiveWidth = width;
	let effectiveHeight = height;
	let minScale = 0.75;

	if (isHidden) {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		if (vw < 1024) {
			effectiveWidth = Math.min(vw, 800);
			effectiveHeight = Math.min(vh * 0.6, 800);
			minScale = 0.5;
		}
	}

	const scaleX = (effectiveWidth - 32) / US_LETTER_WIDTH; // 32px for padding
	const scaleY = (effectiveHeight - 32) / US_LETTER_HEIGHT;
	return Math.max(Math.min(scaleX, scaleY, 1), minScale);
}

export const TemplatePreviewer = ({ userData, templateStyles, compiledTemplate, isLoading }: TemplateProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const shadowHostRef = useRef<HTMLDivElement>(null);
	const shadowRootRef = useRef<ShadowRoot | null>(null);
	const attachedNodeRef = useRef<HTMLDivElement | null>(null);
	const [scale, setScale] = useState(1);

	// Observe container resize — fires on layout shifts too, not just window resize
	useEffect(() => {
		if (isLoading) return;
		const container = containerRef.current;
		if (!container) return;

		const observer = new ResizeObserver(entries => {
			if (entries.length === 0) return;
			const { width, height } = entries[0].contentRect;
			setScale(computeScale(width, height));
		});

		observer.observe(container);
		setScale(computeScale(container.offsetWidth, container.offsetHeight));

		return () => observer.disconnect();
	}, [isLoading]);

	useEffect(() => {
		if (!shadowHostRef.current || !compiledTemplate) return;

		if (attachedNodeRef.current !== shadowHostRef.current) {
			shadowRootRef.current = shadowHostRef.current.attachShadow({ mode: 'closed' });
			attachedNodeRef.current = shadowHostRef.current;
		}

		const root = shadowRootRef.current;
		if (!root) return;

		root.innerHTML = `
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
			<div class="cv-wrapper">${compiledTemplate(userData)}</div>
		`;
	}, [userData, compiledTemplate, templateStyles, scale]);

	// Disable right-click context menu on the preview
	useEffect(() => {
		const host = shadowHostRef.current;
		if (!host) return;
		const preventContextMenu = (e: Event) => e.preventDefault();
		host.addEventListener('contextmenu', preventContextMenu);
		return () => host.removeEventListener('contextmenu', preventContextMenu);
	}, []);

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
