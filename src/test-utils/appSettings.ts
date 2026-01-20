import type { AppSettings } from '@/core/appSettings';

export const buildDefaultAppSettings: () => AppSettings = () => {
   return {
      accessTokenGetter: () => '',
      errorHandler: (_error: unknown, _message: string | null | undefined) => {},
      pathConfiguration: {
         basePath: 'https://test.grics',
      },
   };
};
