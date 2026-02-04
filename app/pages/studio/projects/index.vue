<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, ref, reactive } from 'vue'
import { useI18n, useLocalePath } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()

const q = ref('')
const creating = ref(false)
const form = reactive({ title: '', slug: '' })

const queryObj = computed(() => ({ q: q.value?.trim() || undefined }))
const { data, pending, refresh, error } = await useFetch('/api/projects', {
  query: queryObj,
  credentials: 'include',
})

async function createProject () {
  if (!form.title.trim()) return
  creating.value = true
  try {
    await $fetch('/api/projects', {
      method: 'POST',
      credentials: 'include',
      body: { title: form.title, slug: form.slug || undefined },
    })
    form.title = ''
    form.slug = ''
    await refresh()
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <div class="page space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Projects</h1>
        <p class="text-sm text-muted">Univers, œuvres, scènes, personnages — tout part d’ici.</p>
      </div>

      <NuxtLink :to="localePath('/explore')" class="btn btn-ghost focus-ring">
        <Icon name="mdi:compass-outline" aria-hidden="true" />
        Explore
      </NuxtLink>
    </div>

    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-4">
        <div class="md:col-span-1">
          <label class="text-xs text-muted">Search</label>
          <input v-model="q" class="input w-full" placeholder="title or slug…" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">New title</label>
          <input v-model="form.title" class="input w-full" placeholder="e.g. Les derniers léopards" />
        </div>

        <div class="md:col-span-1">
          <label class="text-xs text-muted">Slug (optional)</label>
          <input v-model="form.slug" class="input w-full" placeholder="les-derniers-leopards" />
        </div>

        <div class="md:col-span-1 flex items-end">
          <button class="btn btn-primary w-full focus-ring" :disabled="creating" @click="createProject">
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
          <span v-else>{{ data?.projects?.length || 0 }} project(s)</span>
        </div>
      </div>

      <div class="divide-y divide-border">
        <NuxtLink
          v-for="p in (data?.projects || [])"
          :key="p.slug"
          class="block p-4 hover:bg-surface2"
          :to="localePath(`/studio/projects/${p.slug}`)"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="font-extrabold">{{ p.title }}</div>
              <div class="text-xs text-muted mt-1">{{ p.slug }}</div>
            </div>
            <div class="badge">{{ p.status }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
