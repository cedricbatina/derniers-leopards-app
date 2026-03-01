<script setup>
import CharacterListInternal from '~/components/characters/CharacterList.vue'

const props = defineProps({
  apiBase: { type: String, required: true },
  toBase: { type: String, required: true },
  contextLabel: { type: String, default: 'Characters' },
  backTo: { type: String, default: '' },
  backLabel: { type: String, default: 'Back' },
})

const emit = defineEmits(['refresh'])
</script>

<template>
  <CharacterListInternal v-bind="props" @refresh="emit('refresh')" />
</template>
