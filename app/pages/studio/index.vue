
<script setup>
definePageMeta({ middleware: 'auth' })
import { ref, computed } from 'vue'
import { useLocalePath, useFetch, useRequestHeaders, useI18n } from '#imports'
import { useAuthStore } from '~/stores/auth.store'
const localePath = useLocalePath()
const auth = useAuthStore()
const { t } = useI18n()

const { data, pending, error } = await useFetch('/api/projects', {
  credentials: 'include',
  headers: useRequestHeaders(['cookie']),
})

const projectsCount = computed(() => data.value?.projects?.filter(p => !p.deleted_at)?.length || 0)
const userDisplayName = computed(() => auth.user?.display_name || auth.user?.username || auth.user?.email)
</script>

<template>
  <div class="page space-y-8">
    <div class="flex justify-end mb-2 gap-2">
      <NuxtLink :to="localePath('/studio/todos')" class="btn btn-outline btn-sm">
        <Icon name="mdi:checkbox-marked-outline" class="mr-1" /> {{ t('domain.todo.myTasks') }}
      </NuxtLink>
      <NuxtLink :to="localePath('/studio/projects')" class="btn btn-outline btn-sm">
        <Icon name="mdi:view-dashboard-outline" class="mr-1" /> Tous les projets
      </NuxtLink>
    </div>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
      <div class="flex items-center gap-4">
        <img
          v-if="auth.user?.avatar_url"
          :src="auth.user.avatar_url"
          :alt="t('profile.avatarAlt', { name: userDisplayName })"
          class="rounded-full w-20 h-20 border border-primary shadow-lg object-cover"
        />
        <div>
          <h1 class="text-2xl font-extrabold mb-1">{{ t('dashboard.welcome', { name: userDisplayName }) }}</h1>
          <div class="text-muted text-sm mb-1">{{ auth.user?.profession || auth.user?.username }}</div>
          <div class="text-muted text-xs">{{ auth.user?.email }}</div>
        </div>
      </div>
      <div class="flex flex-col items-end gap-2">
        <div class="text-lg font-semibold">
          <Icon name="mdi:briefcase" class="mr-1 text-primary" />
          {{ projectsCount }} {{ t('dashboard.projects', projectsCount) }}
        </div>
        <NuxtLink :to="localePath('/studio/projects')" class="btn btn-primary btn-lg">
          <Icon name="mdi:plus" class="mr-2" />{{ t('dashboard.newProject') }}
        </NuxtLink>
      </div>
    </div>

    <p class="text-muted mb-4">{{ t('dashboard.subtitle') }}</p>

    <div v-if="pending" class="text-muted">Chargement des projets…</div>
    <div v-else-if="error" class="text-red-600">
      Erreur de chargement des projets
      <span v-if="error.message">: {{ error.message }}</span>
      <span v-if="error.data"> ({{ error.data }})</span>
    </div>
    <div v-else-if="!data?.projects?.length" class="text-muted">Aucun projet trouvé. Crée ton premier projet !</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="p in data.projects.filter(p => !p.deleted_at)" :key="p.slug" class="card dashboard-link">
        <div class="card-body">
          <div class="font-bold text-lg mb-1">{{ p.title }}</div>
          <div class="text-xs text-muted mb-2">{{ p.slug }}</div>
          <div class="flex flex-wrap gap-2">
            <NuxtLink :to="localePath(`/studio/projects/${p.slug}/books`)" class="btn btn-xs btn-secondary">
              <Icon name="mdi:book-open-page-variant" class="mr-1" /> Livres
            </NuxtLink>
            <NuxtLink :to="localePath(`/studio/projects/${p.slug}/characters`)" class="btn btn-xs btn-secondary">
              <Icon name="mdi:account-group" class="mr-1" /> Personnages
            </NuxtLink>
            <NuxtLink :to="localePath(`/studio/projects/${p.slug}/scenes`)" class="btn btn-xs btn-secondary">
              <Icon name="mdi:movie-open" class="mr-1" /> Scènes
            </NuxtLink>
            <NuxtLink :to="localePath(`/studio/projects/${p.slug}/timeline`)" class="btn btn-xs btn-secondary">
              <Icon name="mdi:timeline" class="mr-1" /> Chronologie
            </NuxtLink>
            <NuxtLink :to="localePath(`/studio/projects/${p.slug}/glossary`)" class="btn btn-xs btn-secondary">
              <Icon name="mdi:book" class="mr-1" /> Glossaire
            </NuxtLink>
            <NuxtLink :to="localePath(`/studio/projects/${p.slug}/todos`)" class="btn btn-xs btn-secondary">
              <Icon name="mdi:checkbox-marked-outline" class="mr-1" /> {{ t('domain.todo.plural') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-link {
  transition: box-shadow 0.2s;
}
.dashboard-link:hover {
  box-shadow: 0 0 0 2px rgb(var(--primary));
}
</style>
