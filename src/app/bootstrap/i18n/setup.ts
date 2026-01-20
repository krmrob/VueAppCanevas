import type { App } from 'vue';
import { watch } from 'vue';
import { createI18n } from 'vue-i18n';

import type { LangueConfiguration } from '@/bootstrap/appConfiguration';
import en from '@/lang/en.json5';
import fr from '@/lang/fr.json5';

const defaultLocale = 'fr';

export default (options: LangueConfiguration, vueApp: App) => {
   const i18n = createI18n({
      legacy: false,
      locale: options.langue ?? defaultLocale,
      fallbackLocale: defaultLocale,
      messages: {
         fr,
         en,
      },
   });

   watch(
      () => options.langue,
      (newLocale) => {
         i18n.global.locale.value = newLocale ?? defaultLocale;
      },
   );

   vueApp.use(i18n);
};
