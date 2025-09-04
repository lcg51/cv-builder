'use client';
import React, { createContext, useContext, useMemo, useRef, ReactNode } from 'react';

// Form validation context
export type FormValidationContextType = {
	registerForm: (formId: string | undefined, validate: () => Promise<boolean>) => void;
	unregisterForm: (formId: string | undefined) => void;
	submitCurrentForm: (currentFormId?: string) => Promise<boolean>;
};

const FormValidationContext = createContext<FormValidationContextType | null>(null);

export const useFormValidation = () => {
	const context = useContext(FormValidationContext);
	if (!context) {
		throw new Error('useFormValidation must be used within a FormValidationProvider');
	}
	return context;
};

export type FormValidationProviderProps = {
	children: ReactNode;
};

export const FormValidationProvider = ({ children }: FormValidationProviderProps) => {
	const formValidatorsRef = useRef<Map<string, () => Promise<boolean>>>(new Map());

	// Form validation context value
	const formValidationContextValue = useMemo<FormValidationContextType>(
		() => ({
			registerForm: (formId: string | undefined, validate: () => Promise<boolean>) => {
				if (formId) {
					formValidatorsRef.current.set(formId, validate);
				}
			},
			unregisterForm: (formId: string | undefined) => {
				if (formId) {
					formValidatorsRef.current.delete(formId);
				}
			},
			submitCurrentForm: async (currentFormId?: string) => {
				// If no formId is provided, allow progression
				if (!currentFormId) {
					return true;
				}
				const validator = formValidatorsRef.current.get(currentFormId);
				if (validator) {
					return await validator();
				}
				return true; // If no validator, allow progression
			}
		}),
		[]
	);

	return (
		<FormValidationContext.Provider value={formValidationContextValue}>{children}</FormValidationContext.Provider>
	);
};
