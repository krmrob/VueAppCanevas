import { buildDefaultAppSettings } from 'test-utils/appSettings';

import { configure } from '@/core/appSettings';
import type { PathBuilderConfiguration } from '@/core/appSettings';
import pathBuilder from '@/core/services/pathBuilder';

const configureAppSettings = ({ basePath, queryString }: PathBuilderConfiguration) => {
   configure({
      ...buildDefaultAppSettings(),
      pathConfiguration: {
         basePath,
         queryString,
      },
   });
};

it('basePath fini par / et uri commence par / - Path correctement construit', () => {
   const basePath = 'https://grics.ca/toto/';
   const queryString = '?x=1';
   const uri = '/a/b/c.html';

   configureAppSettings({ basePath, queryString });

   const path = pathBuilder(uri);

   expect(path).toBe('https://grics.ca/toto/a/b/c.html?x=1');
});

it('basePath ne fini par par / et uri commence par / - Path correctement construit', () => {
   const basePath = 'https://grics.ca/toto';
   const queryString = '?x=1';
   const uri = '/a/b/c.html';

   configureAppSettings({ basePath, queryString });

   const path = pathBuilder(uri);

   expect(path).toBe('https://grics.ca/toto/a/b/c.html?x=1');
});

it('basePath ne fini par par / et uri ne commence pas par / - Path correctement construit', () => {
   const basePath = 'https://grics.ca/toto';
   const queryString = '?x=1';
   const uri = 'a/b/c.html';

   configureAppSettings({ basePath, queryString });

   const path = pathBuilder(uri);

   expect(path).toBe('https://grics.ca/toto/a/b/c.html?x=1');
});

it.each([null, ''])('Pas de queryString - Path correctement construit', (queryString) => {
   const basePath = 'https://grics.ca/toto';
   const uri = 'a/b/c.html';

   configureAppSettings({ basePath, queryString });

   const path = pathBuilder(uri);

   expect(path).toBe('https://grics.ca/toto/a/b/c.html');
});
