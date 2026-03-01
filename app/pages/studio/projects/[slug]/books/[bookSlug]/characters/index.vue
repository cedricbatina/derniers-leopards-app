
<script setup>
definePageMeta({ middleware: ['auth'] })
import { computed } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))
const bookSlug = computed(() => String(route.params.bookSlug || ''))
</script>

<template>
  <CharacterList
    :apiBase="`/api/projects/${projectSlug}/books/${bookSlug}/characters`"
    :toBase="`/studio/projects/${projectSlug}/books/${bookSlug}/characters`"
    contextLabel="Characters (Book)"
    :backTo="`/studio/projects/${projectSlug}/books/${bookSlug}`"
    backLabel="Back to book"
  />
</template>
