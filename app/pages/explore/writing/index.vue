<script setup>
import { useI18n, useLocalePath, useSeoMeta } from '#imports'
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => 'Sonekeno — Écriture',
  description: () => "Écrire plus vite, rester cohérent : personnages, scènes, notes et versions dans un même espace."
})
</script>

<template>
  <section class="space-y-6 sm:space-y-10">
    <div class="card card-hover card-accent accent-earth overflow-hidden">
      <div class="card-body">
        <div class="flex flex-col gap-4 sm:gap-5">
          <p class="badge badge-accent w-fit">
            <Icon name="mdi:pencil-outline" aria-hidden="true" />
            Écriture
          </p>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">
            Écrire avec une base solide
          </h1>

          <p class="text-subtle max-w-2xl">
            Du manuscrit au canon : structure ton récit sans perdre les détails (versions, liens, cohérence).
          </p>

          <div class="flex flex-wrap gap-2 pt-1">
            <NuxtLink :to="localePath('/explore/workflow')" class="btn btn-primary focus-ring">
              <Icon name="mdi:rocket-launch-outline" aria-hidden="true" />
              Voir le workflow
            </NuxtLink>

            <NuxtLink :to="localePath('/explore')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:compass-outline" aria-hidden="true" />
              Retour explorer
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body text-sm text-muted">
        Page en cours : on la remplit après stabilisation de Explore + bascule workspace sous /studio/*.
      </div>
    </div>
  </section>
</template>
