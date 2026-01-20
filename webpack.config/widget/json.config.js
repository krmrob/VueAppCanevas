export default () => {
   return {
      module: {
         rules: [
            {
               test: /\.json5$/,
               use: [{ loader: 'json5-loader' }],
            },
         ],
      },
   };
};
