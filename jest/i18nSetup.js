import { config } from '@vue/test-utils';

// Mock pour l'utilisation de $t et $tc dans les templates.
config.global.mocks.$t = (key) => key;
config.global.mocks.$tc = (key) => key;
