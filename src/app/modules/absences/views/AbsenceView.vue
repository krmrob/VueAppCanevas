<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'

// Données métier (ABSENCE)
const absences = [
  { id: 1, employe: 'Karim', type: 'Maladie', jours: 3 },
  { id: 2, employe: 'Nadia', type: 'Vacances', jours: 5 }
]

// Colonnes métier
const columns = [
  { key: 'employe', label: 'Employé' },
  { key: 'type', label: 'Type d’absence' },
  { key: 'jours', label: 'Jours' }
]

// Réaction au clic
function openAbsence(row: any) {
  alert('Ouverture de : ' + row.employe)
}
</script>

<template>
  <h2>Suivi des absences</h2>

  <DataTable
    :rows="absences"
    :columns="columns"
    @row-click="openAbsence"
  />
</template>
