import type { App } from 'vue';

export default (vueApp: App) => {
   const callbacks: Array<(error: unknown, message: string | null | undefined) => void> = [];

   const registerOnError = (callback: (error: unknown, message: string | null | undefined) => void) => {
      callbacks.push(callback);
   };

   const onError = (error: unknown, message: string | null | undefined) => {
      for (const cb of callbacks) {
         cb(error, message);
      }
   };

   vueApp.config.errorHandler = (error, component, vueInfo) => {
      onError(error, vueInfo);
   };

   vueApp.onUnmount(() => {
      callbacks.splice(0);
   });

   return {
      registerOnError,
      onError,
   };
};
