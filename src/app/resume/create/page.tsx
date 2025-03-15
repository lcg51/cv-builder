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
		<div className="flex h-[calc(100vh-60px)] p-4 lg:p-6">
			<div className="w-1/2 h-full">
				<StepsBar
					items={initialSteps}
					onNextStepCallback={onSetNextStep}
					onFieldChangeCallback={updateUserValue}
					initialValues={userData}
				/>
			</div>
			<TemplatePreviewer userData={userData} templateHTML={templateHTML} templateStyles={styles} />
		</div>
	);
}
