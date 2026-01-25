<template>
  <section class="mx-auto max-w-lg space-y-6">
    <div class="card overflow-hidden">
      <div class="card-body space-y-5">
        <!-- Kicker -->
        <p class="badge w-fit">
          <Icon name="mdi:shield-check" aria-hidden="true" />
          {{ tr('auth.verifySuccess.kicker', 'Sécurité & accès') }}
        </p>

        <!-- Title -->
        <div class="space-y-2">
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {{ tr('auth.verifySuccess.title', 'Adresse email confirmée') }}
          </h1>
          <p class="text-sm sm:text-base text-muted">
            {{ tr('auth.verifySuccess.subtitle', 'Votre compte est désormais activé. Vous pouvez vous connecter.') }}
          </p>
        </div>

        <!-- What’s next -->
        <div class="rounded-2xl border border-border bg-surface2 p-4 space-y-2 text-sm">
          <div class="font-semibold flex items-center gap-2">
            <Icon name="mdi:information-outline" aria-hidden="true" />
            {{ tr('auth.verifySuccess.next.title', 'Prochaine étape') }}
          </div>
          <ul class="list-disc pl-5 text-muted space-y-1">
            <li>{{ tr('auth.verifySuccess.next.item1', 'Connectez-vous pour accéder à votre espace.') }}</li>
            <li>{{ tr('auth.verifySuccess.next.item2', 'Vous pourrez ensuite compléter votre profil et commencer à travailler.') }}</li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-2">
          <NuxtLink :to="localePath('/login')" class="btn btn-primary w-full focus-ring">
            <Icon name="mdi:login" aria-hidden="true" />
            <span>{{ tr('auth.verifySuccess.toLogin', 'Se connecter') }}</span>
          </NuxtLink>

          <NuxtLink :to="localePath('/')" class="btn btn-ghost w-full focus-ring">
            <Icon name="mdi:home-outline" aria-hidden="true" />
            <span>{{ tr('auth.verifySuccess.toHome', 'Retour à l’accueil') }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Footnote -->
    <p class="text-xs text-muted text-center">
      {{ tr('auth.verifySuccess.note', 'Si vous rencontrez un problème, vous pouvez relancer la connexion ou demander un nouvel email de confirmation.') }}
    </p>
  </section>
</template>

<script setup>
import { useI18n, useLocalePath } from '#imports'

const { t, te } = useI18n()
const localePath = useLocalePath()

function tr(key, fallback) {
  return te(key) ? t(key) : fallback
}
</script>
