import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
	{
		ignores: [
			'**/dist/**',
			'**/build/**',
			'**/node_modules/**',
			'**/*.config.{js,ts}',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		plugins: {
			import: importPlugin,
		},
		settings: {
			'import/internal-regex': '^@(app|pages|widgets|features|entities|shared)/',
		},
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		rules: {
			'no-void': 'error',
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ prefer: 'type-imports' },
			],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'import/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
					],
					'newlines-between': 'always',
					alphabetize: { order: 'asc', caseInsensitive: true },
				},
			],
		},
	},
);
