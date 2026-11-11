<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed, reactive, ref, watchEffect } from 'vue'
import { useLocalePath, useRequestHeaders } from '#imports'

const localePath = useLocalePath()
const { t } = useI18n()
const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data, pending, refresh, error } = await useFetch(() => `/api/projects/${slug.value}`, {
  $fetch: apiFetch,
  credentials: 'include',
  headers: useRequestHeaders(['cookie']),
})

const { data: booksData } = await useFetch(() => `/api/projects/${slug.value}/books`, {
  $fetch: apiFetch,
  credentials: 'include',
  headers: useRequestHeaders(['cookie']),
})

const booksCount = computed(() => booksData.value?.books?.length || 0)
const canManage = computed(() => data.value?.project?.can_manage !== false)

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
    await apiFetch(`/api/projects/${slug.value}`, {
      method: 'PUT',
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
  if (!confirm(t('studio.project.deleteConfirm'))) return
  deleting.value = true
  try {
    await apiFetch(`/api/projects/${slug.value}`, { method: 'DELETE' })
    await navigateTo(localePath('/studio/projects'))
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink class="text-sm text-muted hover:opacity-100" :to="localePath('/studio/projects')">
      ← {{ t('studio.project.backToProjects') }}
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">{{ t('studio.project.title') }}</h1>
        <p class="text-sm text-muted">{{ t('studio.project.slugImmutable') }} <span class="font-mono">{{ slug }}</span></p>
        <p v-if="!canManage" class="text-sm text-muted mt-1">{{ t('studio.project.readOnly') }}</p>
      </div>

      <div v-if="canManage" class="flex gap-2">
        <button class="btn btn-primary focus-ring" :disabled="saving || pending" @click="save">
          <Icon name="mdi:content-save-outline" aria-hidden="true" />
          {{ t('common.save') }}
        </button>

        <button class="btn btn-ghost focus-ring" :disabled="deleting" @click="removeProject">
          <Icon name="mdi:trash-can-outline" aria-hidden="true" />
          {{ t('common.delete') }}
        </button>
      </div>
    </div>

    <div v-if="error" class="card">
      <div class="card-body text-sm">
        {{ t('common.error') }}: {{ error?.statusMessage || error }}
      </div>
    </div>

    <div v-else class="card">
      <div class="card-body grid gap-3 md:grid-cols-2">
        <div>
          <label class="text-xs text-muted">{{ t('studio.project.defaultTitle') }}</label>
          <input v-model="form.title" class="input w-full" />
        </div>

        <div>
          <label class="text-xs text-muted">{{ t('studio.project.status') }}</label>
          <select v-model="form.status" class="input w-full">
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </div>

        <div>
          <label class="text-xs text-muted">{{ t('studio.project.englishTitle') }}</label>
          <input v-model="form.title_en" class="input w-full" />
        </div>

        <div>
          <label class="text-xs text-muted">{{ t('studio.project.portugueseTitle') }}</label>
          <input v-model="form.title_pt" class="input w-full" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">{{ t('studio.project.logline') }}</label>
          <input v-model="form.logline" class="input w-full" />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs text-muted">{{ t('studio.project.pitch') }}</label>
          <textarea v-model="form.pitch" class="input w-full min-h-28" />
        </div>
      </div>
    </div>

    <!-- Next shortcuts -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <template v-if="booksCount > 0">
        <NuxtLink class="card hover:bg-surface2" :to="localePath(`/studio/projects/${slug}/books`)">
          <div class="card-body">
            <div class="font-extrabold">{{ t('studio.project.books') }}</div>
            <div class="text-xs text-muted mt-1">{{ t('studio.project.booksHint') }}</div>
          </div>
        </NuxtLink>
      </template>

      <NuxtLink class="card hover:bg-surface2" :to="localePath(`/studio/projects/${slug}/characters`)">
        <div class="card-body">
          <div class="font-extrabold">{{ t('domain.character.plural') }}</div>
          <div class="text-xs text-muted mt-1">{{ t('studio.project.charactersHint') }}</div>
        </div>
      </NuxtLink>

      <NuxtLink class="card hover:bg-surface2" :to="localePath(`/studio/projects/${slug}/scenes`)">
        <div class="card-body">
          <div class="font-extrabold">{{ t('domain.scene.plural') }}</div>
          <div class="text-xs text-muted mt-1">{{ t('studio.project.scenesHint') }}</div>
        </div>
      </NuxtLink>

      <NuxtLink class="card hover:bg-surface2" :to="localePath(`/studio/projects/${slug}/timeline`)">
        <div class="card-body">
          <div class="font-extrabold">{{ t('domain.timeline.plural') }}</div>
          <div class="text-xs text-muted mt-1">{{ t('studio.project.timelineHint') }}</div>
        </div>
      </NuxtLink>

      <NuxtLink class="card hover:bg-surface2" :to="localePath(`/studio/projects/${slug}/glossary`)">
        <div class="card-body">
          <div class="font-extrabold">{{ t('studio.project.glossary') }}</div>
          <div class="text-xs text-muted mt-1">{{ t('studio.project.glossaryHint') }}</div>
        </div>
      </NuxtLink>

      <NuxtLink class="card hover:bg-surface2" :to="localePath(`/studio/projects/${slug}/todos`)">
        <div class="card-body">
          <div class="font-extrabold">{{ $t('domain.todo.plural') }}</div>
          <div class="text-xs text-muted mt-1">{{ $t('domain.todo.projectTodos') }}</div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
