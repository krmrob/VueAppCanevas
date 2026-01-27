/* global process */
import path from 'path';

import webpack from 'webpack';
import { merge } from 'webpack-merge';

import devServerConfig from './playground/devServer.config.js';
import vueConfig from './shared/vue.config.js';

export default ({ projectRoot, argv }) => {
   const playgroundPath = path.join(projectRoot, 'playground');
   const nodeModulesPath = path.join(projectRoot, 'node_modules');
   const playgroundSourcesFolder = path.join(playgroundPath, 'src');

   const output = path.join(playgroundPath, 'playground-dist');

   return merge(
      {
         mode: 'development',
         entry: {
            connexion: path.join(playgroundSourcesFolder, 'connexion.js'),
            vueAppLoader: path.join(playgroundSourcesFolder, 'inclusion-vue/loader.js'),
         },
         output: {
            path: output,
            // NOTE: On prefixe avec `PLAYGROUND.` pour éviter des possibles conflits avec les scripts du components
            filename: 'PLAYGROUND.[name].js',
            chunkFilename: 'PLAYGROUND.[name].[contenthash].js',
            clean: true,
         },
         resolveLoader: {
            modules: [nodeModulesPath],
         },
         plugins: [
            new webpack.DefinePlugin({
               'process.playground.CLIENT_ID': envValue(process.env.PLAYGROUND_CLIENT_ID),
               'process.playground.SERVICE_AUTH_URI': envValue(process.env.PLAYGROUND_SERVICE_AUTH_URI),
               'process.playground.SCOPE': envValue(process.env.PLAYGROUND_SCOPE),
            }),
         ],
         module: {
            rules: [
               {
                  test: /\.js$/,
                  loader: 'babel-loader',
                  include: [playgroundSourcesFolder],
               },
            ],
         },
      },
      devServerConfig({ playgroundPath, argv }),
      vueConfig({ include: [playgroundPath] }),
   );
};

function envValue(val) {
   if (val) {
      return `'${val}'`;
   }

   return "''";
}
