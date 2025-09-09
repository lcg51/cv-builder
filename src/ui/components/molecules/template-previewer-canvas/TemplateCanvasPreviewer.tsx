'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { UserDataType } from '@/app/models/user';
import html2canvas from 'html2canvas';
import './TemplateCanvasPreviewer.css';

type TemplateProps = {
	userData: UserDataType;
	templateStyles: string;
	compiledTemplate: ((userData: UserDataType) => string) | null;
};

export const TemplatePreviewer = ({ userData, templateStyles, compiledTemplate }: TemplateProps) => {
	const [processedHtml, setProcessedHtml] = useState('');
	const [isGeneratingCanvas, setIsGeneratingCanvas] = useState(false);
	const [scale, setScale] = useState(1);
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const isMountedRef = useRef(true);

	// Process template with user data using compiled template function
	useEffect(() => {
		if (compiledTemplate) {
			setProcessedHtml(compiledTemplate(userData));
		}
	}, [userData, compiledTemplate]);

	// Calculate optimal scale for different resolutions
	const calculateOptimalScale = useCallback(() => {
		if (!containerRef.current || !canvasContainerRef.current) return;

		const container = containerRef.current;
		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;

		// Standard A4 dimensions (8.5in x 11in) in pixels at 96 DPI
		const standardWidth = 8.5 * 96; // 816px
		const standardHeight = 11 * 96; // 1056px

		// Calculate scale based on container dimensions
		const scaleX = (containerWidth - 32) / standardWidth; // 32px for padding
		const scaleY = (containerHeight - 32) / standardHeight; // 32px for padding

		// Use the smaller scale to ensure the entire template fits
		const optimalScale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%

		setScale(optimalScale);
	}, []);

	// Generate canvas from HTML after HTML is processed
	useEffect(() => {
		if (!processedHtml) return;

		generateCanvas();
	}, [processedHtml]);

	// Calculate scale after canvas is generated and container is available
	useEffect(() => {
		if (!processedHtml || !canvasContainerRef.current) return;

		// Use a small delay to ensure DOM is fully rendered
		const timer = setTimeout(() => {
			// Check if component is still mounted before calculating scale
			if (isMountedRef.current) {
				calculateOptimalScale();
			}
		}, 100);

		return () => clearTimeout(timer);
	}, [processedHtml, calculateOptimalScale]);

	// Handle resize events to recalculate scale
	useEffect(() => {
		const handleResize = () => {
			calculateOptimalScale();
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [calculateOptimalScale]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const generateCanvas = async () => {
		if (!canvasContainerRef.current) return;

		setIsGeneratingCanvas(true);

		// Store ref in local variable to avoid null access after unmount
		const canvasContainer = canvasContainerRef.current;

		try {
			// Create a temporary div with the HTML content
			const tempDiv = document.createElement('div');
			tempDiv.className = 'max-w-[8.5in] mx-auto bg-white shadow-lg template-preview-scope';
			tempDiv.style.position = 'absolute';
			tempDiv.style.left = '-9999px';
			tempDiv.style.top = '0';
			tempDiv.style.width = '8.5in';
			tempDiv.style.backgroundColor = '#ffffff';
			// Don't set fixed height - let content determine it
			tempDiv.style.height = 'auto';
			tempDiv.style.overflow = 'visible';

			// Add the template styles
			const styleElement = document.createElement('style');
			styleElement.textContent = templateStyles;
			tempDiv.appendChild(styleElement);

			// Add the HTML content
			tempDiv.innerHTML += processedHtml;

			// Append to body temporarily
			document.body.appendChild(tempDiv);

			// Wait for the content to be rendered and calculate dimensions
			await new Promise(resolve => setTimeout(resolve, 200));

			// Get the actual content height after rendering
			const contentHeight = tempDiv.scrollHeight;

			const canvas = await html2canvas(tempDiv, {
				scale: 2, // Higher resolution
				useCORS: false, // Disable CORS to avoid cross-origin stylesheet issues
				allowTaint: false, // Disable taint to prevent security issues
				backgroundColor: '#ffffff',
				// Use the actual content height
				height: contentHeight,
				width: tempDiv.offsetWidth,
				scrollX: 0,
				scrollY: 0,
				// Better image handling
				imageTimeout: 15000,
				// Remove problematic options
				removeContainer: false,
				// Add logging to help debug
				logging: false
				// Ignore external stylesheets that can't be accessed
			});

			// Remove the temporary div
			document.body.removeChild(tempDiv);

			// Clear previous canvas and append the new one
			canvasContainer.innerHTML = '';
			canvasContainer.appendChild(canvas);

			// Trigger scale calculation after canvas is rendered
			setTimeout(() => {
				// Check if component is still mounted before calculating scale
				if (isMountedRef.current && canvasContainerRef.current && containerRef.current) {
					calculateOptimalScale();
				}
			}, 50);
		} catch (error) {
			console.error('Error generating canvas:', error);

			// Handle CORS and security errors specifically
			if (error instanceof Error) {
				if (error.message.includes('cssRules') || error.message.includes('cross-origin')) {
					console.warn('CORS stylesheet access blocked. Trying fallback approach...');
					// You could implement a fallback here, such as showing the HTML directly
					// or using a different rendering approach
				}
			}
		} finally {
			setIsGeneratingCanvas(false);
		}
	};

	return (
		<div className="flex flex-col h-full">
			{/* Preview Content */}
			<div ref={containerRef} className="bg-slate-100 dark:bg-slate-900 p-4 xl:flex-1 overflow-y-auto min-h-0">
				{/* Canvas Display */}
				<div className="max-w-[8.5in] mx-auto shadow-lg">
					{isGeneratingCanvas && (
						<div className="flex items-center justify-center p-8">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							<span className="ml-2 text-gray-600">Generating preview...</span>
						</div>
					)}
					<div
						ref={canvasContainerRef}
						className="w-full flex justify-center"
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
