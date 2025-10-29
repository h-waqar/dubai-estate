import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next' //

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@next/next': nextPlugin, // Register the plugin
    },
    rules: {
      // Your custom rules here
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_,',
          varsIgnorePattern: '^_,',
          caughtErrorsIgnorePattern: '^_,',
        },
      ],
      // Add Next.js specific rules if needed
      // For example, to enable recommended Next.js rules:
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/generated/prisma/**',
  ]),
]);

export default eslintConfig;