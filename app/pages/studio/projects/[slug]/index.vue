<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref, watchEffect } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data, pending, refresh, error } = await useFetch(() => `/api/projects/${slug.value}`, {
  credentials: 'include',
})

const saving = ref(false)
const deleting = ref(false)

const form = reactive({
  title: '',
  title_en: '',
  title_pt: '',
  logline: '',
  pitch: '',
  status: 'active',
})

watchEffect(() => {
  const p = data.value?.project
  if (!p) return
  form.title = p.title || ''
  form.title_en = p.title_en || ''
  form.title_pt = p.title_pt || ''
  form.logline = p.logline || ''
  form.pitch = p.pitch || ''
  form.status = p.status || 'active'
})

async function save () {
  saving.value = true
  try {
    await $fetch(`/api/projects/${slug.value}`, {
      method: 'PUT',
      credentials: 'include',
      body: {
        title: form.title,
        title_en: form.title_en || null,
        title_pt: form.title_pt || null,
        logline: form.logline || null,
        pitch: form.pitch || null,
        status: form.status,
      },
    })
    await refresh()
  } finally {
    saving.value = false
  }
}

async function removeProject () {
  if (!confirm('Delete this project?')) return
  deleting.value = true
  try {
    await $fetch(`/api/projects/${slug.value}`, { method: 'DELETE', credentials: 'include' })
    await navigateTo(localePath('/studio/projects'))
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink class="text-sm text-muted hover:opacity-100" :to="localePath('/studio/projects')">
      ← Back to projects
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Project</h1>
        <p class="text-sm text-muted">Slug is immutable: <span class="font-mono">{{ slug }}</span></p>
      </div>

      <div class="flex gap-2">
        <button class="btn btn-primary focus-ring" :disabled="saving || pending" @click="save">
          <Icon name="mdi:content-save-outline" aria-hidden="true" />
          Save
        </button>

        <button class="btn btn-ghost focus-ring" :disabled="deleting" @click="removeProject">
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
          <label class="text-xs text-muted">Title (default)</label>
          <input v-model="form.title" class="input w-full" />
        </div>

        <div>
          <label class="text-xs text-muted">Status</label>
          <select v-model="form.status" class="input w-full">
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </div>

        <div>
          <label class="text-xs text-muted">Title EN</label>
          <input v-model="form.title_en" class="input w-full" />
        </div>

        <div>
          <label class="text-xs text-muted">Title PT</label>
          <input v-model="form.title_pt" class="input w-full" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">Logline</label>
          <input v-model="form.logline" class="input w-full" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">Pitch</label>
          <textarea v-model="form.pitch" class="input w-full min-h-28" />
        </div>
      </div>
    </div>

    <!-- Next shortcuts -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink class="card hover:bg-surface2" :to="localePath(`/studio/projects/${slug}/scenes`)">
        <div class="card-body">
          <div class="font-extrabold">Scenes</div>
          <div class="text-xs text-muted mt-1">Write & structure.</div>
        </div>
      </NuxtLink>

      <NuxtLink class="card hover:bg-surface2" :to="localePath(`/studio/projects/${slug}/characters`)">
        <div class="card-body">
          <div class="font-extrabold">Characters</div>
          <div class="text-xs text-muted mt-1">Arcs & relations.</div>
        </div>
      </NuxtLink>

      <NuxtLink class="card hover:bg-surface2" :to="localePath(`/studio/projects/${slug}/timeline`)">
        <div class="card-body">
          <div class="font-extrabold">Timeline</div>
          <div class="text-xs text-muted mt-1">Chronology.</div>
        </div>
      </NuxtLink>

      <NuxtLink class="card hover:bg-surface2" :to="localePath(`/studio/projects/${slug}/glossary`)">
        <div class="card-body">
          <div class="font-extrabold">Glossary</div>
          <div class="text-xs text-muted mt-1">Terms & vocabulary.</div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
