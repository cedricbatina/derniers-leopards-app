<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Chronologie du projet : {{ projectSlug }}</h1>
    <div v-if="timeline.length">
      <ul>
        <li v-for="event in timeline" :key="event.id">
          <span>{{ event.date }} — {{ event.title }}</span>
        </li>
      </ul>
    </div>
    <div v-else>
      Aucun événement trouvé.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const timeline = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/timeline`)
    if (res.ok) {
      timeline.value = await res.json()
    }
  } catch (e) {
    timeline.value = []
  }
})
</script>
