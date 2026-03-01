<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Chapitre : {{ chapter?.title }}</h1>
    <div v-if="chapter">
      <p><strong>Slug :</strong> {{ chapter.slug }}</p>
      <p><strong>Description :</strong> {{ chapter.description }}</p>
      <p><strong>Créé le :</strong> {{ chapter.created_at }}</p>
      <p><strong>Modifié le :</strong> {{ chapter.updated_at }}</p>
      <p v-if="chapter.deleted_at"><strong>Supprimé le :</strong> {{ chapter.deleted_at }}</p>
    </div>
    <div v-else>
      Chapitre introuvable.
    </div>
    <router-link :to="`/projects/${projectSlug}/chapters`" class="mt-4 inline-block text-blue-600">← Retour à la liste</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const chapterSlug = route.params.chapterSlug
const chapter = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/chapters/${chapterSlug}`)
    if (res.ok) {
      chapter.value = await res.json()
    }
  } catch (e) {
    chapter.value = null
  }
})
</script>
