import { getAppSettings } from '@/core/appSettings';

export const logError = (error: unknown, message: string | null | undefined) => {
   const { errorHandler } = getAppSettings();
   errorHandler(error, message);
};
