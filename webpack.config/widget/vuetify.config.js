// Référence: https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/webpack-plugin
import path from 'path';

import { VuetifyPlugin } from 'webpack-plugin-vuetify';

export default ({ appSourcePath }) => {
   const configFile = path.join(appSourcePath, 'assets/css/vuetify.scss');

   return {
      plugins: [
         new VuetifyPlugin({
            styles: {
               configFile,
            },
         }),
      ],
   };
};
