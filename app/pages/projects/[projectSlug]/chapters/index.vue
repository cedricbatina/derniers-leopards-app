<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Chapitres du projet : {{ projectSlug }}</h1>
    <div v-if="chapters.length">
      <ul>
        <li v-for="chapter in chapters" :key="chapter.slug">
          <router-link :to="`/projects/${projectSlug}/chapters/${chapter.slug}`">
            {{ chapter.title }}
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      Aucun chapitre trouvé.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const chapters = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/chapters`)
    if (res.ok) {
      chapters.value = await res.json()
    }
  } catch (e) {
    chapters.value = []
  }
})
</script>
