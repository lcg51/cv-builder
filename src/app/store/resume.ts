import { deserializeDates } from '@/lib/helpers';
import { defaultUserData, UserDataType } from '../models/user';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ResumeDataStoreType = {
	userResumeData: UserDataType;
	resetResumeUserData: () => void;
	setResumeUserDataValue: (key: string, value: string) => void;
	updateResumeUserData: (data: Partial<UserDataType>) => void;
	activeStep: number;
	setActiveStep: (step: number) => void;
	clearStorage: () => void;
};

const STORAGE_KEY = 'resume-data-store';

const resumeDataStore = create<ResumeDataStoreType>()(
	persist(
		set => ({
			userResumeData: defaultUserData,
			activeStep: 0,
			resetResumeUserData: () => set({ userResumeData: defaultUserData, activeStep: 0 }),
			setResumeUserDataValue: (key: string, value: string) =>
				set((state: ResumeDataStoreType) => ({
					userResumeData: { ...state.userResumeData, [key]: value }
				})),
			updateResumeUserData: (data: Partial<UserDataType>) =>
				set((state: ResumeDataStoreType) => ({
					userResumeData: { ...state.userResumeData, ...data }
				})),
			setActiveStep: (step: number) => set({ activeStep: step }),
			clearStorage: () => {
				localStorage.removeItem(STORAGE_KEY);
				set({ userResumeData: defaultUserData, activeStep: 0 });
			}
		}),
		{
			name: STORAGE_KEY,
			storage: createJSONStorage(() => localStorage),
			partialize: state => ({
				userResumeData: state.userResumeData,
				activeStep: state.activeStep
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
