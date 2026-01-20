export default {
   clearMocks: true,
   restoreMocks: true,
   testEnvironment: 'jsdom',
   testEnvironmentOptions: {
      customExportConditions: ['node', 'node-addons'],
   },

   testMatch: ['**/?(*.)+(spec.(js|ts))?'],

   moduleFileExtensions: ['js', 'ts', 'vue'],
   transform: {
      '^.+\\.vue$': '@vue/vue3-jest',
      '^.+\\.json5?$': 'json5-jest',
      '^.+\\.(js|jsx|mjs|ts)$': 'babel-jest',
   },
   // Par défaut tout node_module est ignoré par babel-jest. Vuetify _doit_ être transformé, on indique donc ici d'ignorer tout sauf vuetify.
   transformIgnorePatterns: ['/node_modules/(?!(vuetify)/)'],

   moduleNameMapper: {
      '\\.(css|less|scss)$': '<rootDir>/jest/css.js', // Pour les css
      '^@entry/(.*)$': '<rootDir>/src/entry/$1', // Entry
      '^test-utils/(.*)$': '<rootDir>/src/test-utils/$1', // tests utils
      '^@/(.*)$': '<rootDir>/src/app/$1', // catch all
   },

   setupFilesAfterEnv: ['./jest/extend.js', './jest/consoleSetup.js', './jest/globalMocks.js', './jest/vuetify.js'],

   // « default » génère test-report.xml qui est utilisé par sonarqube
   // alors que jest-junit génère junit.xml qui est utilisé pour publier les résultats sur le pipeline.
   reporters: ['default', 'jest-junit'],
   collectCoverage: false, // À false par défaut, on a l'option de l'activer ou non dans le package.json.
   coverageProvider: 'v8',
   collectCoverageFrom: ['src/**/*.{js,ts,vue}'],
   coverageReporters: [
      // Le rapport html peut être consulté avec `npm run:open-report`
      'html',
      // text-summary permet d'afficher le rapport dans la console
      'text-summary',
      'cobertura',
      'lcovonly',
   ],
   coverageThreshold: {
      global: {
         branches: 100,
         functions: 100,
         lines: 100,
         statement: 100,
      },
   },
   testResultsProcessor: 'jest-sonar-reporter',
   testPathIgnorePatterns: ['/dist/', '/spec-helpers/'],
};
