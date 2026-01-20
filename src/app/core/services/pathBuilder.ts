import { getAppSettings } from '@/core/appSettings';

export default (uri: string) => {
   const {
      pathConfiguration: { basePath, queryString },
   } = getAppSettings();

   if (uri.startsWith('/')) {
      uri = uri.substring(1);
   }

   return `${basePath}${uri}${queryString ?? ''}`;
};
