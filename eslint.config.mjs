import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
	{ files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{ languageOptions: { globals: globals.browser } },
	{ ignores: ['node_modules', 'dist', 'build', 'src/components/**'] },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{ rules: { 'react/react-in-jsx-scope': 'off' } }
];
