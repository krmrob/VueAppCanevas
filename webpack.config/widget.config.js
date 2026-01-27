import path from 'path';

import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { merge } from 'webpack-merge';

import vueConfig from './shared/vue.config.js';
import assetsConfig from './widget/assets.config.js';
import cssConfig from './widget/css.config.js';
import jsonConfig from './widget/json.config.js';
import typescriptConfig from './widget/typescript.config.js';
import vuetifyConfig from './widget/vuetify.config.js';

export default ({ projectRoot, dirname, mode }) => {
   const assetsPath = path.join(projectRoot, 'assets');
   const appSourcePath = path.join(projectRoot, 'src/app');
   const entryPointPath = path.join(projectRoot, 'src/entry');
   const outputPath = path.join(projectRoot, 'dist');
   const isProduction = mode === 'production';

   return merge(
      {
         mode,
         entry: {
            main: path.join(entryPointPath, 'customElement.ts'),
         },
         output: {
            path: outputPath,
            filename: '[name].js',
            chunkFilename: '[name].[contenthash].js',
            clean: true,
         },
         plugins: [new CaseSensitivePathsPlugin({ debug: false })],
         resolve: {
            extensions: ['.js', '.ts'],
            alias: {
               '@': appSourcePath,
               '@entry': entryPointPath,
            },
         },
      },
      assetsConfig({ assetsPath }),
      cssConfig({ dirname, outputFileName: 'styles' }),
      devToolConfig({ isProduction }),
      jsonConfig(),
      typescriptConfig({ dirname }),
      vueConfig({ include: [appSourcePath, entryPointPath] }),
      vuetifyConfig({ appSourcePath }),
   );
};

function devToolConfig({ isProduction }) {
   return isProduction ? {} : { devtool: 'inline-source-map' };
}
