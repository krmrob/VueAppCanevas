import { getAppSettings } from '@/core/appSettings';

export async function getAccessTokenAsync() {
   const { accessTokenGetter } = getAppSettings();
   return await accessTokenGetter();
}
