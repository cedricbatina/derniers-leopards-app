<script setup>
const { items } = useAppBreadcrumbs()
</script>

<template>
  <div class="studio-parent space-y-5">
    <StudioWorkspaceNav />
    <div class="max-w-[72rem] mx-auto w-full px-4 sm:px-6">
      <AppBreadcrumbs :items="items" />
    </div>
    <NuxtPage />
  </div>
</template>
