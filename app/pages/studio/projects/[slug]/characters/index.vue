
<script setup>
definePageMeta({ middleware: ['auth'] })
import { computed } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))
</script>

<template>
  <CharacterList
    :apiBase="`/api/projects/${projectSlug}/characters`"
    :toBase="`/studio/projects/${projectSlug}/characters`"
    contextLabel="Characters"
    :backTo="`/studio/projects/${projectSlug}`"
    backLabel="Back to project"
  />
</template>
