import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default ({ outputFileName }) => {
   return {
      optimization: {
         splitChunks: {
            cacheGroups: {
               // NOTE: Permet d’avoir un seul fichier d’output
               styles: {
                  name: outputFileName,
                  type: 'css/mini-extract',
                  chunks: 'all',
                  enforce: true,
               },
            },
         },
      },
      plugins: [
         // "runtime: false" évite d'injecter automatiquement le fichier css.
         // Il sera géré manuellement.
         new MiniCssExtractPlugin({ runtime: false, ignoreOrder: true }),
      ],
      module: {
         rules: [
            {
               test: /\.(scss|css|sass)$/,
               use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  {
                     loader: 'sass-loader',
                     options: {
                        sassOptions: {
                           quietDeps: true,
                        },
                     },
                  },
               ],
            },
         ],
      },
   };
};
