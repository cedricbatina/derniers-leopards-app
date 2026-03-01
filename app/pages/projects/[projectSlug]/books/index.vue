<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Livres du projet : {{ project?.slug }}</h1>

    <!-- Formulaire création livre -->
    <form @submit.prevent="createBook" class="mb-8 space-y-2 bg-gray-50 p-4 rounded shadow">
      <div class="font-semibold mb-1">Créer un nouveau livre</div>
      <input v-model="form.title" required class="input input-bordered w-full mb-1" placeholder="Titre (ex: Tome I)" />
      <input v-model="form.subtitle" class="input input-bordered w-full mb-1" placeholder="Sous-titre (optionnel)" />
      <input v-model="form.slug" class="input input-bordered w-full mb-1" placeholder="Slug (optionnel)" />
      <button type="submit" class="btn btn-primary w-full" :disabled="loading">
        {{ loading ? 'Création...' : 'Créer' }}
      </button>
      <div v-if="error" class="text-red-600 mt-1">{{ error }}</div>
      <div v-if="success" class="text-green-600 mt-1">Livre créé !</div>
    </form>

    <div v-if="booksList.length">
      <ul>
        <li v-for="book in booksList" :key="book.slug">
          <router-link :to="`/projects/${project?.slug}/books/${book.slug}`">
            {{ book.title }}
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      Aucun livre trouvé.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectSlug = route.params.projectSlug
const project = ref(null)
const booksList = ref([])
const form = ref({ title: '', subtitle: '', slug: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function fetchBooks() {
  try {
    const res = await fetch(`/api/projects/${projectSlug}/books`)
    if (res.ok) {
      const data = await res.json()
      project.value = data.project
      booksList.value = data.books || []
    }
  } catch (e) {
    booksList.value = []
    project.value = null
  }
}

onMounted(fetchBooks)

async function createBook() {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    const res = await fetch(`/api/projects/${projectSlug}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.statusMessage || 'Erreur lors de la création du livre')
    }
    success.value = true
    form.value = { title: '', subtitle: '', slug: '' }
    await fetchBooks()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
