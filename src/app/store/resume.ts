import { deserializeDates } from '@/lib/helpers';
import { defaultUserData } from '../models/user';
import { TemplateDataType } from '@/types/payload-types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/** Shape written to sessionStorage at version 0. */
type PersistedV0 = {
	userData: {
		// field was renamed to userResumeData in v1
		workExperience?: { startDate: string; endDate: string; [k: string]: unknown }[];
		education?: { finishDate: string; [k: string]: unknown }[];
		[k: string]: unknown;
	};
	activeStep: number;
	selectedTemplate: string;
};

/** Shape written to sessionStorage at version 1 (current). */
type PersistedV1 = {
	userResumeData: TemplateDataType;
	activeStep: number;
	selectedTemplate: string;
};

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
			/*
			 * STORE VERSIONING CONVENTION
			 * ────────────────────────────
			 * Bump `version` and add a migration branch whenever:
			 *   • A persisted field is renamed or removed
			 *   • A new *required* field is added (provide a safe default in the migration)
			 *
			 * Adding a new optional field with a default in `defaultUserData` does NOT
			 * require a version bump — Zustand deep-merges the default state over the
			 * rehydrated state automatically.
			 *
			 * Migration function signature:
			 *   migrate(persistedState, fromVersion) => PersistedV<current>
			 *
			 * Always chain versions explicitly (0→1, 1→2, …).
			 * Do NOT use a catch-all `return persistedState` for unknown future versions
			 * — it silently loads incompatible data. Unknown versions should return null
			 * to reset to defaults instead.
			 *
			 * Add a PersistedV<N> type for each version so renames are caught at
			 * compile time.
			 *
			 * Version history:
			 *   v0 → v1  Field renamed: userData → userResumeData; dates deserialized.
			 */
			version: 1,
			migrate: (persistedState: unknown, version: number): PersistedV1 => {
				if (version === 0) {
					const s = persistedState as PersistedV0;
					return {
						userResumeData: deserializeDates(s.userData) as TemplateDataType,
						activeStep: s.activeStep ?? 0,
						selectedTemplate: s.selectedTemplate ?? ''
					};
				}
				if (version === 1) {
					return persistedState as PersistedV1;
				}
				// Unrecognised version — safe reset rather than loading incompatible state
				console.warn(`[resume-store] Unknown persisted version ${version}, resetting to defaults`);
				return null as unknown as PersistedV1; // Zustand treats null as "use initial state"
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
