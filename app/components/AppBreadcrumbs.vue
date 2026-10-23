<script setup>
import { useI18n } from '#imports'

defineProps({
  items: {
    type: Array,
    required: true,
    // { to?: string, label: string } — dernier élément souvent sans `to` (page courante)
  },
})

const { t } = useI18n()
</script>

<template>
  <nav
    class="app-breadcrumbs text-sm"
    :aria-label="t('breadcrumb.aria')"
  >
    <ol class="app-breadcrumbs__list flex flex-wrap items-center gap-x-1 gap-y-1">
      <li
        v-for="(item, idx) in items"
        :key="idx"
        class="app-breadcrumbs__item flex items-center gap-1 min-w-0"
      >
        <template v-if="idx > 0">
          <span class="app-breadcrumbs__sep text-muted select-none" aria-hidden="true">/</span>
        </template>
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="app-breadcrumbs__link truncate focus-ring rounded px-0.5"
        >
          {{ item.label }}
        </NuxtLink>
        <span
          v-else
          class="app-breadcrumbs__current truncate font-medium text-text"
          aria-current="page"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.app-breadcrumbs__sep {
  opacity: 0.55;
}
.app-breadcrumbs__link {
  color: rgb(var(--brand));
  text-decoration: none;
}
.app-breadcrumbs__link:hover {
  text-decoration: underline;
}
</style>
