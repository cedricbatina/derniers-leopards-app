<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Glossaire du projet : {{ projectSlug }}</h1>
    <div v-if="glossary.length">
      <ul>
        <li v-for="entry in glossary" :key="entry.slug">
          <span>{{ entry.term }} : {{ entry.definition }}</span>
        </li>
      </ul>
    </div>
    <div v-else>
      Aucun terme trouvé.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const glossary = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/glossary`)
    if (res.ok) {
      glossary.value = await res.json()
    }
  } catch (e) {
    glossary.value = []
  }
})
</script>
