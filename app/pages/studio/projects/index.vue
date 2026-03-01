<script setup>
definePageMeta({ middleware: 'auth' })

import { computed, reactive, ref, watch } from 'vue'
import { useLocalePath, useRequestHeaders } from '#imports'

const localePath = useLocalePath()

const q = ref('')
const trashed = ref(false)
const statusFilter = ref('all')
const showCreate = ref(false)
const creating = ref(false)
const currentPage = ref(1)
const pageSize = 6

const form = reactive({
  title: '',
  slug: '',
  logline: '',
  status: 'active',
})

const queryObj = computed(() => ({
  q: q.value?.trim() || undefined,
  status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
  trashed: trashed.value ? 1 : undefined,
}))


const { data, pending, refresh, error } = await useFetch(
  () => '/api/projects',
  {
    $fetch: apiFetch,
    query: queryObj,
    credentials: 'include',
    headers: useRequestHeaders(['cookie']),
  }
)

// Only show deleted projects if 'trashed' is checked
const filteredProjects = computed(() => {
  const projects = data.value?.projects || []
  return trashed.value ? projects : projects.filter((p) => !p.deleted_at)
})

// Get total count for pagination
const totalProjects = computed(() => filteredProjects.value.length)
const totalPages = computed(() => Math.ceil(totalProjects.value / pageSize) || 1)

// Paginate projects
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredProjects.value.slice(start, end)
})

// Group paginated projects by saga_slug (for display purposes)
const groupedProjects = computed(() => {
  const projects = paginatedProjects.value
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
    await apiFetch('/api/projects', {
      method: 'POST',
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
    showCreate.value = false
    currentPage.value = 1
    await refresh()
  } finally {
    creating.value = false
  }
}

// Route to project page, not API
function projectTo(p) {
  return localePath(`/studio/projects/${p.slug}`)
}

// Reset pagination when filters change
watch([q, statusFilter, trashed], () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="page space-y-5">
    <div class="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-xl font-semibold">Projects</h1>
        <p class="text-sm text-muted">Liste, filtre et gère tes projets.</p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink :to="localePath('/studio/todos')" class="btn btn-ghost focus-ring">
          <Icon name="mdi:checkbox-marked-outline" aria-hidden="true" />
          {{ $t('domain.todo.myTasks') }}
        </NuxtLink>
        <button class="btn btn-primary focus-ring" @click="showCreate = !showCreate">
          <Icon name="mdi:plus" aria-hidden="true" />
          Nouveau projet
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-4">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Search</label>
          <input v-model="q" class="input w-full" placeholder="title / slug…" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Filter status</label>
          <select v-model="statusFilter" class="input w-full">
            <option value="all">all</option>
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </div>

        <div class="md:col-span-1">
          <label class="text-sm text-muted flex items-center gap-2 select-none">
            <input type="checkbox" v-model="trashed" />
            Trashed
          </label>
        </div>
      </div>
    </div>

    <div v-if="showCreate" class="card">
      <div class="card-body grid gap-3 md:grid-cols-4">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">New title</label>
          <input v-model="form.title" class="input w-full" placeholder="e.g. Les derniers léopards" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Slug (optional)</label>
          <input v-model="form.slug" class="input w-full" placeholder="les-derniers-leopards" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Status</label>
          <select v-model="form.status" class="input w-full">
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </div>

        <div class="md:col-span-4">
          <label class="text-xs text-muted">Logline (optional)</label>
          <input v-model="form.logline" class="input w-full" placeholder="Une logline courte…" />
        </div>

        <div class="md:col-span-4 flex justify-end">
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
          <span v-else>{{ totalProjects }} projet(s){{ trashed ? ' (incl. corbeille)' : '' }} — Page {{ currentPage }} sur {{ totalPages }}</span>
        </div>
      </div>

      <div v-if="paginatedProjects.length">
        <div v-for="(projects, saga) in groupedProjects" :key="saga" class="mb-12 last:mb-0">
          <h2 class="text-lg font-bold mb-4 pb-2 border-b border-border">{{ saga }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NuxtLink
              v-for="p in projects"
              :key="p.slug"
              class="card hover:bg-surface2 focus-ring transition-colors"
              :to="projectTo(p)"
              :class="p.deleted_at ? 'pointer-events-none opacity-60' : ''"
            >
              <div class="card-body">
                <div class="flex items-center gap-2 mb-3">
                  <span class="badge badge-primary">{{ p.type || 'Projet' }}</span>
                  <span class="badge">{{ p.status }}</span>
                  <span v-if="p.deleted_at" class="badge">Corbeille</span>
                </div>
                <div class="font-extrabold text-2xl mb-2">{{ $t(`projects.titles.${p.slug}`, p.title) }}</div>
                <div v-if="p.title_en" class="text-xs text-muted mb-1">{{ $t(`projects.titles_en.${p.slug}`, p.title_en) }}</div>
                <div v-if="p.title_pt" class="text-xs text-muted mb-2">{{ $t(`projects.titles_pt.${p.slug}`, p.title_pt) }}</div>
                <div v-if="p.logline" class="text-sm text-muted mb-3 line-clamp-2">{{ $t(`projects.loglines.${p.slug}`, p.logline) }}</div>
                <div class="flex items-center justify-between pt-3 border-t border-border text-xs text-muted">
                  <span class="font-mono">{{ p.slug }}</span>
                  <span v-if="p.updated_at">{{ new Date(p.updated_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }) }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="card-body text-muted">
        Aucun projet ne correspond aux filtres.
      </div>
    </div>

    <AppPagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalProjects"
      :page-size="pageSize"
      show-summary
      show-goto
      @page-change="(page) => currentPage = page"
    />
  </div>
</template>
