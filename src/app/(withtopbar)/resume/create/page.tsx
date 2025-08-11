'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { AboutForm } from '../components/AboutForm';
import { ContactForm } from '../components/ContactForm';
import { EducationForm } from '../components/EducationForm';
import { ExperienceForm } from '../components/ExperienceForm';
import { SkillsForm } from '../components/SkillsForm';
import { FinishForm } from '../components/FinishForm';
import { StepsBar } from '@/app/components/StepsBar/StepsBar';
import { TemplatePreviewer } from '@/app/components/TemplatePreviewer/TemplatePreviewer';
import { UserDataType } from '@/app/models/user';
import { EyeIcon } from '@/components/icons/FormIcons';
import { PersistenceDebug } from '@/app/components/PersistenceDebug';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { deserializeDates, needsDateConversion } from '@/lib/helpers';

import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { ModalDisclaimer } from '@/app/components/ModalDisclaimer';
import { useCreatePDF } from '@/hooks/useCreatePDF';

const TOPBAR_HEIGHT = 60;
const CONTAINER_PADDING = 32; // 2rem = 32px (p-4 lg:p-6)
const TOTAL_OFFSET = TOPBAR_HEIGHT + 2 * CONTAINER_PADDING;

export default function CreateResume() {
	const userResumeData = resumeDataStore((state: ResumeDataStoreType) => state.userResumeData);
	const setResumeUserDataValue = resumeDataStore((state: ResumeDataStoreType) => state.setResumeUserDataValue);
	const updateResumeUserData = resumeDataStore((state: ResumeDataStoreType) => state.updateResumeUserData);
	const activeStep = resumeDataStore((state: ResumeDataStoreType) => state.activeStep);
	const setActiveStep = resumeDataStore((state: ResumeDataStoreType) => state.setActiveStep);
	const resetResumeUserData = resumeDataStore((state: ResumeDataStoreType) => state.resetResumeUserData);
	const [showMobilePreview, setShowMobilePreview] = useState<boolean>(false);

	// Check if user has made any changes
	const hasUnsavedChanges = Object.values(userResumeData).some(
		value => value !== '' && value !== null && value !== undefined
	);

	// Use navigation guard hook
	const { showExitDialog, confirmExit, cancelExit, attemptNavigation } = useNavigationGuard({
		hasUnsavedChanges,
		onConfirmExit: resetResumeUserData
	});

	const { templateHTML, styles, fetchTemplatePDF, downloadPDF } = useCreatePDF({ userResumeData });

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

	const initialSteps = [
		{ title: 'Contact', active: true, isClickable: false, component: ContactForm },
		{ title: 'Experience', active: false, isClickable: false, component: ExperienceForm },
		{ title: 'Education', active: false, isClickable: false, component: EducationForm },
		{ title: 'Skills', active: false, isClickable: false, component: SkillsForm },
		{ title: 'About', active: false, isClickable: false, component: AboutForm },
		{ title: 'Finish', active: false, isClickable: false, component: FinishForm }
	];

	// Handle Date object conversion when store is rehydrated
	useEffect(() => {
		if (needsDateConversion(userResumeData)) {
			const convertedData = deserializeDates(userResumeData) as UserDataType;
			updateResumeUserData(convertedData);
		}
	}, [userResumeData, updateResumeUserData]);

	// Debug logging for persistence
	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			console.log('Active step loaded from store:', activeStep);
			console.log('User data loaded from store:', userResumeData);
		}
	}, [activeStep, userResumeData]);

	useEffect(() => {
		fetchTemplatePDF();
	}, []);

	const updateUserValue = useCallback((key: string, value: unknown) => {
		setResumeUserDataValue(key, value as string);
	}, []);

	const onSetNextStep = useCallback(
		(activeStepIndex: number) => {
			// Allow going to any step up to the last one
			if (activeStepIndex >= 0 && activeStepIndex < initialSteps.length) {
				setActiveStep(activeStepIndex);
			}
		},
		[initialSteps]
	);

	const toggleMobilePreview = useCallback(() => {
		setShowMobilePreview(prev => !prev);
	}, []);

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

			<div className="container mx-auto p-4 lg:p-6 pb-10">
				{/* Header */}
				{/* <div className="mb-8 text-center">
					<h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
						Create Your Resume
					</h1>
					<p className="text-slate-600 dark:text-slate-400 text-lg">
						Follow the steps below to build your professional resume
					</p>
				</div> */}

				{/* Main Content */}
				<div
					className="flex flex-col xl:flex-row gap-6 h-auto"
					style={{ height: `calc(100vh - ${TOTAL_OFFSET}px)` }}
				>
					{/* Form Section - Hidden on mobile when preview is active */}
					<div
						className={`${showMobilePreview ? 'xl:block hidden' : 'block'} w-full h-full xl:w-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 inline-flex flex-col`}
					>
						<div className="p-4 lg:p-6 h-full xl:h-full flex flex-col">
							<StepsBar
								items={initialSteps}
								activeStep={activeStep}
								onNextStepCallback={onSetNextStep}
								onFieldChangeCallback={updateUserValue}
								initialValues={userResumeData}
								onDownloadPDF={downloadPDF}
							/>
						</div>
					</div>

					{/* Preview Section - Desktop always visible, mobile conditionally visible */}
					<div
						className={`h-full ${showMobilePreview ? 'block' : 'hidden'} xl:flex w-full xl:w-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 inline-flex flex-col`}
					>
						<div className="flex flex-col w-full h-full xl:h-full">
							<div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex-shrink-0">
								<div className="flex items-center justify-between">
									<h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
										<EyeIcon />
										Live Preview
									</h2>
									{/* Mobile Close Button */}
									<button
										onClick={toggleMobilePreview}
										className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							</div>
							<div className="flex-1 min-h-0">
								<TemplatePreviewer
									userData={userResumeData}
									templateHTML={templateHTML}
									templateStyles={styles}
								/>
							</div>
						</div>
					</div>

					{/* Mobile Preview Button */}
					<div className={`xl:hidden fixed bottom-6 right-6 z-50 ${showMobilePreview ? 'hidden' : 'block'}`}>
						<button
							onClick={toggleMobilePreview}
							className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
							aria-label="Toggle preview"
						>
							<EyeIcon className="w-6 h-6 text-black" />
						</button>
					</div>
				</div>
			</div>

			{/* Debug component - remove in production */}
			{process.env.NODE_ENV === 'development' && <PersistenceDebug />}
		</div>
	);
}
