<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Personnages du projet : {{ projectSlug }}</h1>
    <div v-if="characters.length">
      <ul>
        <li v-for="character in characters" :key="character.slug">
          <router-link :to="`/projects/${projectSlug}/characters/${character.slug}`">
            {{ character.name }}
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      Aucun personnage trouvé.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const characters = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/characters`)
    if (res.ok) {
      characters.value = await res.json()
    }
  } catch (e) {
    characters.value = []
  }
})
</script>
