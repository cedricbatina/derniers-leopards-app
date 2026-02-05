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
  title: '',
  slug: '',
  subtitle: '',
})

const queryObj = computed(() => ({
  q: q.value?.trim() || undefined,
  trashed: trashed.value ? 1 : undefined,
}))

const { data, pending, refresh, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/books`,
  { query: queryObj, credentials: 'include' }
)

async function createBook () {
  if (!form.title.trim()) return
  creating.value = true
  try {
    await $fetch(`/api/projects/${projectSlug.value}/books`, {
      method: 'POST',
      credentials: 'include',
      body: {
        title: form.title,
        slug: form.slug || undefined,
        subtitle: form.subtitle || undefined,
      },
    })
    form.title = ''
    form.slug = ''
    form.subtitle = ''
    await refresh()
  } finally {
    creating.value = false
  }
}

async function softDelete (b) {
  if (!confirm(`Delete book "${b.title}"?`)) return
  await $fetch(`/api/projects/${projectSlug.value}/books/${b.slug}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  await refresh()
}

async function restore (b) {
  await $fetch(`/api/projects/${projectSlug.value}/books/${b.slug}/restore`, {
    method: 'POST',
    credentials: 'include',
  })
  await refresh()
}

function bookTo (b) {
  const base = `/studio/projects/${projectSlug.value}/books/${b.slug}`
  if (trashed.value) return localePath(`${base}?trashed=1`)
  return localePath(base)
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink class="text-sm text-muted hover:opacity-100" :to="localePath(`/studio/projects/${projectSlug}`)">
      ← Back to project
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Books</h1>
        <p class="text-sm text-muted">Tomes, essais, bibles… par projet.</p>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm text-muted flex items-center gap-2 select-none">
          <input type="checkbox" v-model="trashed" />
          Trashed
        </label>
      </div>
    </div>

    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-4">
        <div class="md:col-span-1">
          <label class="text-xs text-muted">Search</label>
          <input v-model="q" class="input w-full" placeholder="title / slug / subtitle…" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">New title</label>
          <input v-model="form.title" class="input w-full" placeholder="e.g. Tome I" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Subtitle (optional)</label>
          <input v-model="form.subtitle" class="input w-full" placeholder="e.g. Les derniers léopards" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Slug (optional)</label>
          <input v-model="form.slug" class="input w-full" placeholder="tome-1" />
        </div>

        <div class="md:col-span-4">
          <button class="btn btn-primary w-full focus-ring" :disabled="creating" @click="createBook">
            <Icon name="mdi:plus" aria-hidden="true" />
            Create
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="card">
      <div class="card-body text-sm">
        Error: {{ error?.statusMessage || error }}
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="card-body flex items-center justify-between">
        <div class="text-sm text-muted">
          <span v-if="pending">Loading…</span>
          <span v-else>{{ data?.books?.length || 0 }} book(s)</span>
        </div>
      </div>

      <div class="divide-y divide-border">
        <NuxtLink
          v-for="b in (data?.books || [])"
          :key="b.slug"
          class="block p-4 hover:bg-surface2"
          :to="bookTo(b)"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="font-extrabold">{{ b.title }}</div>
              <div v-if="b.subtitle" class="text-sm text-muted mt-1">{{ b.subtitle }}</div>
              <div class="text-xs text-muted mt-1">{{ b.slug }}</div>
            </div>

            <div class="flex items-center gap-2">
              <span v-if="b.deleted_at" class="badge">trashed</span>
              <button
                v-if="!b.deleted_at"
                class="btn btn-ghost focus-ring"
                @click.prevent.stop="softDelete(b)"
              >
                <Icon name="mdi:trash-can-outline" aria-hidden="true" />
              </button>
              <button
                v-else
                class="btn btn-ghost focus-ring"
                @click.prevent.stop="restore(b)"
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
