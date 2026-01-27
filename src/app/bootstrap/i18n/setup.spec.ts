import type { App } from 'vue';
import { reactive, nextTick } from 'vue';
import type { I18n } from 'vue-i18n';

import type { LangueConfiguration } from '@/bootstrap/appConfiguration';

import setup from './setup';

const vueApp: Partial<App> = {
   use: jest.fn() as jest.Mock,
};

describe('setup', () => {
   it('langue initiale définie - langue utilisée', () => {
      const options: LangueConfiguration = reactive({
         langue: 'en',
      });

      let i18n = undefined;
      (vueApp.use as jest.Mock).mockImplementation((x: I18n) => {
         i18n = x;
      });

      setup(options, vueApp as App);

      expect(i18n!.global.locale.value).toBe('en');
   });

   it('langue initiale non définie - utilise la langue par défaut', () => {
      const options: LangueConfiguration = reactive({
         langue: undefined,
      });

      let i18n = undefined;
      (vueApp.use as jest.Mock).mockImplementation((x: I18n) => {
         i18n = x;
      });

      setup(options, vueApp as App);

      expect(i18n!.global.locale.value).toBe('fr');
   });

   it('langue change - la locale i18n suit', async () => {
      const options: LangueConfiguration = reactive({
         langue: 'fr',
      });

      let i18n = undefined;
      (vueApp.use as jest.Mock).mockImplementation((x: I18n) => {
         i18n = x;
      });

      setup(options, vueApp as App);

      expect(i18n!.global.locale.value).toBe('fr');

      options.langue = 'en';

      await nextTick();

      expect(i18n!.global.locale.value).toBe('en');
   });

   it('langue devient undefined - la locale i18n utilise la valeur par défaut', async () => {
      const options: LangueConfiguration = reactive({
         langue: 'en',
      });

      let i18n = undefined;
      (vueApp.use as jest.Mock).mockImplementation((x: I18n) => {
         i18n = x;
      });

      setup(options, vueApp as App);

      expect(i18n!.global.locale.value).toBe('en');

      options.langue = undefined;

      await nextTick();

      expect(i18n!.global.locale.value).toBe('fr');
   });
});
