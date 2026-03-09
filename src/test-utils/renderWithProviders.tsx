import React from 'react';
import { render, renderHook, type RenderOptions, type RenderHookOptions } from '@testing-library/react';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { FormValidationProvider } from '@/hooks/useFormValidation';
import { NavigationGuardProvider } from '@/app/providers/NavigationGuardProvider';

// ─── Provider config types ────────────────────────────────────────────────────

export interface IntlConfig {
	messages?: AbstractIntlMessages;
	locale?: string;
}

/**
 * Configuration for each provider in the wrapper.
 *
 * - `intl`              — next-intl config. Defaults to `{ messages: {}, locale: 'en' }`.
 *                         Set to `false` to exclude (e.g. when the test already mocks next-intl at module level).
 * - `withTheme`         — Wrap with ThemeProvider. Default: false.
 *                         Note: ThemeProvider accesses localStorage and window.matchMedia.
 * - `withFormValidation`— Wrap with FormValidationProvider. Default: false.
 * - `withNavigationGuard`— Wrap with NavigationGuardProvider. Default: false.
 *                          Requires `useRouter` and `usePathname` to be mocked in the test file.
 */
export interface ProvidersConfig {
	intl?: IntlConfig | false;
	withTheme?: boolean;
	withFormValidation?: boolean;
	withNavigationGuard?: boolean;
}

// ─── Wrapper builder ──────────────────────────────────────────────────────────

export function createWrapper(config: ProvidersConfig = {}) {
	const {
		intl = { messages: {}, locale: 'en' },
		withTheme = false,
		withFormValidation = false,
		withNavigationGuard = false
	} = config;

	return function AllProviders({ children }: { children: React.ReactNode }) {
		let content = <>{children}</>;

		if (withNavigationGuard) {
			content = <NavigationGuardProvider>{content}</NavigationGuardProvider>;
		}

		if (withFormValidation) {
			content = <FormValidationProvider>{content}</FormValidationProvider>;
		}

		if (withTheme) {
			content = (
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					{content}
				</ThemeProvider>
			);
		}

		if (intl !== false) {
			content = (
				<NextIntlClientProvider messages={intl.messages ?? {}} locale={intl.locale ?? 'en'}>
					{content}
				</NextIntlClientProvider>
			);
		}

		return content;
	};
}

// ─── renderWithProviders ──────────────────────────────────────────────────────

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
	providers?: ProvidersConfig;
}

export function renderWithProviders(ui: React.ReactElement, options: RenderWithProvidersOptions = {}) {
	const { providers, ...renderOptions } = options;
	return render(ui, { wrapper: createWrapper(providers), ...renderOptions });
}

// ─── renderHookWithProviders ──────────────────────────────────────────────────

export interface RenderHookWithProvidersOptions<Props> extends Omit<RenderHookOptions<Props>, 'wrapper'> {
	providers?: ProvidersConfig;
}

export function renderHookWithProviders<Result, Props>(
	hook: (props: Props) => Result,
	options: RenderHookWithProvidersOptions<Props> = {}
) {
	const { providers, ...hookOptions } = options;
	return renderHook(hook, { wrapper: createWrapper(providers), ...hookOptions });
}
