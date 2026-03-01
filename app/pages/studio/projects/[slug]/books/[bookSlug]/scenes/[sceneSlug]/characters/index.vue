
<script setup>
definePageMeta({ middleware: ['auth'] })
import { computed } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))
const bookSlug = computed(() => String(route.params.bookSlug || ''))
const sceneSlug = computed(() => String(route.params.sceneSlug || ''))
</script>

<template>
  <CharacterList
    :apiBase="`/api/projects/${projectSlug}/books/${bookSlug}/scenes/${sceneSlug}/characters`"
    :toBase="`/studio/projects/${projectSlug}/books/${bookSlug}/scenes/${sceneSlug}/characters`"
    contextLabel="Characters (Scène du Book)"
    :backTo="`/studio/projects/${projectSlug}/books/${bookSlug}/scenes/${sceneSlug}`"
    backLabel="Back to scene"
  />
</template>
