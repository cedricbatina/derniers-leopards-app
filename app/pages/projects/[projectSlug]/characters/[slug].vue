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
        <NuxtLink :to="localePath(`/projects/${projectSlug}/characters`)" class="hover:text-primary transition">
          {{ t('domain.character.plural') }}
        </NuxtLink>
        <Icon name="mdi:chevron-right" class="w-4 h-4" />
        <span>{{ character?.name || slug }}</span>
      </nav>

      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div class="space-y-2 flex-1">
          <h1 class="text-4xl font-bold">{{ character?.name }}</h1>
          <p v-if="character?.surname" class="text-lg text-muted">{{ character.surname }}</p>
          <div v-if="character?.role" class="pt-2">
            <span class="badge">{{ character.role }}</span>
          </div>
        </div>

        <!-- Actions for authenticated users -->
        <div v-if="user && isProjectOwner" class="flex gap-2 flex-wrap">
          <NuxtLink 
            :to="localePath(`/studio/projects/${projectSlug}/characters/${slug}`)"
            class="btn btn-sm btn-primary"
          >
            <Icon name="mdi:pencil" />
            {{ t('common.edit') }}
          </NuxtLink>
          <button 
            @click="$emit('delete')" 
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
        {{ error.data?.message || 'Failed to load character' }}
      </div>
    </div>

    <!-- Character content -->
    <div v-else-if="character" class="space-y-6">
      <!-- Avatar section -->
      <div class="card">
        <div class="card-body">
          <div class="flex flex-col sm:flex-row gap-6">
            <!-- Avatar -->
            <div class="shrink-0">
              <div 
                v-if="character.avatar_url"
                class="w-32 h-32 sm:w-40 sm:h-40 rounded-lg bg-cover bg-center border-2 border-border"
                :style="{ backgroundImage: `url(${character.avatar_url})` }"
              />
              <div 
                v-else
                class="w-32 h-32 sm:w-40 sm:h-40 rounded-lg bg-linear-to-br from-primary to-primary/50 flex items-center justify-center border-2 border-border"
              >
                <Icon name="mdi:account" class="w-20 h-20 text-white" />
              </div>
            </div>

            <!-- Basic info -->
            <div class="flex-1 space-y-4">
              <div>
                <h3 class="text-sm font-semibold text-muted">{{ t('domain.character.name') }}</h3>
                <p class="text-lg">{{ character.name }}</p>
              </div>

              <div v-if="character.surname">
                <h3 class="text-sm font-semibold text-muted">{{ t('domain.character.surname') }}</h3>
                <p class="text-lg">{{ character.surname }}</p>
              </div>

              <div v-if="character.age">
                <h3 class="text-sm font-semibold text-muted">{{ t('domain.character.age') }}</h3>
                <p>{{ character.age }}</p>
              </div>

              <div v-if="character.birthplace">
                <h3 class="text-sm font-semibold text-muted">{{ t('domain.character.birthplace') }}</h3>
                <p>{{ character.birthplace }}</p>
              </div>

              <div v-if="character.role">
                <h3 class="text-sm font-semibold text-muted">{{ t('domain.character.role') }}</h3>
                <p>{{ character.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div v-if="character.description" class="card">
        <div class="card-body space-y-3">
          <h2 class="text-xl font-bold">{{ t('domain.character.description') }}</h2>
          <p class="text-muted whitespace-pre-wrap">{{ character.description }}</p>
        </div>
      </div>

      <!-- Attributes -->
      <div v-if="hasAttributes" class="grid sm:grid-cols-2 gap-4">
        <div v-if="character.personality" class="card">
          <div class="card-body space-y-2">
            <h3 class="font-bold">{{ t('domain.character.personality') }}</h3>
            <p class="text-muted text-sm">{{ character.personality }}</p>
          </div>
        </div>

        <div v-if="character.background" class="card">
          <div class="card-body space-y-2">
            <h3 class="font-bold">{{ t('domain.character.background') }}</h3>
            <p class="text-muted text-sm">{{ character.background }}</p>
          </div>
        </div>

        <div v-if="character.motivations" class="card">
          <div class="card-body space-y-2">
            <h3 class="font-bold">{{ t('domain.character.motivations') }}</h3>
            <p class="text-muted text-sm">{{ character.motivations }}</p>
          </div>
        </div>

        <div v-if="character.conflicts" class="card">
          <div class="card-body space-y-2">
            <h3 class="font-bold">{{ t('domain.character.conflicts') }}</h3>
            <p class="text-muted text-sm">{{ character.conflicts }}</p>
          </div>
        </div>
      </div>

      <!-- Related scenes -->
      <div v-if="relatedScenes.length" class="card">
        <div class="card-body space-y-4">
          <h2 class="text-xl font-bold">{{ t('domain.scene.plural') }} ({{ relatedScenes.length }})</h2>
          <div class="grid gap-2">
            <div 
              v-for="scene in relatedScenes" 
              :key="scene.id"
              class="p-3 bg-surface2 rounded border border-border hover:bg-surface3 transition"
            >
              <NuxtLink 
                :to="localePath(`/projects/${projectSlug}/scenes/${scene.slug}`)"
                class="block group"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold group-hover:text-primary transition">scene {{ scene.scene_no }}: {{ scene.title }}</div>
                    <p class="text-xs text-muted">{{ scene.chapter_title }}</p>
                  </div>
                  <Icon name="mdi:chevron-right" class="w-4 h-4 text-muted shrink-0" />
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Related relations -->
      <div v-if="relatonships.length" class="card">
        <div class="card-body space-y-4">
          <h2 class="text-xl font-bold">{{ t('domain.character.relations') }}</h2>
          <div class="grid gap-2">
            <div 
              v-for="rel in relatonships" 
              :key="rel.id"
              class="p-3 bg-surface2 rounded border border-border"
            >
              <NuxtLink 
                :to="localePath(`/projects/${projectSlug}/characters/${rel.related_character.slug}`)"
                class="block group"
              >
                <div class="flex items-center justify-between gap-2">
                  <div>
                    <div class="font-semibold group-hover:text-primary transition">{{ rel.related_character.name }}</div>
                    <p class="text-xs text-muted">{{ rel.relationship_type }}</p>
                  </div>
                  <Icon name="mdi:chevron-right" class="w-4 h-4 text-muted" />
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No character found -->
    <div v-else class="card">
      <div class="card-body text-center space-y-4 py-12">
        <Icon name="mdi:account-question" class="w-16 h-16 mx-auto text-muted opacity-50" />
        <div>
          <p class="font-semibold">{{ t('common.notFound') }}</p>
          <NuxtLink :to="localePath(`/projects/${projectSlug}/characters`)" class="link text-primary">
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

// Fetch character details
const { data, pending, error } = await useFetch(
  () => `/api/projects/${projectSlug.value}/characters/${slug.value}`,
  { 
    credentials: 'include',
    watch: [projectSlug, slug],
  }
)

const character = computed(() => data.value?.character)
const project = computed(() => data.value?.project)
const relatedScenes = computed(() => data.value?.scenes || [])
const relatonships = computed(() => data.value?.relationships || [])

const hasAttributes = computed(() => 
  character.value?.personality || 
  character.value?.background || 
  character.value?.motivations || 
  character.value?.conflicts
)

const isProjectOwner = computed(() => {
  return project.value?.user_id === user.value?.id
})
</script>
