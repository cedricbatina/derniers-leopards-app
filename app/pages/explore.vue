<script setup>
const { items } = useAppBreadcrumbs()
</script>

<template>
  <div class="explore-parent space-y-5">
    <ExploreSectionNav />
    <div class="max-w-[72rem] mx-auto w-full px-4 sm:px-6">
      <AppBreadcrumbs :items="items" />
    </div>
    <NuxtPage />
  </div>
</template>