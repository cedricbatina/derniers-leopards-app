<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-2xl font-extrabold tracking-tight">{{ t("pages.timeline.title") }}</h1>
      <p class="text-muted">{{ t("pages.timeline.subtitle") }}</p>
    </header>

    <div class="card">
      <div class="card-body space-y-3">
        <p class="text-sm text-muted">{{ t("pages.comingSoon") }}</p>

        <div class="flex flex-wrap gap-2">
          <NuxtLink :to="localePath('/')" class="btn btn-ghost focus-ring">
            <Icon name="mdi:arrow-left" />
            {{ t("common.back") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta(() => ({
  title: t("pages.timeline.meta.title", { name: t("app.name") }),
  description: t("pages.timeline.meta.description"),
  ogTitle: t("pages.timeline.meta.ogTitle", { name: t("app.name") }),
  ogDescription: t("pages.timeline.meta.ogDescription"),
}))
</script>
