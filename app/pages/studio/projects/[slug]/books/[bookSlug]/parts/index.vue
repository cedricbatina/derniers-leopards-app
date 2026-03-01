<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()

const projectSlug = computed(() => String(route.params.slug || ''))
const bookSlug = computed(() => String(route.params.bookSlug || ''))

const { data: bookData } = await useFetch(
  () => `/api/projects/${projectSlug.value}/books/${bookSlug.value}`,
  { $fetch: apiFetch, credentials: 'include' }
)

const { data, pending, refresh, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/books/${bookSlug.value}/parts`,
  { $fetch: apiFetch, credentials: 'include' }
)

const creating = ref(false)
const form = reactive({
  part_no: '',
  title: '',
  slug: '',
  summary: '',
})

async function createPart() {
  if (!form.title.trim()) return
  creating.value = true
  try {
    await apiFetch(`/api/projects/${projectSlug.value}/books/${bookSlug.value}/parts`, {
      method: 'POST',
      body: {
        part_no: form.part_no ? Number(form.part_no) : undefined,
        title: form.title,
        slug: form.slug || undefined,
        summary: form.summary || undefined,
      },
    })
    form.part_no = ''
    form.title = ''
    form.slug = ''
    form.summary = ''
    await refresh()
  } finally {
    creating.value = false
  }
}

async function deletePart(p) {
  if (!confirm(`Delete part "${p.title}"?`)) return
  await apiFetch(`/api/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${p.id}`, {
    method: 'DELETE',
  })
  await refresh()
}

function partTo(p) {
  return localePath(`/studio/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${p.id}`)
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink
      class="text-sm text-muted hover:opacity-100"
      :to="localePath(`/studio/projects/${projectSlug}/books/${bookSlug}`)"
    >
      ← Back to book
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Parts</h1>
        <p class="text-sm text-muted">
          {{ bookData?.book?.title || bookSlug }}
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-4">
        <div class="md:col-span-1">
          <label class="text-xs text-muted">Part #</label>
          <input v-model="form.part_no" class="input w-full" placeholder="1" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Title</label>
          <input v-model="form.title" class="input w-full" placeholder="Partie I - ..." />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Slug (optional)</label>
          <input v-model="form.slug" class="input w-full" placeholder="partie-1" />
        </div>

        <div class="md:col-span-4">
          <label class="text-xs text-muted">Summary (optional)</label>
          <textarea v-model="form.summary" class="input w-full min-h-24" />
        </div>

        <div class="md:col-span-4">
          <button class="btn btn-primary w-full focus-ring" :disabled="creating" @click="createPart">
            <Icon name="mdi:plus" aria-hidden="true" />
            Create
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="card">
      <div class="card-body text-sm">Error: {{ error?.statusMessage || error }}</div>
    </div>

    <div class="card overflow-hidden">
      <div class="card-body flex items-center justify-between">
        <div class="text-sm text-muted">
          <span v-if="pending">Loading…</span>
          <span v-else>{{ data?.parts?.length || 0 }} part(s)</span>
        </div>
      </div>

      <div class="divide-y divide-border">
        <div
          v-for="p in (data?.parts || [])"
          :key="p.id"
          class="flex items-start justify-between gap-3 p-4 hover:bg-surface2"
        >
          <NuxtLink class="min-w-0" :to="partTo(p)">
            <div class="font-extrabold">
              <span class="text-muted" v-if="p.part_no">[Part {{ p.part_no }}]</span>
              {{ p.title }}
            </div>
            <div class="text-xs text-muted mt-1">{{ p.slug }}</div>
            <div v-if="p.summary" class="text-sm text-muted mt-1">{{ p.summary }}</div>
          </NuxtLink>

          <button class="btn btn-ghost focus-ring" @click.prevent.stop="deletePart(p)">
            <Icon name="mdi:trash-can-outline" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
