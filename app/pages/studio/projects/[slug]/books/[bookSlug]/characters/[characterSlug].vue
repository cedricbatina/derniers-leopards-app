
<script setup>
definePageMeta({ middleware: ['auth'] })
import { computed } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))
const bookSlug = computed(() => String(route.params.bookSlug || ''))
const characterSlug = computed(() => String(route.params.characterSlug || ''))
const allowTrashed = computed(() => String(route.query.trashed || '') === '1')
</script>

<template>
  <CharacterDetail
    :apiBase="`/api/projects/${projectSlug}/books/${bookSlug}/characters`"
    :characterSlug="characterSlug"
    :backTo="`/studio/projects/${projectSlug}/books/${bookSlug}/characters${allowTrashed ? '?trashed=1' : ''}`"
    backLabel="Back to characters"
  />
</template>
