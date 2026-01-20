<!-- src/app/App.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import AbsenceList from '@/modules/absences/components/AbsenceList.vue';

const { displayedText = '' } = defineProps<{
  displayedText?: string;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="app-container">
    <!-- En-tête démo (comme dans l'original) -->
    <div v-if="displayedText" class="demo-hello">
      {{ t('demo.texte-affiche') }} : {{ displayedText }}
    </div>
    
    <!-- Notre composant d'absences -->
    <AbsenceList />
  </div>
</template>

<style scoped>
.app-container {
  padding: 20px;
  height: 100%;
  width: 100%;
}

.demo-hello {
  color: rgb(18, 22, 236);
  background-color: rgb(124, 126, 129);
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
}
</style>