<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Partie : {{ part?.title }}</h1>
    <div v-if="part">
      <p><strong>Slug :</strong> {{ part.slug }}</p>
      <p><strong>Description :</strong> {{ part.description }}</p>
      <p><strong>Créé le :</strong> {{ part.created_at }}</p>
      <p><strong>Modifié le :</strong> {{ part.updated_at }}</p>
      <p v-if="part.deleted_at"><strong>Supprimé le :</strong> {{ part.deleted_at }}</p>
    </div>
    <div v-else>
      Partie introuvable.
    </div>
    <router-link :to="`/projects/${projectSlug}/parts`" class="mt-4 inline-block text-blue-600">← Retour à la liste</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const partSlug = route.params.partSlug
const part = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/parts/${partSlug}`)
    if (res.ok) {
      part.value = await res.json()
    }
  } catch (e) {
    part.value = null
  }
})
</script>
