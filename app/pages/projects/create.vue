<template>
  <div class="max-w-xl mx-auto p-8">
    <h1 class="text-2xl font-bold mb-6">Créer un nouveau projet</h1>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block font-semibold mb-1">Nom du projet *</label>
        <input v-model="form.name" required class="input input-bordered w-full" placeholder="Nom du projet" />
      </div>
      <div>
        <label class="block font-semibold mb-1">Slug *</label>
        <input v-model="form.slug" required class="input input-bordered w-full" placeholder="ex: mon-projet" />
      </div>
      <div>
        <label class="block font-semibold mb-1">Description</label>
        <textarea v-model="form.description" class="input input-bordered w-full" placeholder="Description du projet"></textarea>
      </div>
      <div>
        <label class="block font-semibold mb-1">Langue principale</label>
        <select v-model="form.language" class="input input-bordered w-full">
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="pt">Português</option>
        </select>
      </div>
      <div class="pt-4">
        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          {{ loading ? 'Création en cours...' : 'Créer le projet' }}
        </button>
      </div>
      <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
      <div v-if="success" class="text-green-600 mt-2">Projet créé avec succès !</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({ name: '', slug: '', description: '', language: 'fr' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function submitForm() {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    if (!res.ok) throw new Error('Erreur lors de la création du projet')
    success.value = true
    setTimeout(() => {
      router.push('/studio')
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
  border: 1px solid #d1d5db; /* border */
  border-radius: 0.375rem; /* rounded */
  padding-left: 0.75rem; /* px-3 */
  padding-right: 0.75rem;
  padding-top: 0.5rem; /* py-2 */
  padding-bottom: 0.5rem;
}
.btn {
  background-color: #2563eb; /* bg-blue-600 */
  color: #fff; /* text-white */
  font-weight: bold; /* font-bold */
  padding-top: 0.5rem; /* py-2 */
  padding-bottom: 0.5rem;
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem;
  border-radius: 0.5rem; /* rounded */
  transition: background-color 0.2s; /* transition */
}
.btn:hover {
  background-color: #1d4ed8; /* hover:bg-blue-700 */
}
</style>
