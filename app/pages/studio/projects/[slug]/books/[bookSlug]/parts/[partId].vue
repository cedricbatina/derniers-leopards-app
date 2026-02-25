<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref, watchEffect } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()

const projectSlug = computed(() => String(route.params.slug || ''))
const bookSlug = computed(() => String(route.params.bookSlug || ''))
const partId = computed(() => Number(route.params.partId))

const { data: partData, pending: partPending, refresh: refreshPart, error: partError } = await useFetch(
  () => `/api/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${partId.value}`,
  { credentials: 'include' }
)

const { data: chaptersData, pending: chaptersPending, refresh: refreshChapters, error: chaptersError } = await useFetch(
  () => `/api/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${partId.value}/chapters`,
  { credentials: 'include' }
)

const savingPart = ref(false)
const deletingPart = ref(false)

const partForm = reactive({
  part_no: '',
  title: '',
  summary: '',
})

watchEffect(() => {
  const p = partData.value?.part
  if (!p) return
  partForm.part_no = p.part_no ? String(p.part_no) : ''
  partForm.title = p.title || ''
  partForm.summary = p.summary || ''
})

async function savePart() {
  if (!partForm.title.trim()) return
  savingPart.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${partId.value}`, {
      method: 'PUT',
      credentials: 'include',
      body: {
        part_no: partForm.part_no ? Number(partForm.part_no) : undefined,
        title: partForm.title,
        summary: partForm.summary || null,
      },
    })
    await refreshPart()
  } finally {
    savingPart.value = false
  }
}

async function deletePart() {
  if (!confirm('Delete this part?')) return
  deletingPart.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${partId.value}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    await navigateTo(localePath(`/studio/projects/${projectSlug.value}/books/${bookSlug.value}/parts`))
  } finally {
    deletingPart.value = false
  }
}

const creatingChapter = ref(false)
const chapterForm = reactive({
  chapter_no: '',
  title: '',
  slug: '',
  summary: '',
})

async function createChapter() {
  if (!chapterForm.title.trim()) return
  creatingChapter.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${partId.value}/chapters`, {
      method: 'POST',
      credentials: 'include',
      body: {
        chapter_no: chapterForm.chapter_no ? Number(chapterForm.chapter_no) : undefined,
        title: chapterForm.title,
        slug: chapterForm.slug || undefined,
        summary: chapterForm.summary || undefined,
      },
    })
    chapterForm.chapter_no = ''
    chapterForm.title = ''
    chapterForm.slug = ''
    chapterForm.summary = ''
    await refreshChapters()
  } finally {
    creatingChapter.value = false
  }
}

async function deleteChapter(ch) {
  if (!confirm(`Delete chapter "${ch.title}"?`)) return
  await $fetch(`/api/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${partId.value}/chapters/${ch.id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  await refreshChapters()
}

function chapterTo(ch) {
  return localePath(`/studio/projects/${projectSlug.value}/books/${bookSlug.value}/parts/${partId.value}/chapters/${ch.id}`)
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink
      class="text-sm text-muted hover:opacity-100"
      :to="localePath(`/studio/projects/${projectSlug}/books/${bookSlug}/parts`)"
    >
      ← Back to parts
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Part</h1>
        <p class="text-sm text-muted">ID: {{ partId }}</p>
      </div>

      <div class="flex gap-2">
        <button class="btn btn-primary focus-ring" :disabled="savingPart || partPending" @click="savePart">
          <Icon name="mdi:content-save-outline" aria-hidden="true" />
          Save
        </button>
        <button class="btn btn-ghost focus-ring" :disabled="deletingPart" @click="deletePart">
          <Icon name="mdi:trash-can-outline" aria-hidden="true" />
          Delete
        </button>
      </div>
    </div>

    <div v-if="partError" class="card">
      <div class="card-body text-sm">Error: {{ partError?.statusMessage || partError }}</div>
    </div>

    <div v-else class="card">
      <div class="card-body grid gap-3 md:grid-cols-2">
        <div>
          <label class="text-xs text-muted">Part #</label>
          <input v-model="partForm.part_no" class="input w-full" />
        </div>
        <div>
          <label class="text-xs text-muted">Title</label>
          <input v-model="partForm.title" class="input w-full" />
        </div>
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Summary</label>
          <textarea v-model="partForm.summary" class="input w-full min-h-24" />
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body space-y-3">
        <div class="flex items-center justify-between">
          <div class="font-extrabold">Chapters</div>
          <div class="text-xs text-muted">
            <span v-if="chaptersPending">Loading…</span>
            <span v-else>{{ chaptersData?.chapters?.length || 0 }} chapter(s)</span>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-4">
          <div>
            <label class="text-xs text-muted">Chapter #</label>
            <input v-model="chapterForm.chapter_no" class="input w-full" placeholder="1" />
          </div>
          <div>
            <label class="text-xs text-muted">Title</label>
            <input v-model="chapterForm.title" class="input w-full" placeholder="Chapter title" />
          </div>
          <div>
            <label class="text-xs text-muted">Slug (optional)</label>
            <input v-model="chapterForm.slug" class="input w-full" placeholder="chapter-1" />
          </div>
          <div class="md:col-span-4">
            <label class="text-xs text-muted">Summary (optional)</label>
            <textarea v-model="chapterForm.summary" class="input w-full min-h-24" />
          </div>
          <div class="md:col-span-4">
            <button class="btn btn-primary w-full focus-ring" :disabled="creatingChapter" @click="createChapter">
              <Icon name="mdi:plus" aria-hidden="true" />
              Create chapter
            </button>
          </div>
        </div>

        <div v-if="chaptersError" class="card">
          <div class="card-body text-sm">Error: {{ chaptersError?.statusMessage || chaptersError }}</div>
        </div>

        <div class="divide-y divide-border">
          <div
            v-for="ch in (chaptersData?.chapters || [])"
            :key="ch.id"
            class="flex items-start justify-between gap-3 py-3"
          >
            <NuxtLink class="min-w-0" :to="chapterTo(ch)">
              <div class="font-extrabold">
                <span class="text-muted" v-if="ch.chapter_no">[Ch {{ ch.chapter_no }}]</span>
                {{ ch.title }}
              </div>
              <div class="text-xs text-muted mt-1">{{ ch.slug }}</div>
              <div v-if="ch.summary" class="text-sm text-muted mt-1">{{ ch.summary }}</div>
            </NuxtLink>
            <div class="flex items-center gap-2">
              <NuxtLink class="btn btn-ghost focus-ring" :to="chapterTo(ch)">
                <Icon name="mdi:open-in-new" aria-hidden="true" />
              </NuxtLink>
              <button class="btn btn-ghost focus-ring" @click="deleteChapter(ch)">
                <Icon name="mdi:trash-can-outline" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
