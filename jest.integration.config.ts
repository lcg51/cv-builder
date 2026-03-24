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
	// Heavier tests: require CMS mocks, hooks with async data fetching
	testMatch: [
		'<rootDir>/src/app/templates/components/**/*.spec.tsx',
		'<rootDir>/src/app/templates/hooks/**/*.spec.tsx',
		'<rootDir>/src/hooks/**/*.spec.tsx',
		'<rootDir>/src/ui/components/molecules/steps-bar/**/*.spec.tsx',
		'<rootDir>/src/ui/components/molecules/top-bar/**/*.spec.tsx'
	],
	displayName: 'integration'
};

export default config;
