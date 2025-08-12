import { StepsBar } from '@/app/components/StepsBar/StepsBar';
import { TemplatePreviewer } from '@/app/components/TemplatePreviewer/TemplatePreviewer';
import { EyeIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ContactForm } from './ContactForm';
import { AboutForm } from './AboutForm';
import { FinishForm } from './FinishForm';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useCreatePDF } from '@/hooks/useCreatePDF';
import { PersistenceDebug } from '@/app/components/PersistenceDebug';
import { deserializeDates, needsDateConversion } from '@/lib/helpers';
import { UserDataType } from '@/app/models/user';

type TemplateUpdateProps = {
	totalOffset: number;
	templateId: string;
};

export const TemplateUpdate = ({ totalOffset, templateId }: TemplateUpdateProps) => {
	const [showMobilePreview, setShowMobilePreview] = useState<boolean>(false);
	const userResumeData = resumeDataStore((state: ResumeDataStoreType) => state.userResumeData);
	const updateResumeUserData = resumeDataStore((state: ResumeDataStoreType) => state.updateResumeUserData);
	const setActiveStep = resumeDataStore((state: ResumeDataStoreType) => state.setActiveStep);
	const setResumeUserDataValue = resumeDataStore((state: ResumeDataStoreType) => state.setResumeUserDataValue);
	const activeStep = resumeDataStore((state: ResumeDataStoreType) => state.activeStep);

	const { templateHTML, styles, downloadPDF, setCurrentTemplate } = useCreatePDF({ userResumeData, templateId });

	const initialSteps = [
		{ title: 'Contact', active: true, isClickable: false, component: ContactForm },
		{ title: 'Experience', active: false, isClickable: false, component: ExperienceForm },
		{ title: 'Education', active: false, isClickable: false, component: EducationForm },
		{ title: 'Skills', active: false, isClickable: false, component: SkillsForm },
		{ title: 'About', active: false, isClickable: false, component: AboutForm },
		{ title: 'Finish', active: false, isClickable: false, component: FinishForm }
	];

	const updateUserValue = useCallback((key: string, value: unknown) => {
		setResumeUserDataValue(key, value as string);
	}, []);

	// Handle Date object conversion when store is rehydrated
	useEffect(() => {
		if (needsDateConversion(userResumeData)) {
			const convertedData = deserializeDates(userResumeData) as UserDataType;
			updateResumeUserData(convertedData);
		}
	}, [userResumeData, updateResumeUserData]);

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
		<div className="container mx-auto p-4 lg:p-6 pb-10">
			{/* Main Content */}
			<div
				className="flex flex-col xl:flex-row gap-6 h-auto"
				style={{ height: `calc(100vh - ${totalOffset}px)` }}
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

			{process.env.NODE_ENV === 'development' && (
				<PersistenceDebug onTemplateChange={setCurrentTemplate} currentTemplate={templateId} />
			)}
		</div>
	);
};
