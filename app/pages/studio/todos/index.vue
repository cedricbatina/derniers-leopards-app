<script setup>
definePageMeta({ middleware: ['auth'] })
</script>

<template>
  <TodoList
    apiBase="/api/todos"
    contextLabel="All Todos"
    :showProject="true"
  />
</template>
