<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Scènes du projet : {{ projectSlug }}</h1>
    <div v-if="scenes.length">
      <ul>
        <li v-for="scene in scenes" :key="scene.slug">
          <router-link :to="`/projects/${projectSlug}/scenes/${scene.slug}`">
            {{ scene.title }}
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      Aucune scène trouvée.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const scenes = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/scenes`)
    if (res.ok) {
      scenes.value = await res.json()
    }
  } catch (e) {
    scenes.value = []
  }
})
</script>
