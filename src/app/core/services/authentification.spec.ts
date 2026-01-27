import { buildDefaultAppSettings } from 'test-utils/appSettings';

import { configure } from '@/core/appSettings';
import { getAccessTokenAsync } from '@/core/services/authentification';

describe('Authentification', () => {
   let mockAccessTokenGetter: jest.Mock<Promise<string> | string>;

   beforeEach(() => {
      mockAccessTokenGetter = jest.fn();
      configure({
         ...buildDefaultAppSettings(),
         accessTokenGetter: mockAccessTokenGetter,
      });
   });

   describe('getAccessTokenAsync', () => {
      it('getter retourne une promise - retourne le jeton configuré', async () => {
         const token = 'my token';
         mockAccessTokenGetter.mockResolvedValue(token);

         const result = await getAccessTokenAsync();

         expect(result).toBe(token);
      });

      it('getter retourne une string - retourne le jeton configuré', async () => {
         const token = 'my token';
         mockAccessTokenGetter.mockReturnValue(token);

         const result = await getAccessTokenAsync();

         expect(result).toBe(token);
      });
   });
});
