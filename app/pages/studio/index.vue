
<script setup>
definePageMeta({ middleware: 'auth' })

import { computed } from 'vue'
import { useLocalePath, useFetch, useRequestHeaders, useI18n } from '#imports'
import { useAuthStore } from '~/stores/auth.store'

const localePath = useLocalePath()
const auth = useAuthStore()
const { t } = useI18n()

const { data, pending, error } = await useFetch('/api/projects', {
  credentials: 'include',
  headers: useRequestHeaders(['cookie']),
})

const activeProjects = computed(() => (data.value?.projects || []).filter((p) => !p.deleted_at))
const projectsCount = computed(() => activeProjects.value.length)
const userDisplayName = computed(() => auth.user?.display_name || auth.user?.username || auth.user?.email)

const recentProjects = computed(() => {
  return [...activeProjects.value]
    .sort((a, b) => {
      const aDate = new Date(a.updated_at || a.created_at || 0).getTime()
      const bDate = new Date(b.updated_at || b.created_at || 0).getTime()
      return bDate - aDate
    })
    .slice(0, 6)
})

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value))
}
</script>

<template>
  <div class="page space-y-6">
    <div class="card">
      <div class="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-4">
          <img
            v-if="auth.user?.avatar_url"
            :src="auth.user.avatar_url"
            :alt="t('profile.avatarAlt', { name: userDisplayName })"
            class="rounded-full w-16 h-16 border border-primary object-cover"
          />
          <div>
            <h1 class="text-2xl font-bold">{{ t('dashboard.welcome', { name: userDisplayName }) }}</h1>
            <p class="text-sm text-muted">{{ projectsCount }} projet(s) actif(s)</p>
          </div>
        </div>

        <div class="flex gap-2">
          <NuxtLink :to="localePath('/studio/todos')" class="btn btn-outline">
            <Icon name="mdi:checkbox-marked-outline" class="mr-1" />
            {{ t('domain.todo.myTasks') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/studio/projects')" class="btn btn-primary">
            <Icon name="mdi:folder-multiple-outline" class="mr-1" />
            Gérer les projets
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-if="pending" class="text-muted">Chargement des projets…</div>
    <div v-else-if="error" class="card">
      <div class="card-body text-sm text-red-600">
        Erreur de chargement des projets
        <span v-if="error.message">: {{ error.message }}</span>
      </div>
    </div>

    <div v-else class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Projets récents</h2>
        <NuxtLink :to="localePath('/studio/projects')" class="btn btn-ghost btn-sm">
          Voir tout
        </NuxtLink>
      </div>

      <div v-if="!recentProjects.length" class="card">
        <div class="card-body text-muted">Aucun projet trouvé. Crée ton premier projet.</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="project in recentProjects"
          :key="project.slug"
          :to="localePath(`/studio/projects/${project.slug}`)"
          class="card hover:bg-surface2"
        >
          <div class="card-body">
            <div class="font-semibold text-base">{{ project.title }}</div>
            <div class="text-xs text-muted">{{ project.slug }}</div>
            <div class="text-xs text-muted mt-2">Mis à jour: {{ formatDate(project.updated_at || project.created_at) }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
