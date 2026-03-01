<script setup>
import TodoListInternal from '~/components/todos/TodoList.vue'

const props = defineProps({
  apiBase: { type: String, required: true },
  contextLabel: { type: String, default: 'Todos' },
  showProject: { type: Boolean, default: false },
  backTo: { type: String, default: '' },
  backLabel: { type: String, default: 'Back' },
})

const emit = defineEmits(['refresh'])
</script>

<template>
  <TodoListInternal v-bind="props" @refresh="emit('refresh')" />
</template>
