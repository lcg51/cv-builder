import type { Config } from 'jest';

// CI config: runs all tests via Jest projects (unit + integration)
const config: Config = {
	projects: ['<rootDir>/jest.unit.config.ts', '<rootDir>/jest.integration.config.ts']
};

export default config;
