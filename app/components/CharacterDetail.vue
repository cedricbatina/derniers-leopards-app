<script setup>
import CharacterDetailInternal from '~/components/characters/CharacterDetail.vue'

const props = defineProps({
  apiBase: { type: String, required: true },
  characterSlug: { type: String, required: true },
  backTo: { type: String, default: '' },
  backLabel: { type: String, default: 'Back' },
})
</script>

<template>
  <CharacterDetailInternal v-bind="props" />
</template>
