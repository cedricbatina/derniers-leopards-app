<template>
  <section class="max-w-4xl mx-auto py-8 px-4 space-y-8">
    <!-- Header with breadcrumb -->
    <div class="space-y-4">
      <nav class="flex items-center gap-2 text-sm text-muted flex-wrap">
        <NuxtLink :to="localePath('/projects')" class="hover:text-primary transition">
          {{ t('domain.project.plural') }}
        </NuxtLink>
        <Icon name="mdi:chevron-right" class="w-4 h-4" />
        <NuxtLink :to="localePath(`/projects/${projectSlug}`)" class="hover:text-primary transition">
          {{ project?.title || projectSlug }}
        </NuxtLink>
        <Icon name="mdi:chevron-right" class="w-4 h-4" />
        <NuxtLink :to="localePath(`/projects/${projectSlug}/scenes`)" class="hover:text-primary transition">
          {{ t('domain.scene.plural') }}
        </NuxtLink>
        <Icon name="mdi:chevron-right" class="w-4 h-4" />
        <span>{{ scene?.title || slug }}</span>
      </nav>

      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div class="space-y-2 flex-1">
          <h1 class="text-4xl font-bold">{{ scene?.title }}</h1>
          <p class="text-lg text-muted">{{ t('domain.scene.label') }} {{ scene?.scene_no }}</p>
          <div class="pt-2 space-x-2 flex flex-wrap">
            <span v-if="scene?.chapter_title" class="badge">{{ scene.chapter_title }}</span>
            <span v-if="scene?.setting" class="badge badge-outline">{{ scene.setting }}</span>
          </div>
        </div>

        <!-- Actions for authenticated users -->
        <div v-if="user && isProjectOwner" class="flex gap-2 flex-wrap">
          <NuxtLink 
            :to="localePath(`/studio/projects/${projectSlug}/scenes/${slug}`)"
            class="btn btn-sm btn-primary"
          >
            <Icon name="mdi:pencil" />
            {{ t('common.edit') }}
          </NuxtLink>
          <button 
            @click="confirmDelete"
            class="btn btn-sm btn-ghost text-red-600 hover:bg-red-500/10"
          >
            <Icon name="mdi:trash" />
            {{ t('common.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="space-y-6">
      <div class="card animate-pulse">
        <div class="card-body space-y-4">
          <div class="h-12 bg-surface2 rounded w-1/3"></div>
          <div class="h-32 bg-surface2 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="card border border-red-500/50 bg-red-500/10">
      <div class="card-body flex items-center gap-3 text-red-600">
        <Icon name="mdi:alert-circle" />
        {{ error.data?.message || 'Failed to load scene' }}
      </div>
    </div>

    <!-- Scene content -->
    <div v-else-if="scene" class="space-y-6">
      <!-- Main description -->
      <div v-if="scene.description" class="card">
        <div class="card-body space-y-3">
          <h2 class="text-xl font-bold">{{ t('domain.scene.description') }}</h2>
          <p class="text-muted whitespace-pre-wrap">{{ scene.description }}</p>
        </div>
      </div>

      <!-- Scene structure -->
      <div v-if="hasStructure" class="grid sm:grid-cols-3 gap-4">
        <div v-if="scene.scene_objective" class="card">
          <div class="card-body space-y-2">
            <h3 class="font-bold">{{ t('domain.scene.objective') }}</h3>
            <p class="text-muted text-sm">{{ scene.scene_objective }}</p>
          </div>
        </div>

        <div v-if="scene.conflict" class="card">
          <div class="card-body space-y-2">
            <h3 class="font-bold">{{ t('domain.scene.conflict') }}</h3>
            <p class="text-muted text-sm">{{ scene.conflict }}</p>
          </div>
        </div>

        <div v-if="scene.outcome" class="card">
          <div class="card-body space-y-2">
            <h3 class="font-bold">{{ t('domain.scene.outcome') }}</h3>
            <p class="text-muted text-sm">{{ scene.outcome }}</p>
          </div>
        </div>
      </div>

      <!-- POV Character -->
      <div v-if="scene.pov_character" class="card">
        <div class="card-body flex flex-col sm:flex-row gap-4 items-start">
          <div class="shrink-0">
            <div 
              v-if="scene.pov_character.avatar_url"
              class="w-16 h-16 rounded-lg bg-cover bg-center border-2 border-border"
              :style="{ backgroundImage: `url(${scene.pov_character.avatar_url})` }"
            />
            <div 
              v-else
              class="w-16 h-16 rounded-lg bg-linear-to-br from-primary to-primary/50 flex items-center justify-center border-2 border-border"
            >
              <Icon name="mdi:account" class="w-8 h-8 text-white" />
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-lg">{{ t('domain.scene.povCharacter') }}</h3>
            <NuxtLink 
              :to="localePath(`/projects/${projectSlug}/characters/${scene.pov_character.slug}`)"
              class="text-primary hover:underline"
            >
              {{ scene.pov_character.name }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Characters in scene -->
      <div v-if="sceneCharacters.length" class="card">
        <div class="card-body space-y-4">
          <h2 class="text-xl font-bold">{{ t('domain.character.plural') }} ({{ sceneCharacters.length }})</h2>
          <div class="grid gap-3 sm:grid-cols-2">
            <div 
              v-for="char in sceneCharacters"
              :key="char.id"
              class="p-3 bg-surface2 rounded border border-border hover:bg-surface3 transition"
            >
              <NuxtLink 
                :to="localePath(`/projects/${projectSlug}/characters/${char.character.slug}`)"
                class="block group"
              >
                <div class="flex items-start gap-3">
                  <div 
                    v-if="char.character.avatar_url"
                    class="w-10 h-10 rounded-full bg-cover bg-center border border-border shrink-0"
                    :style="{ backgroundImage: `url(${char.character.avatar_url})` }"
                  />
                  <div 
                    v-else
                    class="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary/50 flex items-center justify-center border border-border shrink-0"
                  >
                    <Icon name="mdi:account" class="w-5 h-5 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold group-hover:text-primary transition">{{ char.character.name }}</div>
                    <div v-if="char.role" class="text-xs text-muted">{{ char.role }}</div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Scene notes -->
      <div v-if="scene.notes" class="card">
        <div class="card-body space-y-3">
          <h2 class="text-xl font-bold">{{ t('domain.scene.notes') }}</h2>
          <p class="text-muted whitespace-pre-wrap text-sm">{{ scene.notes }}</p>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex flex-wrap gap-2 justify-between pt-4 border-t border-border">
        <NuxtLink 
          v-if="prevScene"
          :to="localePath(`/projects/${projectSlug}/scenes/${prevScene.slug}`)"
          class="btn btn-sm btn-ghost"
        >
          <Icon name="mdi:chevron-left" />
          {{ prevScene.title }}
        </NuxtLink>
        <div v-else class="btn btn-sm btn-ghost disabled" />

        <NuxtLink 
          :to="localePath(`/projects/${projectSlug}/scenes`)"
          class="btn btn-sm btn-ghost"
        >
          {{ t('common.backToList') }}
        </NuxtLink>

        <NuxtLink 
          v-if="nextScene"
          :to="localePath(`/projects/${projectSlug}/scenes/${nextScene.slug}`)"
          class="btn btn-sm btn-ghost"
        >
          {{ nextScene.title }}
          <Icon name="mdi:chevron-right" />
        </NuxtLink>
        <div v-else class="btn btn-sm btn-ghost disabled" />
      </div>
    </div>

    <!-- No scene found -->
    <div v-else class="card">
      <div class="card-body text-center space-y-4 py-12">
        <Icon name="mdi:file-question" class="w-16 h-16 mx-auto text-muted opacity-50" />
        <div>
          <p class="font-semibold">{{ t('common.notFound') }}</p>
          <NuxtLink :to="localePath(`/projects/${projectSlug}/scenes`)" class="link text-primary">
            {{ t('common.backToList') }}
          </NuxtLink>
        </div>
      </div>
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
const slug = computed(() => String(route.params.slug || ''))

// Get user from auth store
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Fetch scene details
const { data, pending, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/scenes/${slug.value}`,
  { 
    credentials: 'include',
    watch: [projectSlug, slug],
  }
)

const scene = computed(() => data.value?.scene)
const project = computed(() => data.value?.project)
const allScenes = computed(() => data.value?.allScenes || [])
const sceneCharacters = computed(() => data.value?.characters || [])

const hasStructure = computed(() => 
  scene.value?.scene_objective || 
  scene.value?.conflict || 
  scene.value?.outcome
)

const isProjectOwner = computed(() => {
  return project.value?.user_id === user.value?.id
})

const currentSceneIndex = computed(() => {
  return allScenes.value.findIndex(s => s.id === scene.value?.id)
})

const prevScene = computed(() => {
  if (currentSceneIndex.value <= 0) return null
  return allScenes.value[currentSceneIndex.value - 1]
})

const nextScene = computed(() => {
  if (currentSceneIndex.value === -1 || currentSceneIndex.value >= allScenes.value.length - 1) return null
  return allScenes.value[currentSceneIndex.value + 1]
})

const confirmDelete = async () => {
  // This will be handled by the confirmation modal when integrated
  console.log('Delete scene:', scene.value)
}
</script>
