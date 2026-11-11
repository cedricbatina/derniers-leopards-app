<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref } from 'vue'
import { useLocalePath, useRequestHeaders } from '#imports'

const localePath = useLocalePath()
const { t } = useI18n()
const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))

const q = ref('')
const creating = ref(false)

const queryObj = computed(() => ({
  q: q.value?.trim() || undefined,
}))

const { data, pending, refresh, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/timeline`,
  { $fetch: apiFetch, query: queryObj, credentials: 'include', headers: useRequestHeaders(['cookie']) }
)

const canManage = computed(() => data.value?.can_manage !== false)

const form = reactive({
  title: '',
  slug: '',
  date_start: '',
  date_end: '',
  description: '',
})

function eventKey(e) {
  return e?.id ?? e?.slug
}

function eventTitle(e) {
  return e?.title || e?.name || e?.label || e?.event || e?.slug || t('studio.timeline.untitled', { id: eventKey(e) })
}

function eventDesc(e) {
  return e?.description || e?.summary || e?.note || ''
}

function eventStart(e) {
  return e?.date_start || e?.start_date || e?.in_story_date_start || e?.event_date || e?.date || ''
}

function eventEnd(e) {
  return e?.date_end || e?.end_date || e?.in_story_date_end || ''
}

async function createEvent() {
  if (!form.title.trim()) return
  creating.value = true
  try {
    await apiFetch(`/api/projects/${projectSlug.value}/timeline`, {
      method: 'POST',
      body: {
        title: form.title,
        slug: form.slug || undefined,
        date_start: form.date_start || undefined,
        date_end: form.date_end || undefined,
        description: form.description || undefined,
      },
    })
    form.title = ''
    form.slug = ''
    form.date_start = ''
    form.date_end = ''
    form.description = ''
    await refresh()
  } finally {
    creating.value = false
  }
}

const editingId = ref(null)
const editForm = reactive({
  title: '',
  slug: '',
  date_start: '',
  date_end: '',
  description: '',
})

function startEdit(e) {
  editingId.value = eventKey(e)
  editForm.title = eventTitle(e)
  editForm.slug = e?.slug || ''
  editForm.date_start = eventStart(e) || ''
  editForm.date_end = eventEnd(e) || ''
  editForm.description = eventDesc(e) || ''
}

function cancelEdit() {
  editingId.value = null
  editForm.title = ''
  editForm.slug = ''
  editForm.date_start = ''
  editForm.date_end = ''
  editForm.description = ''
}

async function saveEdit() {
  if (!editingId.value || !editForm.title.trim()) return
  await apiFetch(`/api/projects/${projectSlug.value}/timeline/${editingId.value}`, {
    method: 'PUT',
    body: {
      title: editForm.title,
      slug: editForm.slug || undefined,
      date_start: editForm.date_start || undefined,
      date_end: editForm.date_end || undefined,
      description: editForm.description || undefined,
    },
  })
  await refresh()
  cancelEdit()
}

async function deleteEvent(e) {
  if (!confirm(t('studio.timeline.deleteConfirm', { title: eventTitle(e) }))) return
  await apiFetch(`/api/projects/${projectSlug.value}/timeline/${eventKey(e)}`, {
    method: 'DELETE',
  })
  await refresh()
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink class="text-sm text-muted hover:opacity-100" :to="localePath(`/studio/projects/${projectSlug}`)">
      ← {{ t('studio.timeline.backToProject') }}
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">{{ t('domain.timeline.plural') }}</h1>
        <p class="text-sm text-muted">{{ t('studio.timeline.subtitle') }}</p>
      </div>
    </div>

    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-6">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">{{ t('common.search') }}</label>
          <input v-model="q" class="input w-full" :placeholder="t('studio.timeline.searchPlaceholder')" />
        </div>
      </div>
    </div>

    <div v-if="canManage" class="card">
      <div class="card-body grid gap-3 md:grid-cols-6">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">{{ t('studio.timeline.title') }}</label>
          <input v-model="form.title" class="input w-full" placeholder="Ex: Bataille de Mbuila" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">{{ t('studio.timeline.startDate') }}</label>
          <input v-model="form.date_start" type="date" class="input w-full" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">{{ t('studio.timeline.endDate') }}</label>
          <input v-model="form.date_end" type="date" class="input w-full" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">{{ t('studio.timeline.slugOptional') }}</label>
          <input v-model="form.slug" class="input w-full" placeholder="mbuila-1665" />
        </div>

        <div class="md:col-span-6">
          <label class="text-xs text-muted">{{ t('domain.scene.description') }}</label>
          <textarea v-model="form.description" class="input w-full min-h-24" />
        </div>

        <div class="md:col-span-6">
          <button class="btn btn-primary w-full focus-ring" :disabled="creating" @click="createEvent">
            <Icon name="mdi:plus" aria-hidden="true" />
            {{ t('common.create') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="card">
      <div class="card-body text-sm">{{ t('common.error') }}: {{ error?.statusMessage || error }}</div>
    </div>

    <div class="card overflow-hidden">
      <div class="card-body flex items-center justify-between">
        <div class="text-sm text-muted">
          <span v-if="pending">{{ t('common.loading') }}</span>
          <span v-else>{{ t('studio.timeline.count', { count: data?.events?.length || 0 }) }}</span>
        </div>
      </div>

      <div class="divide-y divide-border">
        <div
          v-for="e in (data?.events || [])"
          :key="eventKey(e)"
          class="flex items-start justify-between gap-3 p-4 hover:bg-surface2"
        >
          <div class="min-w-0">
            <div class="font-extrabold">{{ eventTitle(e) }}</div>
            <div class="text-xs text-muted mt-1">
              <span v-if="eventStart(e) || eventEnd(e)">
                {{ eventStart(e) || '—' }} → {{ eventEnd(e) || '—' }}
              </span>
            </div>
            <div v-if="eventDesc(e)" class="text-sm text-muted mt-1">{{ eventDesc(e) }}</div>
          </div>

          <div v-if="canManage" class="flex items-center gap-2">
            <button class="btn btn-ghost focus-ring" @click="startEdit(e)">
              <Icon name="mdi:pencil-outline" aria-hidden="true" />
            </button>
            <button class="btn btn-ghost focus-ring" @click="deleteEvent(e)">
              <Icon name="mdi:trash-can-outline" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="canManage && editingId" class="card bg-surface2">
      <div class="card-body grid gap-3 md:grid-cols-6">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">{{ t('studio.timeline.title') }}</label>
          <input v-model="editForm.title" class="input w-full" />
        </div>
        <div class="md:col-span-2">
          <label class="text-xs text-muted">{{ t('characters.slug') }}</label>
          <input v-model="editForm.slug" class="input w-full" />
        </div>
        <div class="md:col-span-1">
          <label class="text-xs text-muted">{{ t('studio.timeline.startDate') }}</label>
          <input v-model="editForm.date_start" type="date" class="input w-full" />
        </div>
        <div class="md:col-span-1">
          <label class="text-xs text-muted">{{ t('studio.timeline.endDate') }}</label>
          <input v-model="editForm.date_end" type="date" class="input w-full" />
        </div>
        <div class="md:col-span-6">
          <label class="text-xs text-muted">{{ t('domain.scene.description') }}</label>
          <textarea v-model="editForm.description" class="input w-full min-h-24" />
        </div>
        <div class="md:col-span-6 flex gap-2">
          <button class="btn btn-primary focus-ring" @click="saveEdit">
            <Icon name="mdi:content-save-outline" aria-hidden="true" />
            {{ t('common.save') }}
          </button>
          <button class="btn btn-ghost focus-ring" @click="cancelEdit">
            {{ t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
