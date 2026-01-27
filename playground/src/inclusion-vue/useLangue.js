import { ref, onUnmounted } from 'vue';

export default () => {
   const langue = ref(document.documentElement.lang);

   const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
         if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
            langue.value = document.documentElement.lang;
         }
      }
   });
   observer.observe(document.documentElement, { attributes: true, childList: false, subtree: false });

   onUnmounted(() => {
      observer.disconnect();
   });

   return {
      langue,
   };
};
