<script setup>
definePageMeta({ middleware: ['auth'] })
import { computed } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))
</script>

<template>
  <TodoList
    :apiBase="`/api/projects/${projectSlug}/todos`"
    contextLabel="Project Todos"
    :backTo="`/studio/projects/${projectSlug}`"
    backLabel="Back to project"
  />
</template>
