<template>
  <table border="1">
    <thead>
      <tr>
        <!-- Affiche les titres de colonnes -->
        <th v-for="col in columns" :key="col.key">
          {{ col.label }}
        </th>
      </tr>
    </thead>

    <tbody>
      <!-- Affiche chaque ligne -->
      <tr v-for="row in rows" :key="row.id" @click="onRowClick(row)">
        <td v-for="col in columns" :key="col.key">
          {{ row[col.key] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
// Le widget reçoit des données génériques
defineProps<{
  rows: any[]
  columns: { key: string; label: string }[]
}>()

// Le widget envoie un message quand on clique
const emit = defineEmits(['row-click'])

function onRowClick(row: any) {
  emit('row-click', row)
}
</script>
