import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next' // Import the Next.js ESLint plugin
 
const eslintConfig = defineConfig([
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
])
 
export default eslintConfig
