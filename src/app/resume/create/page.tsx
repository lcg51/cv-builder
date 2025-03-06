'use client';
import React, { useCallback } from 'react';
import { ContactForm } from '../components/ContactForm';
import { EducationForm } from '../components/EducationForm';
import { Experience } from '../components/Experience';
import { StepsBar } from '@/app/components/StepsBar/StepsBar';
import { HtmlPreviewer } from '@/app/components/HTMLPreviewer/HTMLPreviewer';
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
		{ title: 'Contact', active: true, component: ContactForm },
		{ title: 'Experience', active: false, component: Experience },
		{ title: 'Education', active: false, component: EducationForm },
		{ title: 'Skills', active: false, component: ContactForm },
		{ title: 'About', active: false, component: ContactForm },
		{ title: 'Finish it', active: false, component: ContactForm }
	];

	const updateUserValue = useCallback((key: string, value: unknown) => {
		setUserDataValue(key, value as string);
	}, []);

	const onSetNextStep = useCallback(() => {
		if (activeStep === initialSteps.length - 1) return;
		setActiveStep(activeStep + 1);
	}, [activeStep, initialSteps]);

	return (
		<div className="flex h-full">
			<div className="w-1/2 h-full">
				<StepsBar
					items={initialSteps}
					activeStep={activeStep}
					onNextStepCallback={onSetNextStep}
					onFieldChangeCallback={updateUserValue}
					initialValues={userData}
				/>
			</div>
			<HtmlPreviewer userData={userData} />
		</div>
	);
}
