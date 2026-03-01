
<script setup>
definePageMeta({ middleware: ['auth'] })
import { computed } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))
const sceneSlug = computed(() => String(route.params.sceneSlug || ''))
</script>

<template>
  <CharacterList
    :apiBase="`/api/projects/${projectSlug}/scenes/${sceneSlug}/characters`"
    :toBase="`/studio/projects/${projectSlug}/scenes/${sceneSlug}/characters`"
    contextLabel="Characters (Scène)"
    :backTo="`/studio/projects/${projectSlug}/scenes/${sceneSlug}`"
    backLabel="Back to scene"
  />
</template>
