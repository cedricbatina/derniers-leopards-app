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
        <span>{{ t('domain.scene.plural') }}</span>
      </nav>

      <div class="space-y-2">
        <h1 class="text-4xl font-bold">{{ t('domain.scene.plural') }}</h1>
        <p v-if="project?.description" class="text-lg text-muted">{{ project.description }}</p>
      </div>
    </div>

    <!-- Studio link for authenticated users -->
    <div v-if="user" class="flex gap-2 flex-wrap">
      <NuxtLink 
        :to="localePath(`/studio/projects/${projectSlug}/scenes`)"
        class="btn btn-sm btn-primary"
      >
        <Icon name="mdi:pencil" />
        {{ t('common.manage') }}
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 flex-wrap">
      <button 
        @click="filterChapter = null"
        :class="['btn btn-sm', filterChapter === null ? 'btn-primary' : 'btn-ghost']"
      >
        {{ t('domain.scene.all') }}
      </button>
      <button 
        v-for="chapter in chapters"
        :key="chapter"
        @click="filterChapter = chapter"
        :class="['btn btn-sm', filterChapter === chapter ? 'btn-primary' : 'btn-ghost']"
      >
        {{ chapter }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="space-y-3">
      <div v-for="i in 6" :key="i" class="card animate-pulse">
        <div class="card-body space-y-2">
          <div class="h-6 bg-surface2 rounded w-1/4"></div>
          <div class="h-4 bg-surface2 rounded w-full"></div>
          <div class="h-4 bg-surface2 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="card border border-red-500/50 bg-red-500/10">
      <div class="card-body flex items-center gap-3 text-red-600">
        <Icon name="mdi:alert-circle" />
        {{ error.data?.message || 'Failed to load scenes' }}
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!filteredScenes.length" class="card">
      <div class="card-body text-center space-y-4 py-12">
        <Icon name="mdi:file-document-outline" class="w-16 h-16 mx-auto text-muted opacity-50" />
        <div>
          <p class="font-semibold">{{ t('common.noData') }}</p>
          <p class="text-sm text-muted">{{ t('domain.scene.empty') }}</p>
        </div>
      </div>
    </div>

    <!-- Scenes list -->
    <div v-else class="space-y-4">
      <div 
        v-for="scene in filteredScenes"
        :key="scene.id"
        class="card card-hover"
      >
        <NuxtLink 
          :to="localePath(`/projects/${projectSlug}/scenes/${scene.slug}`)"
          class="block no-underline text-inherit hover:text-inherit"
        >
          <div class="card-body space-y-3">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="badge badge-sm">Scene {{ scene.scene_no }}</span>
                  <h3 class="text-xl font-bold group-hover:text-primary transition">
                    {{ scene.title }}
                  </h3>
                </div>
                <p class="text-sm text-muted mt-1">{{ scene.chapter_title }}</p>
              </div>
              <Icon name="mdi:chevron-right" class="w-5 h-5 text-muted shrink-0 mt-1" />
            </div>

            <!-- Description -->
            <p v-if="scene.description" class="text-muted line-clamp-2">
              {{ scene.description }}
            </p>

            <!-- Scene meta -->
            <div class="flex flex-wrap gap-3 text-xs text-muted pt-2 border-t border-border">
              <div v-if="scene.setting" class="flex items-center gap-1.5">
                <Icon name="mdi:map-marker" class="w-4 h-4" />
                {{ scene.setting }}
              </div>
              <div v-if="scene.pov_character" class="flex items-center gap-1.5">
                <Icon name="mdi:account-circle" class="w-4 h-4" />
                POV: {{ scene.pov_character.name }}
              </div>
              <div v-if="scene.scenes_characters?.length" class="flex items-center gap-1.5">
                <Icon name="mdi:account-multiple" class="w-4 h-4" />
                {{ scene.scenes_characters.length }} {{ t('domain.character.plural') }}
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
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
const filterChapter = ref(null)

// Get user from auth store
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Fetch scenes for this project
const { data, pending, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/scenes`,
  { 
    credentials: 'include',
    watch: [projectSlug],
  }
)

const scenes = computed(() => {
  return (data.value?.scenes || []).sort((a, b) => 
    (a.scene_no || 0) - (b.scene_no || 0)
  )
})

const chapters = computed(() => {
  const chaptersSet = new Set(scenes.value.map(s => s.chapter_title).filter(Boolean))
  return Array.from(chaptersSet).sort()
})

const filteredScenes = computed(() => {
  if (!filterChapter.value) return scenes.value
  return scenes.value.filter(s => s.chapter_title === filterChapter.value)
})

const project = computed(() => data.value?.project)
</script>
