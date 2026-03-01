<script setup>
const localePath = useLocalePath()

await navigateTo(localePath('/explore/characters'), {
  redirectCode: 301,
})
</script>

<template>
  <div class="page">
    <!-- Redirection to /explore/characters -->
  </div>
</template>
