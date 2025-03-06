'use client';
import React, { useCallback } from 'react';
import { ContactForm } from '../components/ContactForm';
import { EducationForm } from '../components/EducationForm';
import { Experience } from '../components/Experience';
import { StepsBar, StepsBarItemsProps } from '@/app/components/StepsBar/StepsBar';
import { HtmlPreviewer } from '@/app/components/HTMLPreviewer/HTMLPreviewer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultUserData, UserDataType } from '@/app/models/user';

type UserDataStoreType = {
	userData: UserDataType;
	resetUserData: () => void;
	setUserDataValue: (key: string, value: string) => void;
};

type StepsBarStoreType = {
	items: StepsBarItemsProps[];
	setItems: (newItems: StepsBarItemsProps[]) => void;
};

const userDataStore = create<UserDataStoreType>()(
	persist(
		set => ({
			userData: defaultUserData,
			resetUserData: () => set({ userData: defaultUserData }),
			setUserDataValue: (key: string, value: string) =>
				set((state: UserDataStoreType) => ({ userData: { ...state.userData, [key]: value } }))
		}),
		{
			name: 'user-data-store' // unique name
		}
	)
);

const stepsBarStore = create<StepsBarStoreType>()(set => ({
	items: [
		{ title: 'Contact', active: true, component: ContactForm },
		{ title: 'Experience', active: false, component: Experience },
		{ title: 'Education', active: false, component: EducationForm },
		{ title: 'Skills', active: false, component: ContactForm },
		{ title: 'About', active: false, component: ContactForm },
		{ title: 'Finish it', active: false, component: ContactForm }
	],
	setItems: (newItems: StepsBarItemsProps[]) => {
		set({ items: newItems });
	}
}));

export default function CreateResume() {
	const setUserDataValue = userDataStore((state: UserDataStoreType) => state.setUserDataValue);
	const stepsBarItems = stepsBarStore(state => state.items);
	const setStepsBarItems = stepsBarStore(state => state.setItems);
	const userData = userDataStore((state: UserDataStoreType) => state.userData);

	const updateUserValue = useCallback((key: string, value: unknown) => {
		setUserDataValue(key, value as string);
	}, []);

	return (
		<div className="flex h-full">
			<div className="w-1/2 h-full">
				<StepsBar
					items={stepsBarItems}
					onNextStepCallback={setStepsBarItems}
					onFieldChangeCallback={updateUserValue}
					initialValues={userData}
				/>
			</div>
			<HtmlPreviewer userData={userData} />
		</div>
	);
}
