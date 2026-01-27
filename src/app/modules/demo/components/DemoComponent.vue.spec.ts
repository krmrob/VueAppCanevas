import { mountComponent } from 'test-utils/component';

import DemoComponent from './DemoComponent.vue';

jest.mock('@/core/services/authentification', () => ({
   getAccessTokenAsync: () => Promise.resolve(),
}));

describe('onOpen', () => {
   it('ouverture du dialogue - émet un événement', async () => {
      await mountComponent(DemoComponent, { shallow: false }, async ({ wrapper }) => {
         const openButton = wrapper.find('#openButton');
         openButton.trigger('click');
         await wrapper.vm.$nextTick();

         const emmittedEvent = wrapper.emitted().openDialog;
         // Un seul appel
         expect(emmittedEvent).toHaveLength(1);
         // Aucun paramètre
         expect(emmittedEvent[0]).toHaveLength(0);
      });
   });

   it("Pas d'ouverture du dialogue - n'émet pas d'événement", async () => {
      await mountComponent(DemoComponent, { shallow: false }, async ({ wrapper }) => {
         await wrapper.vm.$nextTick();

         const emmittedEvent = wrapper.emitted().openDialog;
         // Aucun appel
         expect(emmittedEvent).toBeUndefined();
      });
   });
});
