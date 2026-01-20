<template>
  <div class="absence-list">
    <!-- En-tête avec pagination -->
    <div class="d-flex align-center justify-space-between mb-4 flex-wrap">
      <div>
        <h2 class="text-h5">Suivi des demandes d'absence</h2>
        <div class="text-caption text-medium-emphasis">
          {{ totalItems }} demande(s) trouvée(s)
        </div>
      </div>
      
      <div class="d-flex align-center gap-2">
        <!-- Sélecteur d'éléments par page -->
        <div class="d-flex align-center">
          <span class="mr-2 text-caption">Par page:</span>
          <v-select
            v-model="itemsPerPage"
            :items="paginationOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="width: 80px"
            @update:model-value="onItemsPerPageChange"
          />
        </div>
        
        <!-- Bouton Actualiser -->
        <v-btn
            color="primary"
            @click="refresh"
            :loading="loading"
            prepend-icon="$refresh"
            size="small"
        >
          Actualiser
        </v-btn>
      </div>
    </div>

    <AbsenceFilters 
      v-model="currentFilters"
      @filter="onFilterChange"
    />

    <!-- État de chargement -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
      <div class="mt-4">Chargement des demandes...</div>
    </div>

    <!-- Erreur -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ error }}
      <template #append>
        <v-btn
          variant="text"
          @click="refresh"
          size="small"
        >
          Réessayer
        </v-btn>
      </template>
    </v-alert>

    <!-- Tableau des demandes -->
    <v-card v-else>
      <v-table density="comfortable" hover>
        <thead>
          <tr>
            <th scope="col" class="text-left">
              <v-btn
                variant="text"
                @click="toggleSort('startDate')"
                class="px-0 d-flex align-center"
              >
                Date d'absence
                <span class="ml-1" style="font-size: 1.2em">{{ getSortIcon('startDate') }}</span>
              </v-btn>
            </th>
            <th scope="col" class="text-left">
              <v-btn
                variant="text"
                @click="toggleSort('createdBy')"
                class="px-0"
              >
                Initié par
                <span class="ml-1" style="font-size: 1.2em">{{ getSortIcon('createdBy') }}</span>
              </v-btn>
            </th>
            <th scope="col" class="text-left">
              <v-btn
                variant="text"
                @click="toggleSort('jobLabel')"
                class="px-0"
              >
                Emploi
                <span class="ml-1" style="font-size: 1.2em">{{ getSortIcon('jobLabel') }}</span>
              </v-btn>
            </th>
            <th scope="col" class="text-left">
              <v-btn
                variant="text"
                @click="toggleSort('reasonLabel')"
                class="px-0"
              >
                Motif
                <span class="ml-1" style="font-size: 1.2em">{{ getSortIcon('reasonLabel') }}</span>
              </v-btn>
            </th>
            <th scope="col" class="text-left">
              <v-btn
                variant="text"
                @click="toggleSort('state')"
                class="px-0"
              >
                État
                <span class="ml-1" style="font-size: 1.2em">{{ getSortIcon('state') }}</span>
              </v-btn>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="demand in demands" :key="demand.id">
            <td>
              <div class="font-weight-medium">{{ formatDate(demand.startDate) }}</div>
              <div class="text-caption text-medium-emphasis">
                au {{ formatDate(demand.endDate) }}
              </div>
            </td>
            <td>{{ demand.createdBy }}</td>
            <td>{{ demand.jobLabel || demand.jobCode }}</td>
            <td>{{ demand.reasonLabel || demand.reasonCode }}</td>
            <td>
              <v-chip
                :color="getStateColor(demand.state)"
                variant="tonal"
                size="small"
              >
                {{ formatState(demand.state) }}
              </v-chip>
            </td>
          </tr>
          
          <!-- Message si vide -->
          <tr v-if="demands.length === 0">
            <td colspan="5" class="text-center py-8 text-medium-emphasis">
              Aucune demande d'absence trouvée
            </td>
          </tr>
        </tbody>
      </v-table>
      
      <!-- Pagination -->
      <v-card-actions class="d-flex justify-space-between align-center pa-4">
        <div class="text-caption text-medium-emphasis">
          Page {{ page }} sur {{ totalPages }} 
          • {{ demands.length }} élément(s) affiché(s)
        </div>
        
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="5"
          rounded
          @update:model-value="onPageChange"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { AbsenceDemand, AbsenceFilter } from '../types/absence';
import { absenceService } from '../services/absenceService';
import AbsenceFilters from './AbsenceFilter.vue';

// État réactif
const demands = ref<AbsenceDemand[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Pagination
const page = ref(1);
const itemsPerPage = ref(5); // 5 par page pour tester
const totalItems = ref(0);
const totalPages = ref(0);

// Tri
const sortBy = ref<string>('startDate');
const sortOrder = ref<'asc' | 'desc'>('desc'); // Plus récent d'abord

const currentFilters = ref<AbsenceFilter>({});

// Options de pagination pour Vuetify
const paginationOptions = [
  { value: 5, title: '5' },
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 50, title: '50' },
];

// Fonction pour charger les demandes avec pagination et tri
const loadDemands = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const result = await absenceService.getDemands(
      currentFilters.value, // Filtres vides pour l'instant
      {
        page: page.value,
        itemsPerPage: itemsPerPage.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
      }
    );
    
    demands.value = result.items;
    totalItems.value = result.total;
    totalPages.value = result.totalPages;
  } catch (err) {
    error.value = 'Erreur lors du chargement des demandes';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Charge les données au montage
onMounted(() => {
  loadDemands();
});

// Rafraîchir
const refresh = () => {
  loadDemands();
};

// Gestion des changements de filtres
const onFilterChange = (newFilters: AbsenceFilter) => {
  currentFilters.value = newFilters;
  page.value = 1; // Retour à la première page
  loadDemands();
};

// Gestion du tri
const toggleSort = (column: string) => {
  if (sortBy.value === column) {
    // Inverser l'ordre si même colonne
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Nouvelle colonne, ordre ascendant par défaut
    sortBy.value = column;
    sortOrder.value = 'asc';
  }
  
  // Recharger les données
  loadDemands();
};

// Gestion du changement de page
const onPageChange = (newPage: number) => {
  page.value = newPage;
  loadDemands();
};

// Gestion du changement d'éléments par page
const onItemsPerPageChange = (newValue: number) => {
  itemsPerPage.value = newValue;
  page.value = 1; // Retour à la première page
  loadDemands();
};

// Helper pour formater les dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-CA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Helper pour formater l'état
const formatState = (state: string) => {
  const statesMap: Record<string, string> = {
    'brouillon': 'Brouillon',
    'soumise': 'Soumise',
    'en_attente_approbation': 'En attente',
    'modifiee': 'Modifiée',
    'traitee': 'Traitée',
    'en_attente_piece': 'Pièce manquante',
    'annulee': 'Annulée',
    'refusee': 'Refusée'
  };
  return statesMap[state] || state;
};

// Helper pour la couleur de l'état
const getStateColor = (state: string) => {
  const colors: Record<string, string> = {
    'brouillon': 'secondary',
    'soumise': 'info',
    'en_attente_approbation': 'warning',
    'modifiee': 'primary',
    'traitee': 'success',
    'en_attente_piece': 'warning',
    'annulee': 'grey',
    'refusee': 'error'
  };
  return colors[state] || 'grey';
};

// Icône de tri - utilise du texte au lieu d'icônes MDI
const getSortIcon = (column: string) => {
  if (sortBy.value !== column) return '';
  return sortOrder.value === 'asc' ? '↑' : '↓';
};
</script>



<style scoped>
.absence-list {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Animation pour le rafraîchissement */
.v-btn {
  transition: all 0.3s ease;
}

/* Espacement dans le tableau */
.v-table {
  border-radius: 8px;
  overflow: hidden;
}

.v-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

/* Responsive */
@media (max-width: 960px) {
  .absence-list {
    padding: 8px;
  }
  
  .v-table {
    font-size: 0.9em;
  }
}
</style>