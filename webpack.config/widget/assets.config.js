// @eslint-disable-next-line import/default
import { readdirSync } from 'node:fs';

import CopyPlugin from 'copy-webpack-plugin';

export default ({ assetsPath }) => {
   if (isDirectoryEmpty(assetsPath)) return {};

   return {
      plugins: [
         new CopyPlugin({
            patterns: [assetsPath],
         }),
      ],
   };
};

function isDirectoryEmpty(path) {
   try {
      const entries = readdirSync(path);
      return entries.length === 0;
      // eslint-disable-next-line no-restricted-syntax
   } catch {
      return false;
   }
}
