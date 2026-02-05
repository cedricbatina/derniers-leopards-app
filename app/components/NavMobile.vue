<script setup>
import { ref } from 'vue'
import { useLocalePath } from '#imports'

const open = ref(false)
const localePath = useLocalePath()
</script>

<template>
  <div class="sm:hidden relative">
    <button type="button" class="btn btn-ghost btn-icon focus-ring" @click="open = !open" aria-label="Menu">
      <Icon name="mdi:menu" aria-hidden="true" />
    </button>

    <div v-if="open" class="menu-pop card" @click="open=false">
      <NuxtLink :to="localePath('/explore')" class="menu-item">Explore</NuxtLink>
      <NuxtLink :to="localePath('/studio/projects')" class="menu-item">Studio</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.menu-pop{
  position: absolute;
  right: 0;
  top: calc(100% + .5rem);
  min-width: 12rem;
  padding: .5rem;
}
.menu-item{
  display:block;
  padding: .6rem .75rem;
  border-radius: .75rem;
}
.menu-item:hover{ background: rgb(var(--surface2)); }
</style>
