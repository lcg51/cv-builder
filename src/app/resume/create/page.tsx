'use client';
import React, { useCallback, useState } from 'react';
import { ContactForm } from '../components/ContactForm';
import { ExperienceForm } from '../components/ExperienceForm';
import { EducationForm } from '../components/EducationForm';
import { StepsBar, StepsBarItemsProps } from '../../components/StepsBar/StepsBar';
import { HtmlPreviewer } from '@/app/components/HTMLPreviewer/HTMLPreviewer';
import { create } from 'zustand';
import { defaultUserData, UserDataType } from '@/app/models/user';

type UserDataStoreType = {
	userData: UserDataType;
	resetUserData: () => void;
	setUserDataValue: (key: string, value: string) => void;
};

const userDataStore = create<UserDataStoreType>(set => ({
	userData: defaultUserData,
	resetUserData: () => set({ userData: defaultUserData }),
	setUserDataValue: (key: string, value: string) =>
		set((state: UserDataStoreType) => ({ userData: { ...state.userData, [key]: value } }))
}));

export default function CreateResume() {
	const setUserDataValue = userDataStore((state: UserDataStoreType) => state.setUserDataValue);
	const userData = userDataStore((state: UserDataStoreType) => state.userData);
	const [items, setItems] = useState<StepsBarItemsProps[]>([
		{
			title: 'Contact',
			active: true,
			component: ContactForm
		},
		{ title: 'Experience', active: false, component: ExperienceForm },
		{ title: 'Education', active: false, component: EducationForm },
		{ title: 'Skills', active: false, component: ContactForm },
		{ title: 'About', active: false, component: ContactForm },
		{ title: 'Finish it', active: false, component: ContactForm }
	]);

	const updateItems = (newItems: StepsBarItemsProps[]) => {
		setItems(newItems);
	};

	const updateUserValue = useCallback((key: string, value: string) => {
		setUserDataValue(key, value);
	}, []);

	return (
		<div className="flex h-full">
			<StepsBar items={items} onNextStepCallback={updateItems} onFieldChangeCallback={updateUserValue} />
			<HtmlPreviewer userData={userData} />
		</div>
	);
}
