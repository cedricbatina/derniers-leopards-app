<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Parties du projet : {{ projectSlug }}</h1>
    <div v-if="parts.length">
      <ul>
        <li v-for="part in parts" :key="part.slug">
          <router-link :to="`/projects/${projectSlug}/parts/${part.slug}`">
            {{ part.title }}
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      Aucune partie trouvée.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const parts = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/parts`)
    if (res.ok) {
      parts.value = await res.json()
    }
  } catch (e) {
    parts.value = []
  }
})
</script>
