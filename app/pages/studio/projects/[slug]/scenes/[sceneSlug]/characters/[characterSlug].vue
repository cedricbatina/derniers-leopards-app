
<script setup>
definePageMeta({ middleware: ['auth'] })
import { computed } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))
const sceneSlug = computed(() => String(route.params.sceneSlug || ''))
const characterSlug = computed(() => String(route.params.characterSlug || ''))
const allowTrashed = computed(() => String(route.query.trashed || '') === '1')
</script>

<template>
  <CharacterDetail
    :apiBase="`/api/projects/${projectSlug}/scenes/${sceneSlug}/characters`"
    :characterSlug="characterSlug"
    :backTo="`/studio/projects/${projectSlug}/scenes/${sceneSlug}/characters${allowTrashed ? '?trashed=1' : ''}`"
    backLabel="Back to characters"
  />
</template>
