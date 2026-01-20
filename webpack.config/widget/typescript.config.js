export default () => {
   return {
      module: {
         rules: [
            {
               test: /\.ts$/,
               exclude: /node_modules/,
               use: [
                  {
                     loader: 'babel-loader',
                  },
                  {
                     loader: 'ts-loader',
                     options: {
                        transpileOnly: true,
                        configFile: 'tsconfig.build.json',
                        appendTsSuffixTo: [/\.vue$/],
                     },
                  },
               ],
            },
         ],
      },
   };
};
