/* eslint-disable no-console */
import { jest, expect, afterEach, beforeEach } from '@jest/globals';

// Ici on veut s'assurer que le code ne génère pas de warn ou error dans la console.
// Ça permet de trapper en test unitaires certains warning levés par vue (les [Vue warn]).

const prohibitedConsoleFunctions = ['warn', 'error'];

beforeEach(() => {
   prohibitedConsoleFunctions.forEach((f) => {
      jest.spyOn(console, f).mockImplementation(() => {
         console.log(`appel prohibé à ${f}`);
      });
   });
});

afterEach(() => {
   prohibitedConsoleFunctions.forEach((f) => {
      const fn = console[f];
      expect(fn).toHaveNeverBeenCalled(() => {
         // Forge le message pour indiquer le nombre d'appels et les paramètres afin d'indiquer
         // le plus précisément possible d'où le console.[warn|error] provient.
         const calls = fn.mock.calls;
         const msg = `La fonction console.${f} a été appelée ${calls.length} fois pendant le test :`;
         const detail = calls.map((call, index) => {
            return `Paramètres de l'appel ${index + 1} :\r\n${call.join(', ')}\r\n\r\n`;
         });

         return `${msg}\r\n${detail.join('')}`;
      });
   });
});
