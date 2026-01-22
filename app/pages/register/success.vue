<template>
  <section class="mx-auto max-w-md space-y-6">
    <div class="card">
      <div class="card-body space-y-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-extrabold tracking-tight">
            {{ tr('auth.registerSuccess.title', 'Compte créé') }}
          </h1>
          <p class="text-sm text-muted">
            {{ tr('auth.registerSuccess.subtitle', 'Un email de confirmation a été envoyé.') }}
          </p>
        </div>

        <div class="rounded-2xl border border-border bg-surface2 p-3 text-sm">
          <div class="font-semibold">{{ tr('auth.registerSuccess.next', 'Étape suivante') }}</div>
          <div class="text-muted mt-1">
            {{ tr('auth.registerSuccess.instructions', 'Ouvre ton email et clique sur le lien de confirmation.') }}
          </div>
          <div v-if="email" class="mt-2 text-sm">
            <span class="text-muted">{{ tr('auth.fields.email', 'Email') }} :</span>
            <span class="font-semibold ml-1">{{ email }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <button class="btn w-full" type="button" :disabled="resendLoading" @click="resend">
            <Icon name="mdi:email-fast" aria-hidden="true" />
            <span>
              {{
                resendLoading
                  ? tr('auth.registerSuccess.resend.loading', 'Envoi…')
                  : tr('auth.registerSuccess.resend.cta', 'Renvoyer l’email de confirmation')
              }}
            </span>
          </button>

          <p v-if="resendMsg" class="text-xs text-muted">{{ resendMsg }}</p>
        </div>

        <div class="divider" />

        <NuxtLink :to="localePath('/login')" class="btn btn-primary w-full">
          <Icon name="mdi:login" aria-hidden="true" />
          <span>{{ tr('auth.registerSuccess.toLogin', 'Aller à la connexion') }}</span>
        </NuxtLink>
      </div>
    </div>

    <div class="text-xs text-muted text-center">
      {{ tr('auth.registerSuccess.tip', 'Pense à vérifier les spams si tu ne vois rien.') }}
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useI18n, useLocalePath } from '#imports'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

function tr(key, fallback) {
  const v = t(key)
  return v === key ? fallback : v
}

const email = computed(() => {
  const q = route.query?.email
  return typeof q === 'string' ? q : ''
})

const resendLoading = ref(false)
const resendMsg = ref('')

function normalizeError(err) {
  const data = err?.data || err?.response?._data || null
  return (
    data?.statusMessage ||
    data?.message ||
    err?.message ||
    tr('auth.errors.generic', 'Erreur inattendue.')
  )
}

async function resend() {
  resendMsg.value = ''
  if (!email.value) {
    resendMsg.value = tr('auth.registerSuccess.resend.noEmail', 'Email manquant (reviens à la page inscription).')
    return
  }

  resendLoading.value = true
  try {
    await $fetch('/api/auth/resend-verify', {
      method: 'POST',
      body: { email: email.value },
      credentials: 'include',
    })
    resendMsg.value = tr('auth.registerSuccess.resend.sent', 'Email envoyé. Vérifie ta boîte de réception.')
  } catch (err) {
    resendMsg.value = normalizeError(err)
  } finally {
    resendLoading.value = false
  }
}
</script>
