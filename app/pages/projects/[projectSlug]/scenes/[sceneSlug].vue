<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Scène : {{ scene?.title }}</h1>
    <div v-if="scene">
      <p><strong>Slug :</strong> {{ scene.slug }}</p>
      <p><strong>Description :</strong> {{ scene.description }}</p>
      <p><strong>Créé le :</strong> {{ scene.created_at }}</p>
      <p><strong>Modifié le :</strong> {{ scene.updated_at }}</p>
      <p v-if="scene.deleted_at"><strong>Supprimé le :</strong> {{ scene.deleted_at }}</p>
    </div>
    <div v-else>
      Scène introuvable.
    </div>
    <router-link :to="`/projects/${projectSlug}/scenes`" class="mt-4 inline-block text-blue-600">← Retour à la liste</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const sceneSlug = route.params.sceneSlug
const scene = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/scenes/${sceneSlug}`)
    if (res.ok) {
      scene.value = await res.json()
    }
  } catch (e) {
    scene.value = null
  }
})
</script>
