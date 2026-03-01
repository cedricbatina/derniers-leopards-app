<template>
  <div class="max-w-xl mx-auto p-8">
    <h1 class="text-2xl font-bold mb-6">Éditer le terme</h1>
    <form v-if="loaded" @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block font-semibold mb-1">Terme *</label>
        <input v-model="form.term" required class="input input-bordered w-full" />
      </div>
      <div>
        <label class="block font-semibold mb-1">Slug *</label>
        <input v-model="form.slug" required class="input input-bordered w-full" />
      </div>
      <div>
        <label class="block font-semibold mb-1">Définition</label>
        <textarea v-model="form.definition" class="input input-bordered w-full"></textarea>
      </div>
      <div class="pt-4">
        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          {{ loading ? 'Sauvegarde...' : 'Enregistrer les modifications' }}
        </button>
      </div>
      <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
      <div v-if="success" class="text-green-600 mt-2">Terme modifié avec succès !</div>
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
const termId = route.params.termId
const form = ref({ term: '', slug: '', definition: '' })
const loading = ref(false)
const loaded = ref(false)
const error = ref('')
const success = ref(false)

onMounted(async () => {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/glossary/${termId}`)
    if (!res.ok) throw new Error('Terme introuvable')
    const data = await res.json()
    form.value = {
      term: data.term,
      slug: data.slug,
      definition: data.definition
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
    const res = await fetch(`/api/projects/${projectSlug}/glossary/${termId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    if (!res.ok) throw new Error('Erreur lors de la modification du terme')
    success.value = true
    setTimeout(() => {
      router.push(`/projects/${projectSlug}/glossary`)
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
  border-radius: 0.375rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.btn {
  background-color: #2563eb;
  color: #fff;
  font-weight: bold;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}
.btn:hover {
  background-color: #1d4ed8;
}
</style>
