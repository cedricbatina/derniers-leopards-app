<script setup>
/**
 * Liens courts « Voir aussi » pour éviter que deux pages du guide
 * se répètent longuement : une phrase + 1–3 liens.
 */
defineProps({
  title: {
    type: String,
    required: true,
  },
  links: {
    type: Array,
    required: true,
    // { to: string, label: string, hint?: string }
  },
})
</script>

<template>
  <aside
    class="explore-related rounded-2xl border border-dashed border-border/80 bg-surface2/60 px-4 py-4 sm:px-5"
  >
    <p class="text-xs font-bold uppercase tracking-wide text-muted mb-2">
      {{ title }}
    </p>
    <ul class="list-none m-0 p-0 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
      <li v-for="(link, i) in links" :key="i" class="min-w-0">
        <NuxtLink
          :to="link.to"
          class="explore-related__link group flex flex-col rounded-xl border border-border bg-surface px-3 py-2 transition hover:border-brand focus-ring"
        >
          <span class="font-semibold text-sm flex items-center gap-1">
            {{ link.label }}
            <Icon name="mdi:chevron-right" class="opacity-50 group-hover:translate-x-0.5 transition text-base" aria-hidden="true" />
          </span>
          <span v-if="link.hint" class="text-xs text-muted mt-0.5">{{ link.hint }}</span>
        </NuxtLink>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.explore-related__link {
  text-decoration: none;
  color: inherit;
}
</style>
