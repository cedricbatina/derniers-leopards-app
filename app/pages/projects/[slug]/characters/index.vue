<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()

const projectSlug = computed(() => String(route.params.slug || ''))

const q = ref('')
const trashed = ref(false)
const creating = ref(false)

const form = reactive({
  name: '',
  slug: '',
  description: '',
})

const queryObj = computed(() => ({
  q: q.value?.trim() || undefined,
  trashed: trashed.value ? 1 : undefined,
}))

const { data, pending, refresh, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/characters`,
  { query: queryObj, credentials: 'include' }
)

async function createCharacter() {
  if (!form.name.trim()) return
  creating.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/characters`, {
      method: 'POST',
      credentials: 'include',
      body: {
        name: form.name,
        slug: form.slug || undefined,
        description: form.description || undefined,
      },
    })

    form.name = ''
    form.slug = ''
    form.description = ''
    await refresh()
  } finally {
    creating.value = false
  }
}

async function softDelete(c) {
  if (!confirm(`Delete character "${c.name}"?`)) return
  await $fetch(`/api/projects/${projectSlug.value}/characters/${c.slug}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  await refresh()
}

async function restore(c) {
  await $fetch(`/api/projects/${projectSlug.value}/characters/${c.slug}/restore`, {
    method: 'POST',
    credentials: 'include',
  })
  await refresh()
}

function characterTo(c) {
  const base = `/studio/projects/${projectSlug.value}/characters/${c.slug}`
  return trashed.value ? localePath(`${base}?trashed=1`) : localePath(base)
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink
      class="text-sm text-muted hover:opacity-100"
      :to="localePath(`/studio/projects/${projectSlug}`)"
    >
      ← Back to project
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Characters</h1>
        <p class="text-sm text-muted">Personnages du projet (CRUD + corbeille).</p>
      </div>

      <label class="text-sm text-muted flex items-center gap-2 select-none">
        <input type="checkbox" v-model="trashed" />
        Trashed
      </label>
    </div>

    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-4">
        <div class="md:col-span-1">
          <label class="text-xs text-muted">Search</label>
          <input v-model="q" class="input w-full" placeholder="name / slug…" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">New name</label>
          <input v-model="form.name" class="input w-full" placeholder="e.g. Kinuani" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Slug (optional)</label>
          <input v-model="form.slug" class="input w-full" placeholder="kinuani" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Description (optional)</label>
          <input v-model="form.description" class="input w-full" placeholder="2-3 mots, ou laisse vide…" />
        </div>

        <div class="md:col-span-4">
          <button class="btn btn-primary w-full focus-ring" :disabled="creating" @click="createCharacter">
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
          <span v-else>{{ data?.characters?.length || 0 }} character(s)</span>
        </div>
      </div>

      <div class="divide-y divide-border">
        <NuxtLink
          v-for="c in (data?.characters || [])"
          :key="c.slug"
          class="block p-4 hover:bg-surface2"
          :to="characterTo(c)"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="font-extrabold">{{ c.name }}</div>
              <div class="text-xs text-muted mt-1">{{ c.slug }}</div>
              <div v-if="c.description" class="text-sm text-muted mt-1">{{ c.description }}</div>
            </div>

            <div class="flex items-center gap-2">
              <span v-if="c.deleted_at" class="badge">trashed</span>

              <button
                v-if="!c.deleted_at"
                class="btn btn-ghost focus-ring"
                @click.prevent.stop="softDelete(c)"
              >
                <Icon name="mdi:trash-can-outline" aria-hidden="true" />
              </button>

              <button
                v-else
                class="btn btn-ghost focus-ring"
                @click.prevent.stop="restore(c)"
              >
                <Icon name="mdi:backup-restore" aria-hidden="true" />
              </button>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
