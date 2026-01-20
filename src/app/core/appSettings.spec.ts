import { buildDefaultAppSettings } from 'test-utils/appSettings';

import { configure, getAppSettings } from '@/core/appSettings';

describe('configure', () => {
   describe('accesTokenGetter', () => {
      it.each([null, undefined, 'toto'])(
         "Lève une erreur si accessTokenGetter n'est pas défini ou pas une fonction",
         (accessTokenGetter) => {
            const action = () => {
               configure({
                  ...buildDefaultAppSettings(),
                  // @ts-expect-error la valeur vient de l'extérieur on doit tester plusieurs types
                  accessTokenGetter,
               });
            };

            expect(action).toThrow(new Error('accessTokenGetter doit être une fonction'));
         },
      );

      it('configure correctement la fonction si définie', () => {
         const configuredAccessTokenGetter = () => 'my token';

         configure({
            ...buildDefaultAppSettings(),
            accessTokenGetter: configuredAccessTokenGetter,
         });

         const { accessTokenGetter } = getAppSettings();

         expect(accessTokenGetter).toBe(configuredAccessTokenGetter);
      });
   });

   describe('errorHandler', () => {
      it('configure correctement la fonction fournie', () => {
         const configuredErrorHandler = (_err: unknown, _msg: string | null | undefined) => undefined;

         configure({
            ...buildDefaultAppSettings(),
            errorHandler: configuredErrorHandler,
         });

         const { errorHandler } = getAppSettings();

         expect(errorHandler).toBe(configuredErrorHandler);
      });
   });

   describe('pathConfiguration', () => {
      it('Ajoute un / à base path au besion', () => {
         const configuredBasePath = 'some/base/path';

         configure({
            ...buildDefaultAppSettings(),
            pathConfiguration: {
               basePath: configuredBasePath,
            },
         });

         const {
            pathConfiguration: { basePath },
         } = getAppSettings();

         expect(basePath).toBe('some/base/path/');
      });

      it("N'ajoute pas de / à base path si déjà présent", () => {
         const configuredBasePath = 'some/base/path/';

         configure({
            ...buildDefaultAppSettings(),
            pathConfiguration: {
               basePath: configuredBasePath,
            },
         });

         const {
            pathConfiguration: { basePath },
         } = getAppSettings();

         expect(basePath).toBe(configuredBasePath);
      });

      it.each([null, 'query=string'])('Laisse queryString tel quel (%s)', (configuredQueryString) => {
         configure({
            ...buildDefaultAppSettings(),
            pathConfiguration: {
               basePath: 'some/base/path/',
               queryString: configuredQueryString,
            },
         });

         const {
            pathConfiguration: { queryString },
         } = getAppSettings();

         expect(queryString).toBe(configuredQueryString);
      });
   });
});
