(() => {
   const myCustomElem = document.getElementById('myCustomElem');

   const logger = (e) => {
      window.logToScreen(e.error, 'Erreur trappée par le composant vanille');
   };

   // Fixer le accesTokenGetter et le handler pour les erreurs
   // On va le faire dans une couple de secondes pour tester que ce sera réactif
   setTimeout(() => {
      myCustomElem.accessTokenGetter = () => window.authService.getAccessTokenAsync();

      myCustomElem.addEventListener('error', logger);
   }, 1500);

   // Tenir à jour la propriété displayedText.
   const displayedTextInput = document.getElementById('displayedText');
   myCustomElem.displayedText = displayedTextInput.value;
   displayedTextInput.addEventListener('input', () => {
      myCustomElem.displayedText = displayedTextInput.value;
   });

   // Réagir au changement de langue
   const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
         if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
            myCustomElem.langue = document.documentElement.lang;
         }
      }
   });
   observer.observe(document.documentElement, { attributes: true, childList: false, subtree: false });
})();
