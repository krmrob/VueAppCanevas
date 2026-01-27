/* c8 ignore start */

import type { App } from 'vue';
import { h } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// NOTE: Nous importons le thème (override) Vuetify ainsi que l’icône de font et quelques classes de
//       base pour le :host.
import '@/assets/css/styles.scss';

// NOTE: Nous ajoutons tout de même les styles de base afin de pouvoir bénéficier des classes utilitaires.
import 'vuetify/styles';

export default (vueApp: App) => {
   const vuetify = createVuetify({
      theme: false,

      // NOTE: Pour générer le CSS contenu dans `theme.scss`, il faut utiliser cette configuration.
      //       Pour en savoir plus, consultez `docs/theme.md`.

      // import { theme } from './themes/custom';
      //
      // theme: {
      //    defaultTheme: 'Custom',
      //    themes: {
      //       Custom: theme,
      //    },
      // },

      icons: {
         defaultSet: 'icon',
         sets: {
            icon: {
               component: (props) => h(props.tag, { class: ['icon', props.icon] }),
            },
         },
      },
      components,
      directives,
   });

   vueApp.use(vuetify);
};
