<script setup>
import { useI18n, useLocalePath, useSeoMeta } from '#imports'
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => 'Sonekeno — Éditeurs',
  description: () => "Cohérence, révisions et livrables : une vue claire du canon et des changements."
})
</script>

<template>
  <section class="space-y-6 sm:space-y-10">
    <div class="card card-hover card-accent accent-forest overflow-hidden">
      <div class="card-body">
        <div class="flex flex-col gap-4 sm:gap-5">
          <p class="badge badge-accent w-fit">
            <Icon name="mdi:clipboard-check-outline" aria-hidden="true" />
            Éditeurs
          </p>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">
            Cohérence, révisions, livrables
          </h1>

          <p class="text-subtle max-w-2xl">
            Stabilise le canon, trace les changements, et prépare les sorties sans casser les liens.
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
