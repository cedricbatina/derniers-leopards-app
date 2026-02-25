<script setup>
import { computed } from 'vue'

const route = useRoute()
const projectSlug = computed(() => String(route.params.slug || ''))
</script>

<template>
  <div class="page">
    <div class="card">
      <div class="card-body">
        <h1 class="text-xl font-semibold">Project</h1>
        <p class="text-sm text-muted">Public view placeholder for: {{ projectSlug }}</p>
      </div>
    </div>
  </div>
</template>
