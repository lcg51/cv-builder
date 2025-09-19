import { StepsBar } from '@/ui/components';
import { TemplatePreviewer } from '@/ui/components';
import { EyeIcon, LockIcon, XIcon } from '@/ui/icons';
import { useCallback, useEffect, useState } from 'react';
import { FinishForm } from './FinishForm';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { deserializeDates, needsDateConversion } from '@/lib/helpers';
import { UserDataType } from '@/app/models/user';
import { ContactForm } from './ContactForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { AboutForm } from './AboutForm';
import { useTranslations } from 'next-intl';

type TemplateUpdateProps = {
	compiledTemplate: ((userData: UserDataType) => string) | null;
	styles: string;
	onTemplateDownload: () => void;
};

export const TemplateUpdate = ({ compiledTemplate, styles, onTemplateDownload }: TemplateUpdateProps) => {
	const [showMobilePreview, setShowMobilePreview] = useState<boolean>(false);
	const userResumeData = resumeDataStore((state: ResumeDataStoreType) => state.userResumeData);
	const updateResumeUserData = resumeDataStore((state: ResumeDataStoreType) => state.updateResumeUserData);
	const setActiveStep = resumeDataStore((state: ResumeDataStoreType) => state.setActiveStep);
	const setResumeUserDataValue = resumeDataStore((state: ResumeDataStoreType) => state.setResumeUserDataValue);
	const activeStep = resumeDataStore((state: ResumeDataStoreType) => state.activeStep);
	const $t = useTranslations('TemplateUpdate');
	const initialSteps = [
		{ title: $t('steps.0'), active: true, isClickable: false, component: ContactForm },
		{ title: $t('steps.1'), active: false, isClickable: false, component: ExperienceForm },
		{ title: $t('steps.2'), active: false, isClickable: false, component: EducationForm },
		{ title: $t('steps.3'), active: false, isClickable: false, component: SkillsForm },
		{ title: $t('steps.4'), active: false, isClickable: false, component: AboutForm },
		{ title: $t('steps.5'), active: false, isClickable: false, component: FinishForm }
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
			if (activeStepIndex === initialSteps.length) {
				onTemplateDownload();
			}

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
		<div className="2xl:container 2xl:mx-auto p-4 pb-10">
			{/* Main Content */}
			<div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-115px)]">
				{/* Form Section - Hidden on mobile when preview is active */}
				<div
					className={`${showMobilePreview ? 'lg:block hidden' : 'block'} w-full h-full lg:w-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 inline-flex flex-col`}
				>
					<div className="p-4 lg:p-6 h-full xl:h-full flex flex-col">
						<StepsBar
							items={initialSteps}
							activeStep={activeStep}
							onNextStepCallback={onSetNextStep}
							onFieldChangeCallback={updateUserValue}
							initialValues={userResumeData}
							$t={$t}
						/>
					</div>
				</div>

				{/* Preview Section - Desktop always visible, mobile conditionally visible */}
				<div
					className={`h-full ${showMobilePreview ? 'block' : 'hidden'} lg:flex w-full lg:w-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 inline-flex flex-col`}
				>
					<div className="flex flex-col w-full h-full xl:h-full">
						<div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex-shrink-0">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
									<EyeIcon />
									{$t('livePreview.title')}
								</h2>
								{/* Mobile Close Button */}
								<button
									onClick={toggleMobilePreview}
									className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
								>
									<XIcon className="w-5 h-5" />
								</button>
							</div>
						</div>
						<div className="flex-1 min-h-0">
							<TemplatePreviewer
								userData={userResumeData}
								templateStyles={styles}
								compiledTemplate={compiledTemplate}
							/>
						</div>
						{/* Controls */}
						<div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex-shrink-0">
							<div className="flex items-center justify-center gap-4">
								<div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
									<LockIcon />
									{$t('livePreview.description')}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile Preview Button */}
				<div
					className={`block lg:hidden fixed bottom-6 right-6 z-50 ${showMobilePreview ? 'hidden' : 'block lg:hidden'}`}
				>
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
	);
};
