<template>
  <div class="max-w-xl mx-auto p-8">
    <h1 class="text-2xl font-bold mb-6">Éditer le chapitre</h1>
    <form v-if="loaded" @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block font-semibold mb-1">Titre *</label>
        <input v-model="form.title" required class="input input-bordered w-full" />
      </div>
      <div>
        <label class="block font-semibold mb-1">Slug *</label>
        <input v-model="form.slug" required class="input input-bordered w-full" />
      </div>
      <div>
        <label class="block font-semibold mb-1">Description</label>
        <textarea v-model="form.description" class="input input-bordered w-full"></textarea>
      </div>
      <div class="pt-4">
        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          {{ loading ? 'Sauvegarde...' : 'Enregistrer les modifications' }}
        </button>
      </div>
      <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
      <div v-if="success" class="text-green-600 mt-2">Chapitre modifié avec succès !</div>
    </form>
    <div v-else>Chargement…</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const projectSlug = route.params.projectSlug
const chapterSlug = route.params.chapterSlug
const form = ref({ title: '', slug: '', description: '' })
const loading = ref(false)
const loaded = ref(false)
const error = ref('')
const success = ref(false)

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/chapters/${chapterSlug}`)
    if (!res.ok) throw new Error('Chapitre introuvable')
    const data = await res.json()
    form.value = {
      title: data.title,
      slug: data.slug,
      description: data.description
    }
    loaded.value = true
  } catch (e) {
    error.value = e.message
  }
})

async function submitForm() {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    const res = await fetch(`/api/projects/${projectSlug}/chapters/${chapterSlug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    if (!res.ok) throw new Error('Erreur lors de la modification du chapitre')
    success.value = true
    setTimeout(() => {
      router.push(`/projects/${projectSlug}/chapters`)
    }, 1200)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input {
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
}
.btn {
  background-color: #2563eb;
  color: #fff;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}
.btn:hover {
  background-color: #1d4ed8;
}
</style>
