<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref } from 'vue'
import { useRoute, useLocalePath } from '#imports'

const route = useRoute()
const localePath = useLocalePath()
const projectSlug = computed(() => String(route.params.slug || ''))
const sceneSlug = computed(() => String(route.params.sceneSlug || ''))

const apiBase = computed(() => `/api/projects/${projectSlug.value}/scenes/${sceneSlug.value}/characters`)
const { data, pending, error, refresh } = await useFetch(
  apiBase,
  { $fetch: apiFetch, credentials: 'include' }
)

const cast = computed(() => data.value?.characters || [])
const available = computed(() => data.value?.available || [])
const selectedSlug = ref('')
const adding = ref(false)
const editing = ref('')
const form = reactive({ role: '', notes: '' })

function beginEdit(character) {
  editing.value = character.slug
  form.role = character.scene_role || ''
  form.notes = character.scene_notes || ''
}

function cancelEdit() {
  editing.value = ''
  form.role = ''
  form.notes = ''
}

async function addCharacter() {
  if (!selectedSlug.value) return
  adding.value = true
  try {
    await apiFetch(apiBase.value, {
      method: 'POST',
      body: { character_slug: selectedSlug.value },
    })
    selectedSlug.value = ''
    await refresh()
  } finally {
    adding.value = false
  }
}

async function saveLink(character) {
  await apiFetch(`${apiBase.value}/${character.slug}`, {
    method: 'PUT',
    body: { role: form.role || null, notes: form.notes || null },
  })
  cancelEdit()
  await refresh()
}

async function unlink(character) {
  if (!confirm(`Remove "${character.name}" from this scene?`)) return
  await apiFetch(`${apiBase.value}/${character.slug}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="page space-y-6">
    <NuxtLink
      class="text-sm text-muted hover:opacity-100"
      :to="localePath(`/studio/projects/${projectSlug}/scenes/${sceneSlug}`)"
    >
      ← Back to scene
    </NuxtLink>

    <div>
      <h1 class="text-2xl font-bold">Scene cast</h1>
      <p class="text-sm text-muted mt-1">Link existing project characters to this scene without duplicating their profiles.</p>
    </div>

    <div v-if="error" class="alert alert-error">
      Error: {{ error?.statusMessage || error }}
    </div>

    <div class="card">
      <div class="card-body">
        <h2 class="font-semibold mb-3">Add character</h2>
        <div class="flex flex-col gap-3 md:flex-row">
          <select v-model="selectedSlug" class="input flex-1" :disabled="adding || !available.length">
            <option value="">Select an existing character…</option>
            <option v-for="character in available" :key="character.slug" :value="character.slug">
              {{ character.name }}{{ character.is_pov ? ' — POV' : '' }}
            </option>
          </select>
          <button class="btn btn-primary focus-ring" :disabled="adding || !selectedSlug" @click="addCharacter">
            <Icon name="mdi:account-plus-outline" aria-hidden="true" />
            {{ adding ? 'Adding…' : 'Add to scene' }}
          </button>
        </div>
        <p v-if="!available.length && !pending" class="text-sm text-muted mt-3">
          Every active project character is already linked to this scene.
        </p>
      </div>
    </div>

    <div v-if="pending" class="text-center py-10 text-muted">Loading…</div>

    <div v-else-if="!cast.length" class="card">
      <div class="card-body text-center py-10 text-muted">No character linked to this scene yet.</div>
    </div>

    <div v-else class="space-y-3">
      <div v-for="character in cast" :key="character.slug" class="card">
        <div class="card-body space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-semibold">{{ character.name }}</h2>
                <span v-if="character.is_pov" class="badge">POV</span>
              </div>
              <p class="text-xs text-muted">{{ character.slug }}</p>
            </div>
            <div class="flex gap-2">
              <button v-if="editing !== character.slug" class="btn btn-ghost btn-sm focus-ring" @click="beginEdit(character)">
                Edit role
              </button>
              <button class="btn btn-ghost btn-sm focus-ring" @click="unlink(character)">
                Remove
              </button>
            </div>
          </div>

          <template v-if="editing === character.slug">
            <div class="grid gap-3 md:grid-cols-2">
              <div>
                <label class="text-xs text-muted">Role in scene</label>
                <input v-model="form.role" class="input w-full" placeholder="e.g. witness, antagonist…" />
              </div>
              <div>
                <label class="text-xs text-muted">Notes</label>
                <textarea v-model="form.notes" class="input w-full min-h-20" />
              </div>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-primary btn-sm focus-ring" @click="saveLink(character)">Save</button>
              <button class="btn btn-ghost btn-sm focus-ring" @click="cancelEdit">Cancel</button>
            </div>
          </template>

          <div v-else class="text-sm">
            <p><span class="text-muted">Scene role:</span> {{ character.scene_role || '—' }}</p>
            <p v-if="character.scene_notes" class="mt-1"><span class="text-muted">Notes:</span> {{ character.scene_notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
