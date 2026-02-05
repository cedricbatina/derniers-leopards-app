<script setup>
import { computed } from 'vue'
import { useColorMode } from '#imports'

const mode = useColorMode()

const nextMode = computed(() => {
  const v = mode.preference || 'system'
  if (v === 'system') return 'light'
  if (v === 'light') return 'dark'
  return 'system'
})

function cycle() {
  mode.preference = nextMode.value
}
</script>

<template>
  <button
    type="button"
    class="btn btn-ghost btn-icon focus-ring"
    :aria-label="`Theme: ${mode.preference}. Switch to ${nextMode}`"
    @click="cycle"
  >
    <Icon v-if="mode.preference === 'dark'" name="mdi:weather-night" aria-hidden="true" />
    <Icon v-else-if="mode.preference === 'light'" name="mdi:white-balance-sunny" aria-hidden="true" />
    <Icon v-else name="mdi:theme-light-dark" aria-hidden="true" />
  </button>
</template>
