<!-- src/app/modules/absences/components/AbsenceFilter.vue -->

<script setup lang="ts">
import { ref } from 'vue';
import type { AbsenceState } from '../types/absence';

// Props : reçoit les filtres actuels
const props = defineProps<{
  modelValue?: {
    startDate?: string;
    endDate?: string;
    states?: AbsenceState[];
    reasons?: string[];
    createdBy?: string;
  };
}>();

// Émets les événements de mise à jour
const emit = defineEmits<{
  'update:modelValue': [value: any];
  'filter': [value: any];
}>();

// État local des filtres
const filters = ref({
  startDate: props.modelValue?.startDate || '',
  endDate: props.modelValue?.endDate || '',
  states: props.modelValue?.states || [],
  reasons: props.modelValue?.reasons || [],
  createdBy: props.modelValue?.createdBy || '',
});

// Options pour les listes déroulantes
const stateOptions: Array<{ value: AbsenceState; title: string }> = [
  { value: 'brouillon', title: 'Brouillon' },
  { value: 'soumise', title: 'Soumise' },
  { value: 'en_attente_approbation', title: 'En attente' },
  { value: 'modifiee', title: 'Modifiée' },
  { value: 'traitee', title: 'Traitée' },
  { value: 'en_attente_piece', title: 'Pièce manquante' },
  { value: 'annulee', title: 'Annulée' },
  { value: 'refusee', title: 'Refusée' },
];

const reasonOptions = [
  { value: 'maladie', title: 'Maladie' },
  { value: 'vacances', title: 'Vacances' },
  { value: 'force_majeure', title: 'Force majeure' },
  { value: 'affaires_personnelles', title: 'Affaires personnelles' },
  { value: 'responsabilite_parentale', title: 'Responsabilité parentale' },
  { value: 'retour_progressif', title: 'Retour progressif' },
  { value: 'conge_sans_solde', title: 'Congé sans solde' },
  { value: 'greve', title: 'Grève' },
  { value: 'retraite_progressive', title: 'Retraite progressive' },
  { value: 'temps_compense', title: 'Temps compensé' },
  { value: 'absence_autorisee_payee', title: 'Absence autorisée payée' },
  { value: 'deces_famille', title: 'Décès famille' },
  { value: 'demenagement', title: 'Déménagement' },
];

// Applique les filtres
const applyFilters = () => {
  emit('update:modelValue', filters.value);
  emit('filter', filters.value);
};

// Réinitialise les filtres
const resetFilters = () => {
  filters.value = {
    startDate: '',
    endDate: '',
    states: [],
    reasons: [],
    createdBy: '',
  };
  applyFilters();
};
</script>

<template>
  <v-card class="mb-4" variant="outlined">
    <v-card-title class="d-flex align-center">
      <v-icon icon="$filter" class="mr-2" />
      Filtres
    </v-card-title>
    
    <v-card-text>
      <div class="d-flex flex-wrap align-center gap-4">
        <!-- Période : De -->
        <div style="min-width: 180px;">
          <v-text-field
            v-model="filters.startDate"
            label="De"
            type="date"
            density="compact"
            variant="outlined"
            hide-details
            clearable
          />
        </div>
        
        <!-- Période : À -->
        <div style="min-width: 180px;">
          <v-text-field
            v-model="filters.endDate"
            label="À"
            type="date"
            density="compact"
            variant="outlined"
            hide-details
            clearable
          />
        </div>
        
        <!-- État (multi-sélection) -->
        <div style="min-width: 220px;">
          <v-select
            v-model="filters.states"
            :items="stateOptions"
            label="État"
            density="compact"
            variant="outlined"
            hide-details
            multiple
            clearable
            chips
          />
        </div>
        
        <!-- Motif (multi-sélection) -->
        <div style="min-width: 220px;">
          <v-select
            v-model="filters.reasons"
            :items="reasonOptions"
            label="Motif"
            density="compact"
            variant="outlined"
            hide-details
            multiple
            clearable
            chips
          />
        </div>
        
        <!-- Initié par (recherche texte) -->
        <div style="min-width: 200px;">
          <v-text-field
            v-model="filters.createdBy"
            label="Initié par"
            density="compact"
            variant="outlined"
            hide-details
            clearable
          />
        </div>
        
        <!-- Boutons d'action -->
        <div class="d-flex gap-2">
          <v-btn
            color="primary"
            @click="applyFilters"
            prepend-icon="$search"
            size="small"
          >
            Appliquer
          </v-btn>
          
          <v-btn
            variant="outlined"
            @click="resetFilters"
            prepend-icon="$close"
            size="small"
          >
            Réinitialiser
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Style pour les chips dans les selects multiples */
:deep(.v-chip) {
  margin: 2px;
}

/* Responsive */
@media (max-width: 1200px) {
  .d-flex {
    flex-direction: column;
    align-items: stretch !important;
  }
  
  div {
    min-width: 100% !important;
  }
}
</style>