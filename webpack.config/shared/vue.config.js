import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';

export default ({ include }) => {
   return {
      plugins: [
         new VueLoaderPlugin(),
         new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: 'false',
            __VUE_PROD_DEVTOOLS__: 'false',
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
         }),
      ],
      module: {
         rules: [
            {
               test: /\.vue$/,
               loader: 'vue-loader',
               include,
               options: {
                  prettify: false,
                  transformAssetUrls: {
                     video: 'src',
                     source: 'src',
                     img: 'src',
                     image: 'xlink:href',
                  },
                  compilerOptions: {
                     whitespace: 'preserve',
                     isCustomElement: (tag) => tag.startsWith('mozaik-'),
                  },
               },
            },
         ],
      },
   };
};
