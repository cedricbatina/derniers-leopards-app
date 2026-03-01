<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Personnage : {{ character?.name }}</h1>
    <div v-if="character">
      <p><strong>Slug :</strong> {{ character.slug }}</p>
      <p><strong>Description :</strong> {{ character.description }}</p>
      <p><strong>Créé le :</strong> {{ character.created_at }}</p>
      <p><strong>Modifié le :</strong> {{ character.updated_at }}</p>
      <p v-if="character.deleted_at"><strong>Supprimé le :</strong> {{ character.deleted_at }}</p>
    </div>
    <div v-else>
      Personnage introuvable.
    </div>
    <router-link :to="`/projects/${projectSlug}/characters`" class="mt-4 inline-block text-blue-600">← Retour à la liste</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const characterSlug = route.params.characterSlug
const character = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/characters/${characterSlug}`)
    if (res.ok) {
      character.value = await res.json()
    }
  } catch (e) {
    character.value = null
  }
})
</script>
