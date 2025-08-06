'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { AboutForm } from '../components/AboutForm';
import { ContactForm } from '../components/ContactForm';
import { EducationForm } from '../components/EducationForm';
import { ExperienceForm } from '../components/ExperienceForm';
import { SkillsForm } from '../components/SkillsForm';
import { StepsBar } from '@/app/components/StepsBar/StepsBar';
import { TemplatePreviewer } from '@/app/components/TemplatePreviewer/TemplatePreviewer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultUserData, UserDataType } from '@/app/models/user';
import { EyeIcon } from '@/components/icons/FormIcons';

type UserDataStoreType = {
	userData: UserDataType;
	resetUserData: () => void;
	setUserDataValue: (key: string, value: string) => void;
	activeStep: number;
	setActiveStep: (step: number) => void;
};

const userDataStore = create<UserDataStoreType>()(
	persist(
		set => ({
			userData: defaultUserData,
			activeStep: 0,
			resetUserData: () => set({ userData: defaultUserData }),
			setUserDataValue: (key: string, value: string) =>
				set((state: UserDataStoreType) => ({ userData: { ...state.userData, [key]: value } })),
			setActiveStep: (step: number) => set({ activeStep: step })
		}),
		{
			name: 'user-data-store' // unique name
		}
	)
);

export default function CreateResume() {
	const userData = userDataStore((state: UserDataStoreType) => state.userData);
	const setUserDataValue = userDataStore((state: UserDataStoreType) => state.setUserDataValue);
	const activeStep = userDataStore((state: UserDataStoreType) => state.activeStep);
	const setActiveStep = userDataStore((state: UserDataStoreType) => state.setActiveStep);
	const [templateHTML, setTemplateHTML] = useState<string>('');
	const [styles, setStyles] = useState<string>('');
	const initialSteps = [
		{ title: 'Contact', active: true, isClickable: false, component: ContactForm },
		{ title: 'Experience', active: false, isClickable: false, component: ExperienceForm },
		{ title: 'Education', active: false, isClickable: false, component: EducationForm },
		{ title: 'Skills', active: false, isClickable: false, component: SkillsForm },
		{ title: 'About', active: false, isClickable: false, component: AboutForm },
		{ title: 'Finish it', active: false, isClickable: false, component: ContactForm }
	];

	useEffect(() => {
		const fetchTemplate = async () => {
			try {
				const htmlResponse = await fetch('/templates/template1/template1.html');
				const stylesResponse = await fetch('/templates/template1/template1.css');
				if (!htmlResponse.ok || !stylesResponse.ok) {
					throw new Error(`HTTP error! status: ${htmlResponse.status}`);
				}

				const template = await htmlResponse.text();
				const styles = await stylesResponse.text();

				setTemplateHTML(template || '');
				setStyles(styles || '');
			} catch (error) {
				console.error('Error fetching template:', error);
			}
		};

		fetchTemplate();
	}, []);

	const updateUserValue = useCallback((key: string, value: unknown) => {
		setUserDataValue(key, value as string);
	}, []);

	const onSetNextStep = useCallback(
		(activeStepIndex: number) => {
			if (activeStepIndex === initialSteps.length - 1) return;
			setActiveStep(activeStepIndex);
		},
		[activeStep, initialSteps]
	);

	return (
		<div className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<div className="container mx-auto p-4 lg:p-6">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
						Create Your Resume
					</h1>
					<p className="text-slate-600 dark:text-slate-400 text-lg">
						Follow the steps below to build your professional resume
					</p>
				</div>

				{/* Main Content */}
				<div className="flex flex-col xl:flex-row gap-6 min-h-[calc(100vh-200px)]">
					{/* Form Section */}
					<div className="w-full xl:w-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
						<div className="h-full overflow-y-auto">
							<div className="p-4 lg:p-6">
								<StepsBar
									items={initialSteps}
									onNextStepCallback={onSetNextStep}
									onFieldChangeCallback={updateUserValue}
									initialValues={userData}
								/>
							</div>
						</div>
					</div>

					{/* Preview Section - Hidden on mobile, shown in modal */}
					<div className="hidden xl:flex w-full xl:w-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
						<div className="h-full flex flex-col w-full">
							<div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
								<h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
									<EyeIcon />
									Live Preview
								</h2>
							</div>
							<div className="flex-1 overflow-hidden">
								<TemplatePreviewer
									userData={userData}
									templateHTML={templateHTML}
									templateStyles={styles}
								/>
							</div>
						</div>
					</div>

					{/* Mobile Preview Button */}
					<div className="xl:hidden fixed bottom-6 right-6 z-50">
						<button className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
							<EyeIcon className="w-6 h-6" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
