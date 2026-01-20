/* eslint-disable promise/catch-or-return */
import { flushPromises } from '@vue/test-utils';
import { nextTick, ref } from 'vue';

import { awaitReady } from './awaitReady';

describe('awaitReady', () => {
   it('valeur passe de false à true - promesse résolue lorsque true', async () => {
      const control = ref(false);

      const checkFunction = () => control.value;

      let resolved = false;
      awaitReady(checkFunction).then(() => (resolved = true));

      await nextTick();
      expect(resolved).toBe(false);

      control.value = true;
      await nextTick();

      expect(resolved).toBe(true);

      await flushPromises();
   });

   it('valeur true au dépat - promesse résolue immédiatement', async () => {
      const control = ref(true);

      const checkFunction = () => control.value;

      let resolved = false;
      awaitReady(checkFunction).then(() => (resolved = true));
      await flushPromises();

      expect(resolved).toBe(true);
   });
});
