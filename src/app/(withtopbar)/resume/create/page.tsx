'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { TemplateSelection } from '../components/TemplateSelection';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { ModalDisclaimer } from '@/app/components/ModalDisclaimer';
import { TemplateUpdate } from '../components/TemplateUpdate';
import { TemplateSkeleton } from '../components/TemplateSkeleton';
import { TemplateUpdateSkeleton } from '../components/TemplateUpdateSkeleton';

const TOPBAR_HEIGHT = 60;
const CONTAINER_PADDING = 32; // 2rem = 32px (p-4 lg:p-6)
const TOTAL_OFFSET = TOPBAR_HEIGHT + 2 * CONTAINER_PADDING;

export default function CreateResume() {
	const userResumeData = resumeDataStore((state: ResumeDataStoreType) => state.userResumeData);
	const resetResumeUserData = resumeDataStore((state: ResumeDataStoreType) => state.resetResumeUserData);
	const selectedTemplate = resumeDataStore((state: ResumeDataStoreType) => state.selectedTemplate);
	const setSelectedTemplate = resumeDataStore((state: ResumeDataStoreType) => state.setSelectedTemplate);
	const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
	const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

	// Check if user has made any changes
	const hasUnsavedChanges = Object.values(userResumeData).some(
		value => value !== '' && value !== null && value !== undefined
	);

	// Use navigation guard hook
	const { showExitDialog, confirmExit, cancelExit, attemptNavigation } = useNavigationGuard({
		hasUnsavedChanges,
		onConfirmExit: resetResumeUserData
	});

	// Listen for navigation attempts from TopBar
	useEffect(() => {
		const handleNavigationAttempt = () => {
			if (hasUnsavedChanges) {
				attemptNavigation('/home');
			}
		};

		window.addEventListener('navigation-attempt', handleNavigationAttempt as EventListener);
		return () => window.removeEventListener('navigation-attempt', handleNavigationAttempt as EventListener);
	}, [hasUnsavedChanges, attemptNavigation]);

	// Simulate page initialization
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsPageLoading(false);
		}, 300);

		return () => clearTimeout(timer);
	}, []);

	const handleTemplateSelect = useCallback(
		async (templateId: string) => {
			setIsTransitioning(true);
			// Simulate a small delay for smooth transition
			await new Promise(resolve => setTimeout(resolve, 300));
			setSelectedTemplate(templateId);
			setIsTransitioning(false);
		},
		[setSelectedTemplate]
	);

	const Skeleton = !selectedTemplate ? TemplateSkeleton : TemplateUpdateSkeleton;

	return (
		<div
			className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800`}
			style={{ height: `calc(100vh - ${TOPBAR_HEIGHT}px)` }}
		>
			{/* Exit Disclaimer Dialog */}
			<ModalDisclaimer
				open={showExitDialog}
				onOpenChange={() => {
					if (!showExitDialog) {
						attemptNavigation('/home');
					}
				}}
				onConfirm={confirmExit}
				onCancel={cancelExit}
			/>

			{/* Show skeleton during transitions */}
			{isTransitioning || isPageLoading ? (
				<Skeleton />
			) : !selectedTemplate ? (
				<TemplateSelection onTemplateSelect={handleTemplateSelect} />
			) : (
				<TemplateUpdate totalOffset={TOTAL_OFFSET} templateId={selectedTemplate} />
			)}
		</div>
	);
}
