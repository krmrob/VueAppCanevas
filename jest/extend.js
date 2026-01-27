import { expect } from '@jest/globals';

// Ajoute la fonction toHaveNeverBeenCalled qui permet de mettre un message custom dans le cas où le spy a été appelé.
expect.extend({
   toHaveNeverBeenCalled(received, failMessageFct) {
      const pass = received.mock.calls.length === 0;
      const message = pass ? () => '' : failMessageFct;

      return {
         pass,
         message,
      };
   },
});
