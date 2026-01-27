<script setup lang="ts">
   /* c8 ignore start [C'est une démo on n'a pas besoin de tout tester] */
   import { ref } from 'vue';
   import { useI18n } from 'vue-i18n';

   import { getAccessTokenAsync } from '@/core/services/authentification';
   import { logError } from '@/core/services/logging';

   const { t } = useI18n();

   const emit = defineEmits(['openDialog']);

   const token = ref('');
   const onOpen = async () => {
      // Permet simplement de démontrer comment accéder au access token.
      token.value = await getAccessTokenAsync();
      emit('openDialog');
   };

   const testLogger = () => {
      try {
         throw new Error('boom!');
      } catch (error) {
         // Le deuxième paramètre pourra permettre de savoir d'où vient l'erreur plus précisément quand on va consulter les logs.
         logError(error, 'DemoComponent.vue - testLogger');
      }
   };
</script>
<template>
   <h3>{{ t('demo.dialogue.info') }}</h3>
   <v-btn @click="testLogger">{{ t('demo.dialogue.test-error-log') }}</v-btn>
   <v-dialog max-width="500" :attach="true">
      <template v-slot:activator="{ props: activatorProps }">
         <v-btn v-bind="activatorProps" id="openButton" color="surface-variant" variant="flat" @click="onOpen">
            {{ t('demo.dialogue.ouvrir') }}
         </v-btn>
      </template>

      <template v-slot:default="{ isActive }">
         <v-card :title="t('demo.dialogue.titre')">
            <v-card-text>
               <div class="dialog-content">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.

                  {{ token }}
               </div>
            </v-card-text>

            <v-card-actions>
               <v-spacer />
               <v-btn color="primary" variant="flat" @click="isActive.value = false">
                  {{ t('demo.dialogue.fermer') }}
               </v-btn>
            </v-card-actions>
         </v-card>
      </template>
   </v-dialog>
</template>
