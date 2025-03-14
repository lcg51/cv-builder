'use client';
import React, { useCallback } from 'react';
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
	const initialSteps = [
		{ title: 'Contact', active: true, isClickable: false, component: ContactForm },
		{ title: 'Experience', active: false, isClickable: false, component: ExperienceForm },
		{ title: 'Education', active: false, isClickable: false, component: EducationForm },
		{ title: 'Skills', active: false, isClickable: false, component: SkillsForm },
		{ title: 'About', active: false, isClickable: false, component: AboutForm },
		{ title: 'Finish it', active: false, isClickable: false, component: ContactForm }
	];

	const updateUserValue = useCallback((key: string, value: unknown) => {
		console.log(key, value);
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
		<div className="flex h-full">
			<div className="w-1/2 h-full">
				<StepsBar
					items={initialSteps}
					onNextStepCallback={onSetNextStep}
					onFieldChangeCallback={updateUserValue}
					initialValues={userData}
				/>
			</div>
			<TemplatePreviewer userData={userData} />
		</div>
	);
}
