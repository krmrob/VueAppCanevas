/* c8 ignore start */
import { createApp, reactive, toRefs, h } from 'vue';

import App from '@/App.vue';
import type {
   AppConfiguration,
   AuthentificationConfiguration,
   LangueConfiguration,
   ComponentProperties,
} from '@/bootstrap/appConfiguration';
import { defaults } from '@/bootstrap/appConfiguration';
import { awaitReady } from '@/bootstrap/awaitReady';
import errorHandlingSetup from '@/bootstrap/errorHandling/setup';
import i18nSetup from '@/bootstrap/i18n/setup';
import vuetifySetup from '@/bootstrap/vuetify/setup';
import type { PathBuilderConfiguration } from '@/core/appSettings';
import { configure } from '@/core/appSettings';

export const bootstrap = (targetElement: Element, pathInfo: PathBuilderConfiguration, configuration: AppConfiguration) => {
   const { props, settings, componentProps } = createReactives(configuration);

   const vueApp = createApp({
      // On utilise un component inline plutôt que App directement afin de conserver la réactivité sur les props.
      setup() {
         return () => h(App, componentProps);
      },
   });

   i18nSetup(settings, vueApp);
   vuetifySetup(vueApp);

   const { registerOnError, onError } = errorHandlingSetup(vueApp);

   (async () => {
      // On ne veut pas mounter le composant tant que le callback d'authentification n'a pas été assigné.
      await awaitReady(() => !!settings.accessTokenGetter);

      configure({
         accessTokenGetter: settings.accessTokenGetter!,
         errorHandler: onError,
         pathConfiguration: pathInfo,
      });

      vueApp.mount(targetElement);
   })();

   const unmount = () => {
      vueApp.unmount();
   };

   return { props, unmount, registerOnError };
};

function createReactives(configuration: AppConfiguration) {
   const props = reactive({
      ...defaults,
      ...configuration,
      displayedText: configuration.displayedText ?? '',
   });
   const { accessTokenGetter, langue, displayedText } = toRefs(props);

   const componentProps: ComponentProperties = reactive({
      displayedText,
   });
   const settings: LangueConfiguration & AuthentificationConfiguration = reactive({
      accessTokenGetter,
      langue,
   });

   return {
      props, // Pour retourner au custom element, afin de réagir aux modifications d'attributs.
      settings, // Pour envoyer dans le singleton de configuration
      componentProps, // Les props à passer au component
   };
}
