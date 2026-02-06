<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()

const projectSlug = computed(() => String(route.params.slug || ''))

const q = ref('')
const trashed = ref(false)
const chapterFilter = ref('')
const creating = ref(false)

const { data: chaptersData } = await useFetch(
  () => `/api/projects/${projectSlug.value}/chapters`,
  { credentials: 'include' }
)

const chapterOptions = computed(() => chaptersData.value?.chapters || [])

const queryObj = computed(() => ({
  q: q.value?.trim() || undefined,
  trashed: trashed.value ? 1 : undefined,
  chapter_id: chapterFilter.value ? Number(chapterFilter.value) : undefined,
}))

const { data, pending, refresh, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/scenes`,
  { query: queryObj, credentials: 'include' }
)

const form = reactive({
  chapter_id: '',
  scene_no: '',
  title: '',
  slug: '',
  summary: '',
})

async function createScene() {
  if (!form.chapter_id) return
  creating.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/scenes`, {
      method: 'POST',
      credentials: 'include',
      body: {
        chapter_id: Number(form.chapter_id),
        scene_no: form.scene_no ? Number(form.scene_no) : undefined,
        title: form.title || undefined,
        slug: form.slug || undefined,
        summary: form.summary || '',
      },
    })

    form.scene_no = ''
    form.title = ''
    form.slug = ''
    form.summary = ''
    await refresh()
  } finally {
    creating.value = false
  }
}

async function softDelete(s) {
  if (!confirm(`Delete scene "${s.title || s.slug}"?`)) return
  await $fetch(`/api/projects/${projectSlug.value}/scenes/${s.slug}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  await refresh()
}

async function restore(s) {
  await $fetch(`/api/projects/${projectSlug.value}/scenes/${s.slug}/restore`, {
    method: 'POST',
    credentials: 'include',
  })
  await refresh()
}

function sceneTo(s) {
  const base = `/studio/projects/${projectSlug.value}/scenes/${s.slug}`
  return trashed.value ? localePath(`${base}?trashed=1`) : localePath(base)
}

function chapterLabel(id, chapterNo) {
  if (chapterNo !== null && chapterNo !== undefined) return `Chapter ${chapterNo}`
  return `Chapter #${id}`
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink
      class="text-sm text-muted hover:opacity-100"
      :to="localePath(`/studio/projects/${projectSlug}`)"
    >
      ← Back to project
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Scenes</h1>
        <p class="text-sm text-muted">Scènes du projet (CRUD + corbeille).</p>
      </div>

      <label class="text-sm text-muted flex items-center gap-2 select-none">
        <input type="checkbox" v-model="trashed" />
        Trashed
      </label>
    </div>

    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-6">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Search</label>
          <input v-model="q" class="input w-full" placeholder="title / slug / summary…" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">Filter by chapter</label>
          <select v-model="chapterFilter" class="input w-full">
            <option value="">All</option>
            <option v-for="c in chapterOptions" :key="c.id" :value="String(c.id)">
              {{ chapterLabel(c.id, c.chapter_no) }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">New scene: chapter</label>
          <select v-model="form.chapter_id" class="input w-full">
            <option value="">Select…</option>
            <option v-for="c in chapterOptions" :key="c.id" :value="String(c.id)">
              {{ chapterLabel(c.id, c.chapter_no) }}
            </option>
          </select>
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Scene #</label>
          <input v-model="form.scene_no" class="input w-full" placeholder="1" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">Title</label>
          <input v-model="form.title" class="input w-full" placeholder="e.g. Désolation de Mbuila" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">Slug (optional)</label>
          <input v-model="form.slug" class="input w-full" placeholder="mbuila-desolation" />
        </div>

        <div class="md:col-span-6">
          <label class="text-xs text-muted">Summary</label>
          <textarea v-model="form.summary" class="input w-full min-h-24" placeholder="Résumé (optionnel)" />
        </div>

        <div class="md:col-span-6">
          <button class="btn btn-primary w-full focus-ring" :disabled="creating" @click="createScene">
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
          <span v-else>{{ data?.scenes?.length || 0 }} scene(s)</span>
        </div>
      </div>

      <div class="divide-y divide-border">
        <NuxtLink
          v-for="s in (data?.scenes || [])"
          :key="s.slug"
          class="block p-4 hover:bg-surface2"
          :to="sceneTo(s)"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="font-extrabold">
                <span class="text-muted" v-if="s.chapter_no !== null && s.chapter_no !== undefined">
                  [Ch {{ s.chapter_no }}]
                </span>
                {{ s.title || s.slug }}
              </div>
              <div class="text-xs text-muted mt-1">{{ s.slug }}</div>
              <div v-if="s.summary" class="text-sm text-muted mt-1 line-clamp-2">{{ s.summary }}</div>
            </div>

            <div class="flex items-center gap-2">
              <span v-if="s.deleted_at" class="badge">trashed</span>

              <button
                v-if="!s.deleted_at"
                class="btn btn-ghost focus-ring"
                @click.prevent.stop="softDelete(s)"
              >
                <Icon name="mdi:trash-can-outline" aria-hidden="true" />
              </button>

              <button
                v-else
                class="btn btn-ghost focus-ring"
                @click.prevent.stop="restore(s)"
              >
                <Icon name="mdi:backup-restore" aria-hidden="true" />
              </button>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
