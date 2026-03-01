<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useLocalePath, useRequestHeaders, useI18n } from '#imports'

const props = defineProps({
  apiBase: { type: String, required: true }, // ex: /api/projects/slug/characters ou /api/projects/slug/books/bookSlug/characters
  toBase: { type: String, required: true }, // ex: /studio/projects/slug/characters ou /studio/projects/slug/books/bookSlug/characters
  contextLabel: { type: String, default: 'Characters' },
  backTo: { type: String, default: '' },
  backLabel: { type: String, default: 'Back' },
})

const { t } = useI18n()
const localePath = useLocalePath()
const q = ref('')
const trashed = ref(false)
const creating = ref(false)
const showCreateForm = ref(false)
const form = reactive({ name: '', slug: '', description: '' })
const currentPage = ref(1)
const pageSize = 12

const queryObj = computed(() => ({
  q: q.value?.trim() || undefined,
  trashed: trashed.value ? 1 : undefined,
}))

const { data, pending, refresh, error } = await useFetch(
  () => `${props.apiBase}`,
  { $fetch: apiFetch, query: queryObj, credentials: 'include', headers: useRequestHeaders(['cookie']) }
)

const allCharacters = computed(() => data.value?.characters || [])
const totalItems = computed(() => allCharacters.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize)))

const paginatedCharacters = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return allCharacters.value.slice(start, end)
})

watch([q, trashed], () => {
  currentPage.value = 1
})

async function createCharacter() {
  if (!form.name.trim()) return
  creating.value = true
  try {
    await apiFetch(`${props.apiBase}`, {
      method: 'POST',
      body: {
        name: form.name,
        slug: form.slug || undefined,
        description: form.description || undefined,
      },
    })
    form.name = ''
    form.slug = ''
    form.description = ''
    showCreateForm.value = false
    await refresh()
  } finally {
    creating.value = false
  }
}

function handlePageChange(page) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function softDelete(c) {
  if (!confirm(`Delete character "${c.name}"?`)) return
  await apiFetch(`${props.apiBase}/${c.slug}`, {
    method: 'DELETE',
  })
  await refresh()
}

async function restore(c) {
  await apiFetch(`${props.apiBase}/restore`, {
    method: 'POST',
    body: { slug: c.slug },
  })
  await refresh()
}

function characterTo(c) {
  const base = `${props.toBase}/${c.slug}`
  return trashed.value ? localePath(`${base}?trashed=1`) : localePath(base)
}
</script>

<template>
  <div class="page space-y-6">
    <NuxtLink v-if="props.backTo" class="text-sm text-muted hover:opacity-100" :to="localePath(props.backTo)">
      ← {{ props.backLabel }}
    </NuxtLink>
    
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">{{ props.contextLabel }}</h1>
        <p class="text-sm text-muted mt-1">{{ t('characters.listSubtitle', 'Manage your characters') }}</p>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="card">
      <div class="card-body">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label class="text-xs font-medium text-muted mb-1.5 block">{{ t('characters.search', 'Search') }}</label>
            <input v-model="q" class="input w-full" :placeholder="t('characters.searchPlaceholder', 'Name or slug...')" />
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-2 select-none cursor-pointer">
              <input type="checkbox" v-model="trashed" class="checkbox" />
              <span class="text-sm">{{ t('characters.showTrashed', 'Show trashed') }}</span>
            </label>
          </div>
          <div class="flex items-end justify-end">
            <button 
              class="btn btn-primary focus-ring gap-2" 
              @click="showCreateForm = !showCreateForm"
            >
              <Icon :name="showCreateForm ? 'mdi:close' : 'mdi:plus'" aria-hidden="true" />
              {{ showCreateForm ? t('common.cancel', 'Cancel') : t('characters.newCharacter', 'New Character') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Form Card (collapsible) -->
    <div v-if="showCreateForm" class="card border-2 border-primary">
      <div class="card-body">
        <h3 class="font-semibold mb-4">{{ t('characters.createNew', 'Create New Character') }}</h3>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label class="text-xs font-medium text-muted mb-1.5 block">{{ t('characters.name', 'Name') }} *</label>
            <input v-model="form.name" class="input w-full" placeholder="e.g. Kinuani" />
          </div>
          <div>
            <label class="text-xs font-medium text-muted mb-1.5 block">{{ t('characters.slug', 'Slug') }}</label>
            <input v-model="form.slug" class="input w-full" placeholder="kinuani" />
          </div>
          <div>
            <label class="text-xs font-medium text-muted mb-1.5 block">{{ t('characters.description', 'Description') }}</label>
            <input v-model="form.description" class="input w-full" :placeholder="t('characters.descPlaceholder', 'Short description...')" />
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button 
            class="btn btn-primary focus-ring" 
            :disabled="creating || !form.name.trim()" 
            @click="createCharacter"
          >
            <Icon name="mdi:content-save" aria-hidden="true" />
            {{ t('common.create', 'Create') }}
          </button>
          <button 
            class="btn btn-ghost focus-ring" 
            :disabled="creating" 
            @click="showCreateForm = false"
          >
            {{ t('common.cancel', 'Cancel') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-error">
      {{ t('common.error', 'Error') }}: {{ error?.statusMessage || error }}
    </div>

    <!-- Characters Grid -->
    <div v-if="pending" class="text-center py-12 text-muted">
      <Icon name="mdi:loading" class="animate-spin text-2xl" aria-hidden="true" />
      <p class="mt-2">{{ t('common.loading', 'Loading') }}...</p>
    </div>

    <div v-else-if="allCharacters.length === 0" class="card">
      <div class="card-body text-center py-12">
        <Icon name="mdi:account-question" class="text-4xl text-muted mb-3" aria-hidden="true" />
        <p class="text-muted">{{ t('characters.noCharacters', 'No characters found') }}</p>
        <button 
          class="btn btn-primary mt-4 focus-ring" 
          @click="showCreateForm = true"
        >
          <Icon name="mdi:plus" aria-hidden="true" />
          {{ t('characters.createFirst', 'Create your first character') }}
        </button>
      </div>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="c in paginatedCharacters"
          :key="c.slug"
          class="card hover:shadow-lg transition-shadow duration-200 group"
          :to="characterTo(c)"
        >
          <div class="card-body">
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                  {{ c.name }}
                </h3>
                <p class="text-xs text-muted mt-1">{{ c.slug }}</p>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0">
                <span v-if="c.deleted_at" class="badge badge-error text-xs">
                  {{ t('common.trashed', 'Trashed') }}
                </span>
                <button
                  v-if="!c.deleted_at"
                  class="btn btn-ghost btn-sm focus-ring opacity-0 group-hover:opacity-100 transition-opacity"
                  @click.prevent.stop="softDelete(c)"
                  :title="t('common.delete', 'Delete')"
                >
                  <Icon name="mdi:trash-can-outline" aria-hidden="true" />
                </button>
                <button
                  v-else
                  class="btn btn-ghost btn-sm focus-ring"
                  @click.prevent.stop="restore(c)"
                  :title="t('common.restore', 'Restore')"
                >
                  <Icon name="mdi:backup-restore" aria-hidden="true" />
                </button>
              </div>
            </div>
            
            <p v-if="c.description" class="text-sm text-muted line-clamp-2 mb-3">
              {{ c.description }}
            </p>
            <p v-else class="text-sm text-muted italic mb-3">
              {{ t('characters.noDescription', 'No description yet') }}
            </p>

            <div class="flex items-center justify-between text-xs text-muted pt-3 border-t border-border">
              <span>{{ t('characters.viewDetails', 'View details') }}</span>
              <Icon name="mdi:arrow-right" class="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div class="mt-8">
        <AppPagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          :totalItems="totalItems"
          :pageSize="pageSize"
          @pageChange="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>
