<script setup>
definePageMeta({ middleware: 'auth' })

import { computed } from 'vue'
import { useLocalePath } from '#imports'

const route = useRoute()
const localePath = useLocalePath()

const projectSlug = computed(() => String(route.params.slug || '').trim())

const tiles = computed(() => ([
  { label: 'Books',       icon: 'mdi:book-open-page-variant-outline', to: `/studio/projects/${projectSlug.value}/books`,       desc: 'Tomes, chapitres, structure.' },
  { label: 'Scenes',      icon: 'mdi:movie-open-outline',             to: `/studio/projects/${projectSlug.value}/scenes`,      desc: 'Écriture, enjeux, arcs.' },
  { label: 'Characters',  icon: 'mdi:account-group-outline',          to: `/studio/projects/${projectSlug.value}/characters`,  desc: 'Personnages, liens, fiches.' },
  { label: 'Timeline',    icon: 'mdi:timeline-outline',               to: `/studio/projects/${projectSlug.value}/timeline`,    desc: 'Chronologie & événements.' },
  { label: 'Glossary',    icon: 'mdi:book-alphabet',                  to: `/studio/projects/${projectSlug.value}/glossary`,    desc: 'Lexique, lieux, concepts.' },
]))
</script>

<template>
  <div class="page space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Studio</h1>
        <p class="text-sm text-muted">
          Projet : <span class="font-semibold">{{ projectSlug }}</span>
        </p>
      </div>

      <NuxtLink :to="localePath('/studio')" class="btn btn-ghost focus-ring">
        <Icon name="mdi:arrow-left" aria-hidden="true" />
        Projects
      </NuxtLink>
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      <NuxtLink
        v-for="t in tiles"
        :key="t.label"
        :to="localePath(t.to)"
        class="card hover:bg-surface2 transition"
      >
        <div class="card-body flex items-start gap-3">
          <div class="badge">
            <Icon :name="t.icon" aria-hidden="true" />
          </div>

          <div class="min-w-0">
            <div class="font-extrabold">{{ t.label }}</div>
            <div class="text-sm text-muted mt-1">{{ t.desc }}</div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
