<template>
  <section class="mx-auto max-w-md space-y-6">
    <div class="card">
      <div class="card-body space-y-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-extrabold tracking-tight">
            {{ tr('auth.verifySuccess.title', 'Email confirmé') }}
          </h1>
          <p class="text-sm text-muted">
            {{ tr('auth.verifySuccess.subtitle', 'Ton compte est maintenant activé. Tu peux te connecter.') }}
          </p>
        </div>

        <NuxtLink :to="localePath('/login')" class="btn btn-primary w-full">
          <Icon name="mdi:login" aria-hidden="true" />
          <span>{{ tr('auth.verifySuccess.toLogin', 'Se connecter') }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n, useLocalePath } from '#imports'
const { t } = useI18n()
const localePath = useLocalePath()

function tr(key, fallback) {
  const v = t(key)
  return v === key ? fallback : v
}
</script>
