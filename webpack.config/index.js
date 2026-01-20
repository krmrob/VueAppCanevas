import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from '@dotenvx/dotenvx';

import playgroundConfig from './playground.config.js';
import widgetConfig from './widget.config.js';

dotenv.config();

export default (_env, argv) => {
   const mode = argv.mode === 'production' ? 'production' : 'development';
   const filename = fileURLToPath(import.meta.url);
   const dirname = path.dirname(filename);
   const projectRoot = path.join(dirname, '..');

   const widget = widgetConfig({ mode, projectRoot, dirname });
   const playground = playgroundConfig({ projectRoot, argv });

   return [widget, playground];
};
