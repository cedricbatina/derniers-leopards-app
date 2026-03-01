<template>
  <section class="max-w-6xl mx-auto py-8 px-4 space-y-8">
    <!-- Header with breadcrumb -->
    <div class="space-y-4">
      <nav class="flex items-center gap-2 text-sm text-muted">
        <NuxtLink :to="localePath('/projects')" class="hover:text-primary transition">
          {{ t('domain.project.plural') }}
        </NuxtLink>
        <Icon name="mdi:chevron-right" class="w-4 h-4" />
        <NuxtLink :to="localePath(`/projects/${projectSlug}`)" class="hover:text-primary transition">
          {{ project?.title || projectSlug }}
        </NuxtLink>
        <Icon name="mdi:chevron-right" class="w-4 h-4" />
        <span>{{ t('domain.character.plural') }}</span>
      </nav>

      <div class="space-y-2">
        <h1 class="text-4xl font-bold">{{ t('domain.character.plural') }}</h1>
        <p v-if="project?.description" class="text-lg text-muted">{{ project.description }}</p>
      </div>
    </div>

    <!-- Studio link for authenticated users -->
    <div v-if="user" class="flex gap-2 flex-wrap">
      <NuxtLink 
        :to="localePath(`/studio/projects/${projectSlug}/characters`)"
        class="btn btn-sm btn-primary"
      >
        <Icon name="mdi:pencil" />
        {{ t('common.manage') }}
      </NuxtLink>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div v-for="i in 8" :key="i" class="card animate-pulse">
        <div class="card-body space-y-3">
          <div class="h-16 bg-surface2 rounded-full w-16 mx-auto"></div>
          <div class="h-6 bg-surface2 rounded w-2/3 mx-auto"></div>
          <div class="h-4 bg-surface2 rounded w-full"></div>
          <div class="h-4 bg-surface2 rounded w-4/5"></div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="card border border-red-500/50 bg-red-500/10">
      <div class="card-body flex items-center gap-3 text-red-600">
        <Icon name="mdi:alert-circle" />
        {{ error.data?.message || 'Failed to load characters' }}
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!characters.length" class="card">
      <div class="card-body text-center space-y-4 py-12">
        <Icon name="mdi:account-off" class="w-16 h-16 mx-auto text-muted opacity-50" />
        <div>
          <p class="font-semibold">{{ t('common.noData') }}</p>
          <p class="text-sm text-muted">{{ t('domain.character.empty') }}</p>
        </div>
      </div>
    </div>

    <!-- Characters grid -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <NuxtLink
        v-for="character in characters"
        :key="character.id"
        :to="localePath(`/projects/${projectSlug}/characters/${character.slug}`)"
        class="group"
      >
        <div class="card card-hover h-full">
          <div class="card-body space-y-3">
            <!-- Avatar -->
            <div class="flex justify-center">
              <div 
                v-if="character.avatar_url"
                class="w-16 h-16 rounded-full bg-cover bg-center border-2 border-border"
                :style="{ backgroundImage: `url(${character.avatar_url})` }"
              />
              <div 
                v-else
                class="w-16 h-16 rounded-full bg-linear-to-br from-primary to-primary/50 flex items-center justify-center border-2 border-border"
              >
                <Icon name="mdi:account" class="w-8 h-8 text-white" />
              </div>
            </div>

            <!-- Name -->
            <div class="text-center space-y-1">
              <h3 class="font-bold text-lg group-hover:text-primary transition">
                {{ character.name }}
              </h3>
              <p v-if="character.surname" class="text-sm text-muted">{{ character.surname }}</p>
            </div>

            <!-- Role badge -->
            <div v-if="character.role" class="flex justify-center">
              <span class="badge badge-sm">{{ character.role }}</span>
            </div>

            <!-- Description -->
            <p v-if="character.description" class="text-sm text-muted text-center line-clamp-2">
              {{ character.description }}
            </p>

            <!-- Meta info -->
            <div v-if="character.age || character.birthplace" class="text-xs text-muted space-y-1 text-center pt-2 border-t border-border">
              <div v-if="character.age">{{ t('domain.character.age') }}: {{ character.age }}</div>
              <div v-if="character.birthplace">{{ t('domain.character.birthplace') }}: {{ character.birthplace }}</div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocalePath, definePageMeta } from '#imports'

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const projectSlug = computed(() => String(route.params.projectSlug || ''))

// Get user from auth store
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Fetch characters for this project
const { data, pending, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/characters`,
  { 
    credentials: 'include',
    watch: [projectSlug],
  }
)

const characters = computed(() => {
  return (data.value?.characters || []).sort((a, b) => 
    (a.name || '').localeCompare(b.name || '')
  )
})

const project = computed(() => data.value?.project)
</script>
