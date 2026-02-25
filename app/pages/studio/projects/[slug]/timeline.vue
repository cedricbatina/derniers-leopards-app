<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))

const q = ref('')
const creating = ref(false)

const queryObj = computed(() => ({
  q: q.value?.trim() || undefined,
}))

const { data, pending, refresh, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/timeline`,
  { query: queryObj, credentials: 'include' }
)

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
  return e?.title || e?.name || e?.label || e?.event || e?.slug || `Event ${eventKey(e)}`
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
    await $fetch(`/api/projects/${projectSlug.value}/timeline`, {
      method: 'POST',
      credentials: 'include',
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
  await $fetch(`/api/projects/${projectSlug.value}/timeline/${editingId.value}`, {
    method: 'PUT',
    credentials: 'include',
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
  if (!confirm(`Delete event "${eventTitle(e)}"?`)) return
  await $fetch(`/api/projects/${projectSlug.value}/timeline/${eventKey(e)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  await refresh()
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink class="text-sm text-muted hover:opacity-100" :to="localePath(`/studio/projects/${projectSlug}`)">
      ← Back to project
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Timeline</h1>
        <p class="text-sm text-muted">Événements clés et dates.</p>
      </div>
    </div>

    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-6">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Search</label>
          <input v-model="q" class="input w-full" placeholder="title / slug / description…" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">Title</label>
          <input v-model="form.title" class="input w-full" placeholder="Ex: Bataille de Mbuila" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Start date</label>
          <input v-model="form.date_start" type="date" class="input w-full" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">End date</label>
          <input v-model="form.date_end" type="date" class="input w-full" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">Slug (optional)</label>
          <input v-model="form.slug" class="input w-full" placeholder="mbuila-1665" />
        </div>

        <div class="md:col-span-6">
          <label class="text-xs text-muted">Description</label>
          <textarea v-model="form.description" class="input w-full min-h-24" />
        </div>

        <div class="md:col-span-6">
          <button class="btn btn-primary w-full focus-ring" :disabled="creating" @click="createEvent">
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
          <span v-else>{{ data?.events?.length || 0 }} event(s)</span>
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

          <div class="flex items-center gap-2">
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

    <div v-if="editingId" class="card bg-surface2">
      <div class="card-body grid gap-3 md:grid-cols-6">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Title</label>
          <input v-model="editForm.title" class="input w-full" />
        </div>
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Slug</label>
          <input v-model="editForm.slug" class="input w-full" />
        </div>
        <div class="md:col-span-1">
          <label class="text-xs text-muted">Start date</label>
          <input v-model="editForm.date_start" type="date" class="input w-full" />
        </div>
        <div class="md:col-span-1">
          <label class="text-xs text-muted">End date</label>
          <input v-model="editForm.date_end" type="date" class="input w-full" />
        </div>
        <div class="md:col-span-6">
          <label class="text-xs text-muted">Description</label>
          <textarea v-model="editForm.description" class="input w-full min-h-24" />
        </div>
        <div class="md:col-span-6 flex gap-2">
          <button class="btn btn-primary focus-ring" @click="saveEdit">
            <Icon name="mdi:content-save-outline" aria-hidden="true" />
            Save
          </button>
          <button class="btn btn-ghost focus-ring" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
