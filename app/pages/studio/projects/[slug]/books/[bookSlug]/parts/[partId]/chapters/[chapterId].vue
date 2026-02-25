<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref, watchEffect } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()

const projectSlug = computed(() => String(route.params.slug || ''))
const bookSlug = computed(() => String(route.params.bookSlug || ''))
const partId = computed(() => Number(route.params.partId))
const chapterId = computed(() => Number(route.params.chapterId))

const { data, pending, refresh, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${partId.value}/chapters/${chapterId.value}`,
  { credentials: 'include' }
)

const { data: charactersData } = await useFetch(
  () => `/api/projects/${projectSlug.value}/characters`,
  { credentials: 'include' }
)

const characters = computed(() => charactersData.value?.characters || [])

const saving = ref(false)
const deleting = ref(false)

const form = reactive({
  chapter_no: '',
  title: '',
  summary: '',
  pov_character_id: '',
  in_story_date_start: '',
  in_story_date_end: '',
  objective: '',
  cliffhanger: '',
  word_target: '',
  indesign_master: '',
})

watchEffect(() => {
  const ch = data.value?.chapter
  if (!ch) return
  form.chapter_no = ch.chapter_no ? String(ch.chapter_no) : ''
  form.title = ch.title || ''
  form.summary = ch.summary || ''
  form.pov_character_id = ch.pov_character_id ? String(ch.pov_character_id) : ''
  form.in_story_date_start = ch.in_story_date_start || ''
  form.in_story_date_end = ch.in_story_date_end || ''
  form.objective = ch.objective || ''
  form.cliffhanger = ch.cliffhanger || ''
  form.word_target = ch.word_target ? String(ch.word_target) : ''
  form.indesign_master = ch.indesign_master || ''
})

function characterLabel(c) {
  return c?.name ? `${c.name} (${c.slug})` : c?.slug || String(c?.id || '')
}

async function save() {
  if (!form.title.trim()) return
  saving.value = true
  try {
    await $fetch(
      `/api/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${partId.value}/chapters/${chapterId.value}`,
      {
        method: 'PUT',
        credentials: 'include',
        body: {
          chapter_no: form.chapter_no ? Number(form.chapter_no) : undefined,
          title: form.title,
          summary: form.summary || null,
          pov_character_id: form.pov_character_id ? Number(form.pov_character_id) : null,
          in_story_date_start: form.in_story_date_start || null,
          in_story_date_end: form.in_story_date_end || null,
          objective: form.objective || null,
          cliffhanger: form.cliffhanger || null,
          word_target: form.word_target ? Number(form.word_target) : null,
          indesign_master: form.indesign_master || null,
        },
      }
    )
    await refresh()
  } finally {
    saving.value = false
  }
}

async function removeChapter() {
  if (!confirm('Delete this chapter?')) return
  deleting.value = true
  try {
    await $fetch(
      `/api/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${partId.value}/chapters/${chapterId.value}`,
      { method: 'DELETE', credentials: 'include' }
    )
    await navigateTo(localePath(`/studio/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${partId.value}`))
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink
      class="text-sm text-muted hover:opacity-100"
      :to="localePath(`/studio/projects/${projectSlug}/books/${bookSlug}/parts/${partId}`)"
    >
      ← Back to part
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Chapter</h1>
        <p class="text-sm text-muted">ID: {{ chapterId }}</p>
      </div>

      <div class="flex gap-2">
        <button class="btn btn-primary focus-ring" :disabled="saving || pending" @click="save">
          <Icon name="mdi:content-save-outline" aria-hidden="true" />
          Save
        </button>
        <button class="btn btn-ghost focus-ring" :disabled="deleting" @click="removeChapter">
          <Icon name="mdi:trash-can-outline" aria-hidden="true" />
          Delete
        </button>
      </div>
    </div>

    <div v-if="error" class="card">
      <div class="card-body text-sm">Error: {{ error?.statusMessage || error }}</div>
    </div>

    <div class="card">
      <div class="card-body space-y-4">
        <div class="text-sm text-muted" v-if="pending">Loading…</div>

        <div class="grid gap-3 md:grid-cols-3">
          <div>
            <label class="text-xs text-muted">Chapter #</label>
            <input v-model="form.chapter_no" class="input w-full" />
          </div>
          <div class="md:col-span-2">
            <label class="text-xs text-muted">Title</label>
            <input v-model="form.title" class="input w-full" />
          </div>
        </div>

        <div>
          <label class="text-xs text-muted">Summary</label>
          <textarea v-model="form.summary" class="input w-full min-h-24" />
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          <div>
            <label class="text-xs text-muted">POV</label>
            <select v-model="form.pov_character_id" class="input w-full">
              <option value="">—</option>
              <option v-for="c in characters" :key="c.id" :value="String(c.id)">
                {{ characterLabel(c) }}
              </option>
            </select>
          </div>
          <div>
            <label class="text-xs text-muted">In-story start</label>
            <input v-model="form.in_story_date_start" type="date" class="input w-full" />
          </div>
          <div>
            <label class="text-xs text-muted">In-story end</label>
            <input v-model="form.in_story_date_end" type="date" class="input w-full" />
          </div>
        </div>

        <div>
          <label class="text-xs text-muted">Objective</label>
          <textarea v-model="form.objective" class="input w-full min-h-20" />
        </div>

        <div>
          <label class="text-xs text-muted">Cliffhanger</label>
          <textarea v-model="form.cliffhanger" class="input w-full min-h-20" />
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          <div>
            <label class="text-xs text-muted">Word target</label>
            <input v-model="form.word_target" class="input w-full" placeholder="ex: 1200" />
          </div>
          <div class="md:col-span-2">
            <label class="text-xs text-muted">InDesign master</label>
            <input v-model="form.indesign_master" class="input w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
