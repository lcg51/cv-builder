import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'jest-environment-jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	transform: {
		'^.+\\.(ts|tsx)$': ['babel-jest', { configFile: './jest.babel.config.cts' }]
	},
	transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$))', '<rootDir>/tailwind.config.ts'],
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		// Stub @/auth before the general @/* mapping to avoid loading next-auth (ESM) in Jest
		'^@/auth$': '<rootDir>/src/__mocks__/auth.ts',
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	// Fast tests: no network/CMS dependencies
	testMatch: [
		'<rootDir>/src/app/providers/**/*.spec.{ts,tsx}',
		'<rootDir>/src/ui/components/molecules/progress-bar/**/*.spec.{ts,tsx}',
		'<rootDir>/src/services/**/*.spec.{ts,tsx}'
	],
	displayName: 'unit'
};

export default config;
