<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref, watchEffect } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()

const projectSlug = computed(() => String(route.params.slug || ''))
const sceneSlug = computed(() => String(route.params.sceneSlug || ''))
const allowTrashed = computed(() => String(route.query.trashed || '') === '1')

const sceneQuery = computed(() => ({ trashed: allowTrashed.value ? 1 : undefined }))

const { data, pending, refresh, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/scenes/${sceneSlug.value}`,
  { query: sceneQuery, credentials: 'include' }
)

const { data: chaptersData } = await useFetch(
  () => `/api/projects/${projectSlug.value}/chapters`,
  { credentials: 'include' }
)

const { data: charactersData } = await useFetch(
  () => `/api/projects/${projectSlug.value}/characters`,
  { credentials: 'include' }
)

const chapters = computed(() => chaptersData.value?.chapters || [])
const characters = computed(() => charactersData.value?.characters || [])

const saving = ref(false)
const deleting = ref(false)
const restoring = ref(false)

const form = reactive({
  chapter_id: '',
  scene_no: '',
  title: '',
  pov_character_id: '',
  time_of_day: '',
  objective: '',
  summary: '',
  content: '',
  conflict: '',
  turning_point: '',
  outcome: '',
  hook: '',
  indesign_style: '',
})

watchEffect(() => {
  const s = data.value?.scene
  if (!s) return
  form.chapter_id = s.chapter_id ? String(s.chapter_id) : ''
  form.scene_no = s.scene_no !== null && s.scene_no !== undefined ? String(s.scene_no) : ''
  form.title = s.title || ''
  form.pov_character_id = s.pov_character_id ? String(s.pov_character_id) : ''
  form.time_of_day = s.time_of_day || ''
  form.objective = s.objective || ''
  form.summary = s.summary || ''
  form.content = s.content || ''
  form.conflict = s.conflict || ''
  form.turning_point = s.turning_point || ''
  form.outcome = s.outcome || ''
  form.hook = s.hook || ''
  form.indesign_style = s.indesign_style || ''
})

const isTrashed = computed(() => !!data.value?.scene?.deleted_at)

function chapterLabel(id, chapterNo) {
  if (chapterNo !== null && chapterNo !== undefined) return `Chapter ${chapterNo}`
  return `Chapter #${id}`
}

function characterLabel(c) {
  return c?.name ? `${c.name} (${c.slug})` : c?.slug || String(c?.id || '')
}

async function save() {
  if (isTrashed.value) return
  if (!form.chapter_id) return

  saving.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/scenes/${sceneSlug.value}`, {
      method: 'PUT',
      credentials: 'include',
      body: {
        chapter_id: Number(form.chapter_id),
        scene_no: form.scene_no ? Number(form.scene_no) : null,
        title: form.title || null,
        pov_character_id: form.pov_character_id ? Number(form.pov_character_id) : null,
        time_of_day: form.time_of_day || null,
        objective: form.objective || null,
        summary: form.summary || '',
        content: form.content || null,
        conflict: form.conflict || null,
        turning_point: form.turning_point || null,
        outcome: form.outcome || null,
        hook: form.hook || null,
        indesign_style: form.indesign_style || null,
      },
    })
    await refresh()
  } finally {
    saving.value = false
  }
}

async function removeScene() {
  if (!confirm('Delete this scene?')) return
  deleting.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/scenes/${sceneSlug.value}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    await navigateTo(localePath(`/studio/projects/${projectSlug.value}/scenes`))
  } finally {
    deleting.value = false
  }
}

async function restoreScene() {
  restoring.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/scenes/${sceneSlug.value}/restore`, {
      method: 'POST',
      credentials: 'include',
    })
    await navigateTo(localePath(`/studio/projects/${projectSlug.value}/scenes/${sceneSlug.value}`))
  } finally {
    restoring.value = false
  }
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink
      class="text-sm text-muted hover:opacity-100"
      :to="localePath(`/studio/projects/${projectSlug}/scenes${allowTrashed ? '?trashed=1' : ''}`)"
    >
      ← Back to scenes
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Scene</h1>
        <p class="text-sm text-muted">{{ sceneSlug }}</p>
      </div>

      <div class="flex items-center gap-2">
        <span v-if="isTrashed" class="badge">trashed</span>

        <button
          v-if="!isTrashed"
          class="btn btn-ghost focus-ring"
          :disabled="deleting"
          @click="removeScene"
        >
          <Icon name="mdi:trash-can-outline" aria-hidden="true" />
          Delete
        </button>

        <button
          v-else
          class="btn btn-ghost focus-ring"
          :disabled="restoring"
          @click="restoreScene"
        >
          <Icon name="mdi:backup-restore" aria-hidden="true" />
          Restore
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
            <label class="text-xs text-muted">Chapter</label>
            <select v-model="form.chapter_id" class="input w-full" :disabled="isTrashed">
              <option value="">Select…</option>
              <option v-for="c in chapters" :key="c.id" :value="String(c.id)">
                {{ chapterLabel(c.id, c.chapter_no) }}
              </option>
            </select>
          </div>

          <div>
            <label class="text-xs text-muted">Scene #</label>
            <input v-model="form.scene_no" class="input w-full" :disabled="isTrashed" placeholder="1" />
          </div>

          <div>
            <label class="text-xs text-muted">POV</label>
            <select v-model="form.pov_character_id" class="input w-full" :disabled="isTrashed">
              <option value="">—</option>
              <option v-for="c in characters" :key="c.id" :value="String(c.id)">
                {{ characterLabel(c) }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="text-xs text-muted">Title</label>
            <input v-model="form.title" class="input w-full" :disabled="isTrashed" />
          </div>
          <div>
            <label class="text-xs text-muted">Time of day</label>
            <input v-model="form.time_of_day" class="input w-full" :disabled="isTrashed" placeholder="Matin / Nuit…" />
          </div>
        </div>

        <div>
          <label class="text-xs text-muted">Objective</label>
          <input v-model="form.objective" class="input w-full" :disabled="isTrashed" />
        </div>

        <div>
          <label class="text-xs text-muted">Summary</label>
          <textarea v-model="form.summary" class="input w-full min-h-24" :disabled="isTrashed" />
        </div>

        <div>
          <label class="text-xs text-muted">Content</label>
          <textarea v-model="form.content" class="input w-full min-h-40" :disabled="isTrashed" />
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="text-xs text-muted">Conflict</label>
            <textarea v-model="form.conflict" class="input w-full min-h-24" :disabled="isTrashed" />
          </div>
          <div>
            <label class="text-xs text-muted">Turning point</label>
            <textarea v-model="form.turning_point" class="input w-full min-h-24" :disabled="isTrashed" />
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          <div>
            <label class="text-xs text-muted">Outcome</label>
            <textarea v-model="form.outcome" class="input w-full min-h-24" :disabled="isTrashed" />
          </div>
          <div>
            <label class="text-xs text-muted">Hook</label>
            <textarea v-model="form.hook" class="input w-full min-h-24" :disabled="isTrashed" />
          </div>
          <div>
            <label class="text-xs text-muted">InDesign style</label>
            <textarea v-model="form.indesign_style" class="input w-full min-h-24" :disabled="isTrashed" />
          </div>
        </div>

        <button class="btn btn-primary w-full focus-ring" :disabled="saving || isTrashed" @click="save">
          <Icon name="mdi:content-save" aria-hidden="true" />
          {{ saving ? 'Saving…' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>
