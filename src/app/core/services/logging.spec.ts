import { buildDefaultAppSettings } from 'test-utils/appSettings';

import { configure } from '@/core/appSettings';

import { logError } from './logging';

it('logError passe ses paramètres à la fonction qui a été configurée', () => {
   const onError = jest.fn();

   configure({
      ...buildDefaultAppSettings(),
      errorHandler: onError,
   });

   logError('erreur', 'message');

   expect(onError).toHaveBeenCalledTimes(1);
   expect(onError).toHaveBeenCalledWith('erreur', 'message');
});
