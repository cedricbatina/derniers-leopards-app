<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Terme : {{ term?.term }}</h1>
    <div v-if="term">
      <p><strong>Slug :</strong> {{ term.slug }}</p>
      <p><strong>Définition :</strong> {{ term.definition }}</p>
      <p><strong>Créé le :</strong> {{ term.created_at }}</p>
      <p><strong>Modifié le :</strong> {{ term.updated_at }}</p>
      <p v-if="term.deleted_at"><strong>Supprimé le :</strong> {{ term.deleted_at }}</p>
    </div>
    <div v-else>
      Terme introuvable.
    </div>
    <router-link :to="`/projects/${projectSlug}/glossary`" class="mt-4 inline-block text-blue-600">← Retour à la liste</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const termId = route.params.termId
const term = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/glossary/${termId}`)
    if (res.ok) {
      term.value = await res.json()
    }
  } catch (e) {
    term.value = null
  }
})
</script>
