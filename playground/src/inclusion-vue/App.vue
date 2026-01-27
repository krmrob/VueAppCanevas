<script setup>
   import { ref, onUnmounted } from 'vue';

   import useLangue from './useLangue';

   const { langue } = useLangue();

   const accessTokenGetter = () => window.authService.getAccessTokenAsync();

   const onError = (e) => {
      window.logToScreen(e.error, 'Erreur trappée par le composant vue');
   };

   const displayedText = ref('');
   const setDisplayedText = (e) => {
      displayedText.value = e.target.value;
   };
   const displayedTextInput = document.getElementById('displayedText');
   displayedTextInput.addEventListener('input', setDisplayedText);
   onUnmounted(() => {
      displayedTextInput.removeEventListener('input', setDisplayedText);
   });
</script>
<template>
   <!--
      Le .camel est important parce que accessTokenGetter
      est une propriété sans attribut correspondant, et vue ne l'assigne pas si elle
      n'est pas en camelCase.

      Le .prop indique à vue qu'il faut forcer le passage par la propriété.
      Normalement ce n'est pas nécessaire parce que vue vérifie l'existance de la propriété avec l'opérateur `in`.
      Par contre ça s'avére nécessaire si le script du custom element n'est pas disponible immédiatement (tel que dans le playground).
      Dans ce cas l'opérateur `in` n'indique pas la présence de la propriété puisque la définition de l'élément n'existe pas encore.
   -->
   <mozaik-custom-element
      :langue="langue"
      :access-token-getter.camel.prop="accessTokenGetter"
      :displayed-text="displayedText"
      @error="onError"
   >
      loading...
   </mozaik-custom-element>
</template>
