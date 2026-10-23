<script setup>
definePageMeta({ middleware: 'auth' })

import { computed, reactive, ref, watch } from 'vue'
import { useLocalePath, useRequestHeaders, useI18n } from '#imports'

const localePath = useLocalePath()
const { t, te } = useI18n()

function i18nOr(key, fallback) {
  return te(key) ? t(key) : fallback
}

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

const allProjects = computed(() => data.value?.projects || [])
const stats = computed(() => {
  const rows = allProjects.value
  const active = rows.filter((p) => !p.deleted_at && p.status === 'active').length
  const draft = rows.filter((p) => !p.deleted_at && p.status === 'draft').length
  const archived = rows.filter((p) => !p.deleted_at && p.status === 'archived').length
  const trash = rows.filter((p) => !!p.deleted_at).length
  return { active, draft, archived, trash, total: rows.length }
})

function statusLabel(s) {
  if (s === 'draft') return 'Brouillon'
  if (s === 'active') return 'Actif'
  if (s === 'archived') return 'Archivé'
  return String(s || '—')
}

function statusBadgeClass(s) {
  if (s === 'active') return 'badge badge-success'
  if (s === 'draft') return 'badge badge-warning'
  if (s === 'archived') return 'badge'
  return 'badge'
}

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
  <div class="page max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <!-- Header -->
    <div class="card overflow-hidden">
      <div class="h-1 w-full bg-gradient-to-r from-primary/60 via-amber-400/50 to-primary/30" />
      <div class="card-body flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <Icon name="mdi:folder-multiple-outline" class="text-xl text-primary" aria-hidden="true" />
            <h1 class="text-2xl font-extrabold tracking-tight">Projets</h1>
          </div>
          <p class="text-sm text-muted">
            Liste, filtre et gère tes projets. Tout le travail « atelier » reste privé.
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <NuxtLink :to="localePath('/studio/todos')" class="btn btn-ghost focus-ring gap-2">
            <Icon name="mdi:checkbox-marked-outline" aria-hidden="true" />
            {{ $t('domain.todo.myTasks') }}
          </NuxtLink>
          <button class="btn btn-primary focus-ring gap-2" @click="showCreate = !showCreate">
            <Icon :name="showCreate ? 'mdi:close' : 'mdi:plus'" aria-hidden="true" />
            {{ showCreate ? 'Fermer' : 'Nouveau projet' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quick stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-body">
          <div class="text-xs text-muted flex items-center gap-2">
            <Icon name="mdi:check-circle-outline" aria-hidden="true" />
            <span>Actifs</span>
          </div>
          <div class="mt-2 text-2xl font-extrabold tracking-tight">{{ stats.active }}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="text-xs text-muted flex items-center gap-2">
            <Icon name="mdi:file-document-edit-outline" aria-hidden="true" />
            <span>Brouillons</span>
          </div>
          <div class="mt-2 text-2xl font-extrabold tracking-tight">{{ stats.draft }}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="text-xs text-muted flex items-center gap-2">
            <Icon name="mdi:archive-outline" aria-hidden="true" />
            <span>Archivés</span>
          </div>
          <div class="mt-2 text-2xl font-extrabold tracking-tight">{{ stats.archived }}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="text-xs text-muted flex items-center gap-2">
            <Icon name="mdi:trash-can-outline" aria-hidden="true" />
            <span>Corbeille</span>
          </div>
          <div class="mt-2 text-2xl font-extrabold tracking-tight">{{ stats.trash }}</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="card-body grid gap-4 md:grid-cols-6">
        <div class="md:col-span-3">
          <label class="text-xs font-medium text-muted mb-1.5 block">Recherche</label>
          <div class="relative">
            <Icon name="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input v-model="q" class="input w-full pl-10" placeholder="Titre, slug…" />
          </div>
        </div>

        <div class="md:col-span-2">
          <label class="text-xs font-medium text-muted mb-1.5 block">Statut</label>
          <select v-model="statusFilter" class="input w-full">
            <option value="all">Tous</option>
            <option value="draft">Brouillon</option>
            <option value="active">Actif</option>
            <option value="archived">Archivé</option>
          </select>
        </div>

        <div class="md:col-span-1 flex items-end">
          <label class="flex items-center gap-2 select-none cursor-pointer text-sm">
            <input type="checkbox" v-model="trashed" class="checkbox" />
            <span class="text-muted">Corbeille</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Create -->
    <div v-if="showCreate" class="card border-2 border-primary">
      <div class="card-body space-y-4">
        <div class="flex items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="font-semibold flex items-center gap-2">
              <Icon name="mdi:rocket-launch-outline" aria-hidden="true" />
              <span>Créer un projet</span>
            </div>
            <p class="text-xs text-muted">Un titre suffit pour démarrer. Tu pourras compléter ensuite.</p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-6">
          <div class="md:col-span-3">
            <label class="text-xs font-medium text-muted mb-1.5 block">Titre *</label>
            <input v-model="form.title" class="input w-full" placeholder="ex. Les derniers léopards" />
          </div>

          <div class="md:col-span-2">
            <label class="text-xs font-medium text-muted mb-1.5 block">Slug (optionnel)</label>
            <input v-model="form.slug" class="input w-full font-mono" placeholder="les-derniers-leopards" />
          </div>

          <div class="md:col-span-1">
            <label class="text-xs font-medium text-muted mb-1.5 block">Statut</label>
            <select v-model="form.status" class="input w-full">
              <option value="draft">Brouillon</option>
              <option value="active">Actif</option>
              <option value="archived">Archivé</option>
            </select>
          </div>

          <div class="md:col-span-6">
            <label class="text-xs font-medium text-muted mb-1.5 block">Logline (optionnel)</label>
            <textarea v-model="form.logline" class="input w-full min-h-24" placeholder="Une phrase pour cadrer le projet…" />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2">
          <button class="btn btn-ghost focus-ring" :disabled="creating" @click="showCreate = false">Annuler</button>
          <button class="btn btn-primary focus-ring gap-2" :disabled="creating || !form.title.trim()" @click="createProject">
            <Icon name="mdi:content-save" aria-hidden="true" />
            {{ creating ? 'Création…' : 'Créer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Errors -->
    <div v-if="error" class="card border border-red-500/40 bg-red-500/10">
      <div class="card-body flex items-start gap-3 text-sm">
        <Icon name="mdi:alert-circle" class="mt-0.5 text-red-600" aria-hidden="true" />
        <div class="text-red-700 dark:text-red-300">
          <div class="font-semibold">Impossible de charger les projets</div>
          <div class="opacity-90">{{ error?.statusMessage || error }}</div>
        </div>
      </div>
    </div>

    <!-- List -->
    <div class="card overflow-hidden">
      <div class="card-body flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div class="text-sm text-muted">
          <span v-if="pending" class="inline-flex items-center gap-2">
            <Icon name="mdi:loading" class="animate-spin" aria-hidden="true" />
            Chargement…
          </span>
          <span v-else>
            {{ totalProjects }} projet(s){{ trashed ? ' (corbeille incluse)' : '' }}
            <span v-if="totalPages > 1">— Page {{ currentPage }} / {{ totalPages }}</span>
          </span>
        </div>
      </div>

      <div v-if="paginatedProjects.length" class="card-body pt-0">
        <div v-for="(projects, saga) in groupedProjects" :key="saga" class="space-y-4 mb-10 last:mb-0">
          <div class="flex items-center gap-2 pt-6 border-t border-border first:border-t-0 first:pt-0">
            <Icon name="mdi:bookmark-multiple-outline" class="text-muted" aria-hidden="true" />
            <h2 class="text-base font-extrabold tracking-tight">{{ saga }}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NuxtLink
              v-for="p in projects"
              :key="p.slug"
              class="card hover:shadow-lg hover:bg-surface2 focus-ring transition-colors"
              :to="projectTo(p)"
              :class="p.deleted_at ? 'pointer-events-none opacity-60' : ''"
            >
              <div class="card-body">
                <div class="flex items-center gap-2 flex-wrap mb-3">
                  <span class="badge badge-primary">{{ p.type || 'Projet' }}</span>
                  <span :class="statusBadgeClass(p.status)">{{ statusLabel(p.status) }}</span>
                  <span v-if="p.deleted_at" class="badge">Corbeille</span>
                </div>

                <div class="font-extrabold text-xl leading-tight">
                  {{ i18nOr(`projects.titles.${p.slug}`, p.title) }}
                </div>

                <div class="mt-2 space-y-1">
                  <div v-if="p.title_en" class="text-xs text-muted">{{ i18nOr(`projects.titles_en.${p.slug}`, p.title_en) }}</div>
                  <div v-if="p.title_pt" class="text-xs text-muted">{{ i18nOr(`projects.titles_pt.${p.slug}`, p.title_pt) }}</div>
                </div>

                <div v-if="p.logline" class="text-sm text-muted mt-3 line-clamp-2">
                  {{ i18nOr(`projects.loglines.${p.slug}`, p.logline) }}
                </div>

                <div class="flex items-center justify-between pt-3 mt-4 border-t border-border text-xs text-muted">
                  <span class="font-mono">{{ p.slug }}</span>
                  <span v-if="p.updated_at">
                    <Icon name="mdi:clock-outline" class="inline-block -mt-0.5 mr-1" aria-hidden="true" />
                    {{ new Date(p.updated_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }) }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="card-body text-muted">
        <div class="flex items-start gap-3">
          <Icon name="mdi:folder-search-outline" class="text-2xl" aria-hidden="true" />
          <div>
            <div class="font-semibold text-foreground">Aucun projet</div>
            <div class="text-sm text-muted mt-1">Ajuste les filtres ou crée un nouveau projet.</div>
          </div>
        </div>
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
