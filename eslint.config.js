import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

const browserAndNodeGlobals = {
  ...globals.browser,
  ...globals.node,
};

export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      // vendored tooling (impeccable / trellis skills + hooks) mirrored across
      // harness dirs — third-party .mjs that don't follow this lint config.
      '.github/skills/**',
      '.github/hooks/**',
      '.agents/**',
      '.claude/**',
      '.codex/**',
      '.trellis/**',
      '.impeccable/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,jsx,ts,tsx,astro}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: browserAndNodeGlobals,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
