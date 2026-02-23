import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
	{ ignores: ['node_modules', 'dist', 'build'] },
	{
		files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: { globals: globals.browser }
	},
	// Config files at root need Node.js globals
	{
		files: ['*.config.{js,mjs,cjs,ts}', 'scripts/**/*.{js,mjs,cjs,ts}'],
		languageOptions: { globals: globals.node }
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		rules: {
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-explicit-any': 'warn'
		}
	}
];
