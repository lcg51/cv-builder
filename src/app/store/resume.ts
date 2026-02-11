import { deserializeDates } from '@/lib/helpers';
import { defaultUserData } from '../models/user';
import { TemplateDataType } from '@/types/template';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const NavigationStateEnum = {
	TEMPLATE_UPDATE: 'templateUpdate',
	TEMPLATE_DOWNLOAD: 'templateDownload'
} as const;

export type NavigationStateType = (typeof NavigationStateEnum)[keyof typeof NavigationStateEnum];

type ResumeDataStoreType = {
	userResumeData: TemplateDataType;
	navigationState: NavigationStateType;
	resetResumeUserData: () => void;
	setResumeUserDataValue: (key: string, value: string) => void;
	updateResumeUserData: (data: Partial<TemplateDataType>) => void;
	activeStep: number;
	setActiveStep: (step: number) => void;
	selectedTemplate: string;
	setSelectedTemplate: (template: string) => void;
	clearStorage: () => void;
	// Add hydration state
	_hasHydrated: boolean;
	setHasHydrated: (hasHydrated: boolean) => void;
};

const STORAGE_KEY = 'resume-data-store';

const resumeDataStore = create<ResumeDataStoreType>()(
	persist(
		set => ({
			userResumeData: defaultUserData,
			activeStep: 0,
			selectedTemplate: '',
			navigationState: NavigationStateEnum.TEMPLATE_UPDATE,
			_hasHydrated: false,
			resetResumeUserData: () => set({ userResumeData: defaultUserData, activeStep: 0, selectedTemplate: '' }),
			setResumeUserDataValue: (key: string, value: string) =>
				set((state: ResumeDataStoreType) => ({
					userResumeData: { ...state.userResumeData, [key]: value }
				})),
			updateResumeUserData: (data: Partial<TemplateDataType>) =>
				set((state: ResumeDataStoreType) => ({
					userResumeData: { ...state.userResumeData, ...data }
				})),
			setActiveStep: (step: number) => set({ activeStep: step }),
			setSelectedTemplate: (selectedTemplateId: string) => {
				set({ selectedTemplate: selectedTemplateId });
			},
			setHasHydrated: (hasHydrated: boolean) => set({ _hasHydrated: hasHydrated }),
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
			},
			// Add onRehydrateStorage callback to track hydration
			onRehydrateStorage: () => state => {
				if (state) {
					// Validate that the rehydrated state is consistent
					if (state.selectedTemplate && !state.userResumeData.firstName) {
						// If we have a selected template but no user data, reset to prevent inconsistent state
						console.warn('Inconsistent store state detected, resetting');
						state.resetResumeUserData();
					}
					state.setHasHydrated(true);
				}
			}
		}
	)
);

export { resumeDataStore, type ResumeDataStoreType };
