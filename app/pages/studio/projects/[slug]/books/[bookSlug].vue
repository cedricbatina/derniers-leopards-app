<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref, watchEffect } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()

const projectSlug = computed(() => String(route.params.slug || ''))
const bookSlug = computed(() => String(route.params.bookSlug || ''))
const allowTrashed = computed(() => String(route.query.trashed || '') === '1')

const { data, pending, refresh, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/books/${bookSlug.value}`,
  {
    query: computed(() => ({ trashed: allowTrashed.value ? 1 : undefined })),
    credentials: 'include',
  }
)

const { data: charsData } = await useFetch(
  () => `/api/projects/${projectSlug.value}/characters`,
  { credentials: 'include' }
)

const saving = ref(false)
const deleting = ref(false)
const restoring = ref(false)

const form = reactive({
  title: '',
  subtitle: '',
  subtitle_en: '',
  subtitle_pt: '',
  summary: '',
  narrator_character_ids: [],
})

watchEffect(() => {
  const b = data.value?.book
  if (!b) return
  form.title = b.title || ''
  form.subtitle = b.subtitle || ''
  form.subtitle_en = b.subtitle_en || ''
  form.subtitle_pt = b.subtitle_pt || ''
  form.summary = b.summary || ''
  form.narrator_character_ids = (data.value?.narrators || []).map((n) => n.id)
})

const narratorSet = computed(() => new Set(form.narrator_character_ids.map((x) => Number(x))))
const characters = computed(() => charsData.value?.characters || [])

function toggleNarrator (id) {
  id = Number(id)
  const set = new Set(form.narrator_character_ids.map((x) => Number(x)))
  if (set.has(id)) set.delete(id)
  else set.add(id)
  form.narrator_character_ids = [...set]
}

async function save () {
  saving.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/books/${bookSlug.value}`, {
      method: 'PUT',
      credentials: 'include',
      body: {
        title: form.title,
        subtitle: form.subtitle || null,
        subtitle_en: form.subtitle_en || null,
        subtitle_pt: form.subtitle_pt || null,
        summary: form.summary || null,
        narrator_character_ids: form.narrator_character_ids,
      },
    })
    await refresh()
  } finally {
    saving.value = false
  }
}

async function removeBook () {
  if (!confirm('Delete this book?')) return
  deleting.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/books/${bookSlug.value}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    await navigateTo(localePath(`/studio/projects/${projectSlug.value}/books`))
  } finally {
    deleting.value = false
  }
}

async function restoreBook () {
  restoring.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/books/${bookSlug.value}/restore`, {
      method: 'POST',
      credentials: 'include',
    })
    // drop trashed param after restore
    await navigateTo(localePath(`/studio/projects/${projectSlug.value}/books/${bookSlug.value}`))
  } finally {
    restoring.value = false
  }
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink class="text-sm text-muted hover:opacity-100" :to="localePath(`/studio/projects/${projectSlug}/books`)">
      ← Back to books
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Book</h1>
        <p class="text-sm text-muted">Slug is immutable: <span class="font-mono">{{ bookSlug }}</span></p>
      </div>

      <div class="flex gap-2">
        <button class="btn btn-primary focus-ring" :disabled="saving || pending" @click="save">
          <Icon name="mdi:content-save-outline" aria-hidden="true" />
          Save
        </button>

        <button
          v-if="data?.book?.deleted_at"
          class="btn btn-ghost focus-ring"
          :disabled="restoring"
          @click="restoreBook"
        >
          <Icon name="mdi:backup-restore" aria-hidden="true" />
          Restore
        </button>

        <button
          v-else
          class="btn btn-ghost focus-ring"
          :disabled="deleting"
          @click="removeBook"
        >
          <Icon name="mdi:trash-can-outline" aria-hidden="true" />
          Delete
        </button>
      </div>
    </div>

    <div v-if="error" class="card">
      <div class="card-body text-sm">
        Error: {{ error?.statusMessage || error }}
      </div>
    </div>

    <div v-else class="card">
      <div class="card-body grid gap-3 md:grid-cols-2">
        <div>
          <label class="text-xs text-muted">Title</label>
          <input v-model="form.title" class="input w-full" />
        </div>

        <div>
          <label class="text-xs text-muted">Subtitle</label>
          <input v-model="form.subtitle" class="input w-full" />
        </div>

        <div>
          <label class="text-xs text-muted">Subtitle EN</label>
          <input v-model="form.subtitle_en" class="input w-full" />
        </div>

        <div>
          <label class="text-xs text-muted">Subtitle PT</label>
          <input v-model="form.subtitle_pt" class="input w-full" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">Summary</label>
          <textarea v-model="form.summary" class="input w-full min-h-28" />
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-extrabold">Narrators</div>
            <div class="text-xs text-muted">Book narrators (link to Characters).</div>
          </div>
          <div class="text-xs text-muted">{{ form.narrator_character_ids.length }} selected</div>
        </div>

        <div v-if="!characters.length" class="text-sm text-muted">
          No characters yet.
        </div>

        <div v-else class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <label
            v-for="c in characters"
            :key="c.id"
            class="flex items-center gap-2 p-2 rounded-xl border border-border hover:bg-surface2 cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="narratorSet.has(c.id)"
              @change="toggleNarrator(c.id)"
            />
            <div>
              <div class="text-sm font-semibold">{{ c.name }}</div>
              <div class="text-xs text-muted">{{ c.slug }}</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>