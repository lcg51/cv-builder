import { deserializeDates } from '@/lib/helpers';
import { defaultUserData, UserDataType } from '../models/user';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const NavigationStateEnum = {
	TEMPLATE_UPDATE: 'templateUpdate',
	TEMPLATE_DOWNLOAD: 'templateDownload'
} as const;

export type NavigationStateType = (typeof NavigationStateEnum)[keyof typeof NavigationStateEnum];

type ResumeDataStoreType = {
	userResumeData: UserDataType;
	navigationState: NavigationStateType;
	resetResumeUserData: () => void;
	setResumeUserDataValue: (key: string, value: string) => void;
	updateResumeUserData: (data: Partial<UserDataType>) => void;
	activeStep: number;
	setActiveStep: (step: number) => void;
	selectedTemplate: string;
	setSelectedTemplate: (template: string) => void;
	clearStorage: () => void;
};

const STORAGE_KEY = 'resume-data-store';

const resumeDataStore = create<ResumeDataStoreType>()(
	persist(
		set => ({
			userResumeData: defaultUserData,
			activeStep: 0,
			selectedTemplate: '',
			navigationState: NavigationStateEnum.TEMPLATE_UPDATE,
			resetResumeUserData: () => set({ userResumeData: defaultUserData, activeStep: 0, selectedTemplate: '' }),
			setResumeUserDataValue: (key: string, value: string) =>
				set((state: ResumeDataStoreType) => ({
					userResumeData: { ...state.userResumeData, [key]: value }
				})),
			updateResumeUserData: (data: Partial<UserDataType>) =>
				set((state: ResumeDataStoreType) => ({
					userResumeData: { ...state.userResumeData, ...data }
				})),
			setActiveStep: (step: number) => set({ activeStep: step }),
			setSelectedTemplate: (selectedTemplateId: string) => {
				console.log('Store - setSelectedTemplate called with:', selectedTemplateId);
				set({ selectedTemplate: selectedTemplateId });
			},
			clearStorage: () => {
				sessionStorage.removeItem(STORAGE_KEY);
				set({ userResumeData: defaultUserData, activeStep: 0, selectedTemplate: '' });
			}
		}),
		{
			name: STORAGE_KEY,
			storage: createJSONStorage(() => sessionStorage),
			partialize: state => ({
				userResumeData: state.userResumeData,
				activeStep: state.activeStep,
				selectedTemplate: state.selectedTemplate
			}),
			// Version control for migrations
			version: 1,
			// Migration function for future updates
			migrate: (persistedState: unknown, version: number) => {
				if (version === 0) {
					// Handle migration from version 0 to 1
					const state = persistedState as Record<string, unknown>;
					return {
						...state,
						userData: deserializeDates(state.userData)
					};
				}
				return persistedState;
			}
		}
	)
);

export { resumeDataStore, type ResumeDataStoreType };
