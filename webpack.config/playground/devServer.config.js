/* global process */

export default ({ playgroundPath, argv }) => {
   // Le port sur lequel on pourra consulter le playground (https://localhost:7777)
   // C'est un défaut qui en vaut un autre, au besoin on peut utiliser un autre port
   // avec `npm run playground -- --port <mon-port-préféré>`.
   const port = process.env.SERVER_PORT || argv.port || 7777;

   // Le host peut aussi être passé sur la ligne
   // npm run playground -- --host 'monhostcustom.local'
   // Cependant pour que le proxy fonctionne le target doit correspondre
   const host = process.env.SERVER_HOST || argv.host || 'localhost';

   return {
      devServer: {
         allowedHosts: 'all',
         static: {
            directory: playgroundPath,
            watch: true,
         },
         client: {
            overlay: false,
         },
         port,
         host,
         server: 'https',

         // NOTE: Nous devons enlever le _hot reload_ qui, de toute façon, ne fonctionnait
         //       pas parfaitement avec la stack afin de faire fonctionner l’importation du
         //       Web worker en blob.
         hot: false,

         proxy: [
            {
               // On sert l'output de webpack du component à partir de '/lib'.
               context: '/lib',
               target: `https://${host}:${port}`,
               pathRewrite: {
                  '^/lib': '',
               },
               // Nécessaire pour que le proxy fonctionne avec le certificat invalide
               // Voir https://webpack.js.org/configuration/dev-server/#devserverproxy
               secure: false,
            },
            {
               // On sert l'output de webpack du playground à partir de '/playground-dist'.
               context: '/playground-dist',
               target: `https://${host}:${port}`,
               pathRewrite: {
                  '^/playground-dist': '',
               },
               // Nécessaire pour que le proxy fonctionne avec le certificat invalide
               // Voir https://webpack.js.org/configuration/dev-server/#devserverproxy
               secure: false,
            },
         ],
      },
   };
};
