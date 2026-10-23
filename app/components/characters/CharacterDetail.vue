<script setup>
import { ref, reactive, watch } from 'vue'
import { useLocalePath, useRequestHeaders } from '#imports'
import { isNarrativeAccessDenied } from '~/utils/narrativeAccess'

const props = defineProps({
  apiBase: { type: String, required: true }, // ex: /api/projects/slug/characters
  characterSlug: { type: String, required: true },
  backTo: { type: String, default: '' },
  backLabel: { type: String, default: 'Back' },
})

const localePath = useLocalePath()
const editing = ref(false)
const saving = ref(false)
const saveError = ref(null)
const form = reactive({ name: '', slug: '', description: '' })

const { data, pending, refresh, error: loadError } = await useFetch(
  () => `${props.apiBase}/${props.characterSlug}`,
  { $fetch: apiFetch, credentials: 'include', headers: useRequestHeaders(['cookie']) }
)

watch(
  () => loadError.value,
  async (err) => {
    if (!import.meta.client || !err || !isNarrativeAccessDenied(err)) return
    await navigateTo(
      { path: localePath({ name: 'access-denied' }), query: { reason: 'forbidden' } },
      { replace: true },
    )
  },
  { immediate: true },
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
  saveError.value = null
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
    saveError.value = e?.statusMessage || e
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
      <h1 class="text-xl font-semibold flex items-center gap-2">
        <Icon name="mdi:account" aria-hidden="true" />
        <span>Character: {{ data?.character?.name || '...' }}</span>
      </h1>
      <button v-if="!editing" class="btn btn-ghost focus-ring" @click="editing = true">
        <Icon name="mdi:pencil" aria-hidden="true" /> Edit
      </button>
    </div>
    <div v-if="saveError" class="alert alert-error">{{ saveError }}</div>
    <div v-if="editing" class="card">
      <div class="card-body space-y-4">
        <div class="grid gap-4 md:grid-cols-6">
        <div>
          <label class="text-xs font-medium text-muted mb-1.5 block">Name</label>
          <div class="relative">
            <Icon name="mdi:account-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input v-model="form.name" class="input w-full pl-10" placeholder="e.g. Kualu" />
          </div>
        </div>
        <div class="md:col-span-2">
          <label class="text-xs font-medium text-muted mb-1.5 block">Slug</label>
          <div class="relative">
            <Icon name="mdi:link-variant" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input v-model="form.slug" class="input w-full pl-10 font-mono" placeholder="kualu" />
          </div>
        </div>
        <div class="md:col-span-6">
          <label class="text-xs font-medium text-muted mb-1.5 block">Description</label>
          <textarea
            v-model="form.description"
            class="input w-full min-h-24"
            placeholder="Short description…"
          />
        </div>
        </div>

        <div class="flex items-center justify-end gap-2">
          <button class="btn btn-ghost focus-ring" :disabled="saving" @click="editing = false">
            Cancel
          </button>
          <button class="btn btn-primary focus-ring gap-2" :disabled="saving" @click="save">
            <Icon name="mdi:content-save" aria-hidden="true" />
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="card">
      <div class="card-body">
        <div class="font-bold text-lg">{{ data?.character?.name }}</div>
        <div class="text-xs text-muted mt-1">Slug: {{ data?.character?.slug }}</div>
        <div v-if="data?.character?.description" class="text-sm text-muted mt-1 whitespace-pre-wrap">
          {{ data?.character?.description }}
        </div>
      </div>
    </div>
  </div>
</template>
