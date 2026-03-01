
<script setup>
definePageMeta({ middleware: ['auth'] })
import { computed } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))
const characterSlug = computed(() => String(route.params.characterSlug || ''))
const allowTrashed = computed(() => String(route.query.trashed || '') === '1')
</script>

<template>
  <CharacterDetail
    :apiBase="`/api/projects/${projectSlug}/characters`"
    :characterSlug="characterSlug"
    :backTo="`/studio/projects/${projectSlug}/characters${allowTrashed ? '?trashed=1' : ''}`"
    backLabel="Back to characters"
  />
</template>
