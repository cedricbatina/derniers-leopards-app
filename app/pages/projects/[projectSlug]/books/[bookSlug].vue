<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Livre : {{ book?.title }}</h1>
    <div v-if="book">
      <p><strong>Slug :</strong> {{ book.slug }}</p>
      <p><strong>Sous-titre :</strong> {{ book.subtitle }}</p>
      <p><strong>Sous-titre EN :</strong> {{ book.subtitle_en }}</p>
      <p><strong>Sous-titre PT :</strong> {{ book.subtitle_pt }}</p>
      <p><strong>Résumé :</strong> {{ book.summary }}</p>
      <p><strong>Créé le :</strong> {{ book.created_at }}</p>
      <p><strong>Modifié le :</strong> {{ book.updated_at }}</p>
      <p v-if="book.deleted_at"><strong>Supprimé le :</strong> {{ book.deleted_at }}</p>
    </div>
    <div v-else>
      Livre introuvable.
    </div>
    <router-link :to="`/projects/${projectSlug}/books`" class="mt-4 inline-block text-blue-600">← Retour à la liste</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const bookSlug = route.params.bookSlug
const book = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/books/${bookSlug}`)
    if (res.ok) {
      book.value = await res.json()
    }
  } catch (e) {
    book.value = null
  }
})
</script>
