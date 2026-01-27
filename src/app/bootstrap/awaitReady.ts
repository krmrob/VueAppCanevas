import { watch, nextTick } from 'vue';

export const awaitReady = (checkFunction: () => boolean) => {
   let resolveReady: () => void;
   const promise = new Promise<void>((resolve) => {
      resolveReady = resolve;
   });

   let ready = false;
   const unwatch = watch(
      checkFunction,
      (newValue) => {
         // On considère que c'est prêt quand newValue est truthy.
         if (newValue && !ready) {
            ready = true;

            // Si la job se fait au premier appel (au immediate), unwatch n'est pas encore initialisé, d'où le nextTick.
            nextTick(() => unwatch());
            resolveReady();
         }
      },
      { immediate: true },
   );

   return promise;
};
