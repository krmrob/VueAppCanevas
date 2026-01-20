import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import pluginImport from 'eslint-plugin-import';
import pluginJest from 'eslint-plugin-jest';
import pluginPromise from 'eslint-plugin-promise';
import pluginSonarJS from 'eslint-plugin-sonarjs';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig([
   {
      ignores: ['dist', '**/node_modules', 'coverage', 'playground/playground-dist', 'src/api'],
   },
   js.configs.recommended,
   ...ts.configs.recommended,
   pluginPromise.configs['flat/recommended'],
   ...pluginVue.configs['flat/recommended'],
   pluginSonarJS.configs.recommended,
   {
      plugins: {
         pluginSonarJS,
      },
      rules: {
         'sonarjs/no-nested-functions': 'off',
      },
   },
   pluginImport.flatConfigs.recommended,
   {
      languageOptions: {
         globals: {
            ...globals.browser,
         },

         ecmaVersion: 'latest',
         sourceType: 'module',
      },
   },
   {
      rules: {
         'import/no-self-import': 'error',
         'import/newline-after-import': 'error',
         'import/no-unresolved': 'off', // sort beaucoup de faux  positifs, la build va les trouver de toute façon.
         'import/extensions': 'off',
         'unicode-bom': 'error',
         'import/named': 'off', // sort beaucoup de faux  positifs, la build va les trouver de toute façon.
         'import/order': [
            'error',
            {
               'newlines-between': 'always',
               alphabetize: {
                  order: 'asc',
               },
               groups: ['builtin', 'external', 'internal', 'sibling'],
               pathGroups: [
                  {
                     pattern: '@/**',
                     group: 'internal',
                  },
               ],
            },
         ],

         'no-restricted-imports': [
            'error',
            {
               patterns: [
                  {
                     group: ['*.spec', '*.spec.ts'],
                     message: 'On ne doit pas importer des fichiers de tests',
                  },
                  {
                     group: ['../*'],
                     message: "Pas d'import relatif à l'extérieur du dossier courant",
                  },
               ],
            },
         ],
         'no-restricted-syntax': [
            'error',
            {
               selector: "CatchClause:not(:has(CallExpression[callee.name='logError']))",
               message: 'Les blocks catch doivent appeler la fonction logError de @/core/services/logging.',
            },
         ],
         'no-console': 'error',
         '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
         '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      },
   },
   {
      files: ['*.vue', '**/*.vue'],
      languageOptions: {
         parserOptions: {
            parser: '@typescript-eslint/parser',
         },
      },

      rules: {
         'vue/html-indent': ['error', 3],
         'vue/html-self-closing': 'off',
         'vue/max-attributes-per-line': 'off',
         'vue/singleline-html-element-content-newline': 'off',
         'vue/html-closing-bracket-newline': [
            'error',
            {
               singleline: 'never',
               multiline: 'always',
            },
         ],
         'vue/first-attribute-linebreak': [
            'error',
            {
               singleline: 'ignore',
               multiline: 'ignore',
            },
         ],
         'vue/prop-name-casing': ['error', 'camelCase'],
         'vue/custom-event-name-casing': ['error'],
         'vue/script-indent': ['error', 3, { baseIndent: 1 }],
         'vue/v-slot-style': [
            'error',
            {
               atComponent: 'longform',
               default: 'longform',
               named: 'longform',
            },
         ],
         'vue/multi-word-component-names': [
            'error',
            {
               ignores: ['index'],
            },
         ],
      },
   },
   {
      files: ['webpack.config/**/*.js', 'eslint.config.js'],

      rules: {
         // Les configuration webpack / eslint ont besoin des extensions de fichiers
         'import/extensions': ['warn', 'ignorePackages'],
         // Cette règle ne supporte pas les modules.exports, donc ne fonctionne pas bien avec certains plugins webpack
         'import/default': 'off',
      },
   },
   {
      files: ['**/*.spec.ts', 'src/app/spec-helpers/**/*.ts'],
      ...pluginJest.configs['flat/recommended'],
      ...pluginJest.configs['flat/style'],
      rules: {
         ...pluginJest.configs['flat/recommended'].rules,
         ...pluginJest.configs['flat/style'].rules,
         '@typescript-eslint/no-explicit-any': 'off', // NOTE: On enlève cette règle dans les tests pour faciliter le typing de `wrapper.vm`
         '@typescript-eslint/no-require-imports': 'off', // NOTE: On enlève cette règle pour faciliter les mocks via Jest
      },
   },
]);
