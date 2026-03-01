<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Événement : {{ event?.title }}</h1>
    <div v-if="event">
      <p><strong>ID :</strong> {{ event.id }}</p>
      <p><strong>Description :</strong> {{ event.description }}</p>
      <p><strong>Date :</strong> {{ event.date }}</p>
      <p><strong>Créé le :</strong> {{ event.created_at }}</p>
      <p><strong>Modifié le :</strong> {{ event.updated_at }}</p>
      <p v-if="event.deleted_at"><strong>Supprimé le :</strong> {{ event.deleted_at }}</p>
    </div>
    <div v-else>
      Événement introuvable.
    </div>
    <router-link :to="`/projects/${projectSlug}/timeline`" class="mt-4 inline-block text-blue-600">← Retour à la liste</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const eventId = route.params.eventId
const event = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/timeline/${eventId}`)
    if (res.ok) {
      event.value = await res.json()
    }
  } catch (e) {
    event.value = null
  }
})
</script>
