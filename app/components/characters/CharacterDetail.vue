<script setup>
import { ref, reactive, computed } from 'vue'
import { useLocalePath, useRequestHeaders } from '#imports'

const props = defineProps({
  apiBase: { type: String, required: true }, // ex: /api/projects/slug/characters
  characterSlug: { type: String, required: true },
  backTo: { type: String, default: '' },
  backLabel: { type: String, default: 'Back' },
})

const localePath = useLocalePath()
const editing = ref(false)
const saving = ref(false)
const error = ref(null)
const form = reactive({ name: '', slug: '', description: '' })

const { data, pending, refresh } = await useFetch(
  () => `${props.apiBase}/${props.characterSlug}`,
  { $fetch: apiFetch, credentials: 'include', headers: useRequestHeaders(['cookie']) }
)

watch(
  () => data.value,
  (val) => {
    if (val?.character) {
      form.name = val.character.name
      form.slug = val.character.slug
      form.description = val.character.description || ''
    }
  },
  { immediate: true }
)

async function save() {
  saving.value = true
  error.value = null
  try {
    await apiFetch(`${props.apiBase}/${props.characterSlug}`, {
      method: 'PATCH',
      body: {
        name: form.name,
        slug: form.slug,
        description: form.description,
      },
    })
    editing.value = false
    await refresh()
  } catch (e) {
    error.value = e?.statusMessage || e
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink v-if="props.backTo" class="text-sm text-muted hover:opacity-100" :to="localePath(props.backTo)">
      ← {{ props.backLabel }}
    </NuxtLink>
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-xl font-semibold">Character: {{ data?.character?.name || '...' }}</h1>
      <button v-if="!editing" class="btn btn-ghost focus-ring" @click="editing = true">
        <Icon name="mdi:pencil" aria-hidden="true" /> Edit
      </button>
    </div>
    <div v-if="error" class="alert alert-error">{{ error }}</div>
    <div v-if="editing" class="card">
      <div class="card-body grid gap-3 md:grid-cols-3">
        <div>
          <label class="text-xs text-muted">Name</label>
          <input v-model="form.name" class="input w-full" />
        </div>
        <div>
          <label class="text-xs text-muted">Slug</label>
          <input v-model="form.slug" class="input w-full" />
        </div>
        <div>
          <label class="text-xs text-muted">Description</label>
          <input v-model="form.description" class="input w-full" />
        </div>
        <div class="md:col-span-3 flex gap-2 mt-2">
          <button class="btn btn-primary focus-ring" :disabled="saving" @click="save">Save</button>
          <button class="btn btn-ghost focus-ring" :disabled="saving" @click="editing = false">Cancel</button>
        </div>
      </div>
    </div>
    <div v-else class="card">
      <div class="card-body">
        <div class="font-bold text-lg">{{ data?.character?.name }}</div>
        <div class="text-xs text-muted mt-1">Slug: {{ data?.character?.slug }}</div>
        <div v-if="data?.character?.description" class="text-sm text-muted mt-1">{{ data?.character?.description }}</div>
      </div>
    </div>
  </div>
</template>
