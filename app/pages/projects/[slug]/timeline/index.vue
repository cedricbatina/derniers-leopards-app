<script setup>
definePageMeta({ middleware: ['auth'] })

import { computed } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink class="text-sm text-muted hover:opacity-100" :to="localePath(`/studio/projects/${projectSlug}`)">
      ← Back to project
    </NuxtLink>

    <div class="card">
      <div class="card-body">
        <h1 class="text-xl font-semibold">Timeline</h1>
        <p class="text-sm text-muted mt-2">Placeholder (on branchera la timeline ici).</p>
      </div>
    </div>
  </div>
</template>
