<script setup>
definePageMeta({ middleware: 'auth' })

import { computed, reactive, ref } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()

const q = ref('')
const trashed = ref(false)
const creating = ref(false)

const form = reactive({
  title: '',
  slug: '',
  logline: '',
  status: 'active',
})

const queryObj = computed(() => ({
  q: q.value?.trim() || undefined,
  trashed: trashed.value ? 1 : undefined,
}))

const { data, pending, refresh, error } = await useFetch(
  () => '/api/projects',
  { query: queryObj, credentials: 'include' }
)

async function createProject() {
  if (!form.title.trim()) return
  creating.value = true
  try {
    await $fetch('/api/projects', {
      method: 'POST',
      credentials: 'include',
      body: {
        title: form.title,
        slug: form.slug || undefined,
        logline: form.logline || undefined,
        status: form.status || 'active',
      },
    })
    form.title = ''
    form.slug = ''
    form.logline = ''
    form.status = 'active'
    await refresh()
  } finally {
    creating.value = false
  }
}

function projectTo(p) {
  return localePath(`/studio/projects/${p.slug}`)
}
</script>

<template>
  <div class="page space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Projects</h1>
        <p class="text-sm text-muted">Crée et organise tes projets.</p>
      </div>
    </div>

    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-5">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Search</label>
          <input v-model="q" class="input w-full" placeholder="title / slug…" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Status</label>
          <select v-model="form.status" class="input w-full">
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">New title</label>
          <input v-model="form.title" class="input w-full" placeholder="e.g. Les derniers léopards" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Slug (optional)</label>
          <input v-model="form.slug" class="input w-full" placeholder="les-derniers-leopards" />
        </div>

        <div class="md:col-span-5">
          <label class="text-xs text-muted">Logline (optional)</label>
          <input v-model="form.logline" class="input w-full" placeholder="Une logline courte…" />
        </div>

        <div class="md:col-span-5 flex items-center justify-between">
          <label class="text-sm text-muted flex items-center gap-2 select-none">
            <input type="checkbox" v-model="trashed" />
            Trashed
          </label>

          <button class="btn btn-primary focus-ring" :disabled="creating" @click="createProject">
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
          <span v-else>{{ data?.projects?.length || 0 }} project(s)</span>
        </div>
      </div>

      <div class="divide-y divide-border">
        <NuxtLink
          v-for="p in (data?.projects || [])"
          :key="p.slug"
          class="block p-4 hover:bg-surface2"
          :to="projectTo(p)"
          :class="p.deleted_at ? 'pointer-events-none opacity-60' : ''"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="font-extrabold">{{ p.title }}</div>
              <div class="text-xs text-muted mt-1">{{ p.slug }}</div>
              <div v-if="p.logline" class="text-sm text-muted mt-1">{{ p.logline }}</div>
            </div>

            <div class="flex items-center gap-2">
              <span class="badge">{{ p.status }}</span>
              <span v-if="p.deleted_at" class="badge">trashed</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
