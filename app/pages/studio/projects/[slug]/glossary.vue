<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))

const q = ref('')
const lang = ref('')
const creating = ref(false)

const queryObj = computed(() => ({
  q: q.value?.trim() || undefined,
  lang: lang.value?.trim() || undefined,
}))

const { data, pending, refresh, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/glossary`,
  { query: queryObj, credentials: 'include' }
)

const form = reactive({
  term: '',
  slug: '',
  language: '',
  definition: '',
  usage_notes: '',
})

function termKey(t) {
  return t?.id ?? t?.slug ?? t?.term ?? t?.name
}

function termLabel(t) {
  return t?.term || t?.name || t?.title || t?.slug || `Term ${termKey(t)}`
}

function termLanguage(t) {
  return t?.language || t?.lang || t?.locale || ''
}

function termDefinition(t) {
  return t?.definition || t?.description || t?.meaning || ''
}

function termUsage(t) {
  return t?.usage_notes || t?.notes || t?.usage_note || ''
}

async function createTerm() {
  if (!form.term.trim()) return
  creating.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/glossary`, {
      method: 'POST',
      credentials: 'include',
      body: {
        term: form.term,
        slug: form.slug || undefined,
        language: form.language || undefined,
        definition: form.definition || undefined,
        usage_notes: form.usage_notes || undefined,
      },
    })
    form.term = ''
    form.slug = ''
    form.language = ''
    form.definition = ''
    form.usage_notes = ''
    await refresh()
  } finally {
    creating.value = false
  }
}

const editingId = ref(null)
const editForm = reactive({
  term: '',
  slug: '',
  language: '',
  definition: '',
  usage_notes: '',
})

function startEdit(t) {
  editingId.value = termKey(t)
  editForm.term = termLabel(t)
  editForm.slug = t?.slug || ''
  editForm.language = termLanguage(t)
  editForm.definition = termDefinition(t)
  editForm.usage_notes = termUsage(t)
}

function cancelEdit() {
  editingId.value = null
  editForm.term = ''
  editForm.slug = ''
  editForm.language = ''
  editForm.definition = ''
  editForm.usage_notes = ''
}

async function saveEdit() {
  if (!editingId.value || !editForm.term.trim()) return
  await $fetch(`/api/projects/${projectSlug.value}/glossary/${editingId.value}`, {
    method: 'PUT',
    credentials: 'include',
    body: {
      term: editForm.term,
      slug: editForm.slug || undefined,
      language: editForm.language || undefined,
      definition: editForm.definition || undefined,
      usage_notes: editForm.usage_notes || undefined,
    },
  })
  await refresh()
  cancelEdit()
}

async function deleteTerm(t) {
  if (!confirm(`Delete term "${termLabel(t)}"?`)) return
  await $fetch(`/api/projects/${projectSlug.value}/glossary/${termKey(t)}`, {
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
        <h1 class="text-xl font-semibold">Glossary</h1>
        <p class="text-sm text-muted">Lexique et concepts clés.</p>
      </div>
    </div>

    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-6">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Search</label>
          <input v-model="q" class="input w-full" placeholder="term / slug / definition…" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Language</label>
          <input v-model="lang" class="input w-full" placeholder="fr / en / kg…" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">Term</label>
          <input v-model="form.term" class="input w-full" placeholder="Ex: Mbanda" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Slug (optional)</label>
          <input v-model="form.slug" class="input w-full" placeholder="mbanda" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">Language (optional)</label>
          <input v-model="form.language" class="input w-full" placeholder="kikongo" />
        </div>

        <div class="md:col-span-6">
          <label class="text-xs text-muted">Definition</label>
          <textarea v-model="form.definition" class="input w-full min-h-24" />
        </div>

        <div class="md:col-span-6">
          <label class="text-xs text-muted">Usage notes</label>
          <textarea v-model="form.usage_notes" class="input w-full min-h-20" />
        </div>

        <div class="md:col-span-6">
          <button class="btn btn-primary w-full focus-ring" :disabled="creating" @click="createTerm">
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
          <span v-else>{{ data?.terms?.length || 0 }} term(s)</span>
        </div>
      </div>

      <div class="divide-y divide-border">
        <div
          v-for="t in (data?.terms || [])"
          :key="termKey(t)"
          class="flex items-start justify-between gap-3 p-4 hover:bg-surface2"
        >
          <div class="min-w-0">
            <div class="font-extrabold">{{ termLabel(t) }}</div>
            <div class="text-xs text-muted mt-1">
              <span v-if="t.slug">{{ t.slug }}</span>
              <span v-if="termLanguage(t)" class="ml-2 badge">{{ termLanguage(t) }}</span>
            </div>
            <div v-if="termDefinition(t)" class="text-sm text-muted mt-1">{{ termDefinition(t) }}</div>
            <div v-if="termUsage(t)" class="text-xs text-muted mt-1">{{ termUsage(t) }}</div>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-ghost focus-ring" @click="startEdit(t)">
              <Icon name="mdi:pencil-outline" aria-hidden="true" />
            </button>
            <button class="btn btn-ghost focus-ring" @click="deleteTerm(t)">
              <Icon name="mdi:trash-can-outline" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="editingId" class="card bg-surface2">
      <div class="card-body grid gap-3 md:grid-cols-6">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Term</label>
          <input v-model="editForm.term" class="input w-full" />
        </div>
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Slug</label>
          <input v-model="editForm.slug" class="input w-full" />
        </div>
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Language</label>
          <input v-model="editForm.language" class="input w-full" />
        </div>
        <div class="md:col-span-6">
          <label class="text-xs text-muted">Definition</label>
          <textarea v-model="editForm.definition" class="input w-full min-h-24" />
        </div>
        <div class="md:col-span-6">
          <label class="text-xs text-muted">Usage notes</label>
          <textarea v-model="editForm.usage_notes" class="input w-full min-h-20" />
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
