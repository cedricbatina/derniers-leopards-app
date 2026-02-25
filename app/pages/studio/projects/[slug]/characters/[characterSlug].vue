<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref, watchEffect } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()

const projectSlug = computed(() => String(route.params.slug || ''))
const characterSlug = computed(() => String(route.params.characterSlug || ''))
const allowTrashed = computed(() => String(route.query.trashed || '') === '1')

const queryObj = computed(() => ({ trashed: allowTrashed.value ? 1 : undefined }))

const { data, pending, refresh, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/characters/${characterSlug.value}`,
  { query: queryObj, credentials: 'include' }
)

const saving = ref(false)
const deleting = ref(false)
const restoring = ref(false)

const form = reactive({
  name: '',
  description: '',
})

watchEffect(() => {
  const c = data.value?.character
  if (!c) return
  form.name = c.name || ''
  form.description = c.description || ''
})

const isTrashed = computed(() => !!data.value?.character?.deleted_at)

async function save() {
  if (isTrashed.value) return
  saving.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/characters/${characterSlug.value}`, {
      method: 'PUT',
      credentials: 'include',
      body: {
        name: form.name,
        description: form.description ? form.description : null,
      },
    })
    await refresh()
  } finally {
    saving.value = false
  }
}

async function removeCharacter() {
  if (!confirm('Delete this character?')) return
  deleting.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/characters/${characterSlug.value}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    await navigateTo(localePath(`/studio/projects/${projectSlug.value}/characters`))
  } finally {
    deleting.value = false
  }
}

async function restoreCharacter() {
  restoring.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/characters/${characterSlug.value}/restore`, {
      method: 'POST',
      credentials: 'include',
    })
    await navigateTo(localePath(`/studio/projects/${projectSlug.value}/characters/${characterSlug.value}`))
  } finally {
    restoring.value = false
  }
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink
      class="text-sm text-muted hover:opacity-100"
      :to="localePath(`/studio/projects/${projectSlug}/characters${allowTrashed ? '?trashed=1' : ''}`)"
    >
      ← Back to characters
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Character</h1>
        <p class="text-sm text-muted">{{ characterSlug }}</p>
      </div>

      <div class="flex items-center gap-2">
        <span v-if="isTrashed" class="badge">trashed</span>

        <button
          v-if="!isTrashed"
          class="btn btn-ghost focus-ring"
          :disabled="deleting"
          @click="removeCharacter"
        >
          <Icon name="mdi:trash-can-outline" aria-hidden="true" />
          Delete
        </button>

        <button
          v-else
          class="btn btn-ghost focus-ring"
          :disabled="restoring"
          @click="restoreCharacter"
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
      <div class="card-body space-y-3">
        <div class="text-sm text-muted" v-if="pending">Loading…</div>

        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="text-xs text-muted">Name</label>
            <input v-model="form.name" class="input w-full" :disabled="isTrashed" />
          </div>
          <div>
            <label class="text-xs text-muted">Description</label>
            <input v-model="form.description" class="input w-full" :disabled="isTrashed" />
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
