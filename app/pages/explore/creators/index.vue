<script setup>
import { useLocalePath, useSeoMeta } from '#imports'
const localePath = useLocalePath()

useSeoMeta({
  title: () => 'Sonekeno — Créateurs',
  description: () => "Arts & média : lore, glossaire, cartes, notes de canon — base commune de création."
})
</script>

<template>
  <section class="space-y-6 sm:space-y-10">
    <div class="card card-hover card-accent accent-copper overflow-hidden">
      <div class="card-body">
        <div class="flex flex-col gap-4 sm:gap-5">
          <p class="badge badge-accent w-fit">
            <Icon name="mdi:palette-outline" aria-hidden="true" />
            Créateurs
          </p>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">
            Lore, arts & déclinaisons
          </h1>

          <p class="text-subtle max-w-2xl">
            Une base de canon lisible pour illustrer, composer, cartographier, scénariser — sans incohérences.
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
