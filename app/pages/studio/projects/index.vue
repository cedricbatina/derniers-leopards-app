<script setup>
definePageMeta({ middleware: 'auth' })

import { computed, reactive, ref } from 'vue'
import { useLocalePath, useRequestHeaders } from '#imports'

const localePath = useLocalePath()

const q = ref('')
const trashed = ref(false)
const creating = ref(false)

const form = reactive({
  title: '',
  slug: '',
  logline: '',
  status: 'active',
})

const queryObj = computed(() => ({
  q: q.value?.trim() || undefined,
  trashed: trashed.value ? 1 : undefined,
}))


const { data, pending, refresh, error } = await useFetch(
  () => '/api/projects',
  { query: queryObj, credentials: 'include', headers: useRequestHeaders(['cookie']) }
)

// Only show deleted projects if 'trashed' is checked
const filteredProjects = computed(() => {
  if (!data?.projects) return []
  return trashed.value ? data.projects : data.projects.filter(p => !p.deleted_at)
})

// Group filtered projects by saga_slug (or fallback to project slug if not present)
const groupedProjects = computed(() => {
  const projects = filteredProjects.value
  const groups = {}
  for (const p of projects) {
    const saga = p.saga_slug || p.saga || p.sagaSlug || p.slug || 'Autres'
    if (!groups[saga]) groups[saga] = []
    groups[saga].push(p)
  }
  // Only return groups with at least one project
  return Object.entries(groups)
    .filter(([_, arr]) => arr.length)
    .reduce((acc, [saga, arr]) => { acc[saga] = arr; return acc }, {})
})

async function createProject() {
  if (!form.title.trim()) return
  creating.value = true
  try {
    await $fetch('/api/projects', {
      method: 'POST',
      credentials: 'include',
      body: {
        title: form.title,
        slug: form.slug || undefined,
        logline: form.logline || undefined,
        status: form.status || 'active',
      },
    })
    form.title = ''
    form.slug = ''
    form.logline = ''
    form.status = 'active'
    await refresh()
  } finally {
    creating.value = false
  }
}

// Route to project page, not API
function projectTo(p) {
  return localePath(`/studio/projects/${p.slug}`)
}
</script>

<template>
  <div class="page space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Projects</h1>
        <p class="text-sm text-muted">Crée et organise tes projets.</p>
      </div>
    </div>

    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-5">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Search</label>
          <input v-model="q" class="input w-full" placeholder="title / slug…" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Status</label>
          <select v-model="form.status" class="input w-full">
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">New title</label>
          <input v-model="form.title" class="input w-full" placeholder="e.g. Les derniers léopards" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Slug (optional)</label>
          <input v-model="form.slug" class="input w-full" placeholder="les-derniers-leopards" />
        </div>

        <div class="md:col-span-5">
          <label class="text-xs text-muted">Logline (optional)</label>
          <input v-model="form.logline" class="input w-full" placeholder="Une logline courte…" />
        </div>

        <div class="md:col-span-5 flex items-center justify-between">
          <label class="text-sm text-muted flex items-center gap-2 select-none">
            <input type="checkbox" v-model="trashed" />
            Trashed
          </label>

          <button class="btn btn-primary focus-ring" :disabled="creating" @click="createProject">
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
          <span v-else>{{ ((filteredProjects.value && filteredProjects.value.length) || 0) + (trashed ? ' (incl. corbeille)' : '') }} projet(s)</span>
        </div>
      </div>

      <div>
        <div v-for="(projects, saga) in groupedProjects" :key="saga" class="mb-6">
          <div class="bg-gray-100 px-4 py-2 font-bold text-lg rounded-t">{{ saga }}</div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            <NuxtLink
              v-for="p in projects"
              :key="p.slug"
              class="card hover:bg-surface2 focus-ring"
              :to="projectTo(p)"
              :class="p.deleted_at ? 'pointer-events-none opacity-60' : ''"
            >
              <div class="card-body">
                <div class="flex items-center gap-2 mb-2">
                  <span class="badge badge-primary">{{ p.type || 'Projet' }}</span>
                  <span class="badge">{{ p.status }}</span>
                  <span v-if="p.deleted_at" class="badge">Corbeille</span>
                </div>
                <div class="font-extrabold text-lg">{{ $t(`projects.titles.${p.slug}`, p.title) }}</div>
                <div v-if="p.title_en" class="text-xs text-muted mt-1">{{ $t(`projects.titles_en.${p.slug}`, p.title_en) }}</div>
                <div v-if="p.title_pt" class="text-xs text-muted mt-1">{{ $t(`projects.titles_pt.${p.slug}`, p.title_pt) }}</div>
                <div class="text-xs text-muted mt-1">Slug: {{ p.slug }}</div>
                <div v-if="p.logline" class="text-sm text-muted mt-1">{{ $t(`projects.loglines.${p.slug}`, p.logline) }}</div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
