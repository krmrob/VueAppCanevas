import { jest } from '@jest/globals';

jest.mock('@entry/buildFilePath', () => ({
   __esModule: true,
   default: jest.fn().mockImplementation((file) => file),
}));
