<template>
  <section class="mx-auto max-w-md space-y-6">
    <div class="card">
      <div class="card-body space-y-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-extrabold tracking-tight">
            {{ tr('auth.verify.title', 'Confirmation email') }}
          </h1>
          <p class="text-sm text-muted">
            {{ tr('auth.verify.subtitle', 'Nous vérifions ton lien…') }}
          </p>
        </div>

        <div v-if="state === 'loading'" class="rounded-2xl border border-border bg-surface2 p-3 text-sm">
          <div class="font-semibold">{{ tr('auth.verify.loadingTitle', 'Validation en cours') }}</div>
          <div class="text-muted mt-1">{{ tr('auth.verify.loadingBody', 'Merci de patienter quelques secondes.') }}</div>
        </div>

        <div v-else-if="state === 'error'" class="rounded-2xl border border-border bg-surface2 p-3 text-sm" role="alert">
          <div class="font-semibold">{{ tr('auth.verify.errorTitle', 'Lien invalide ou expiré') }}</div>
          <div class="text-muted mt-1">{{ errorMsg }}</div>

          <div class="mt-4 space-y-2">
            <div class="space-y-1">
              <label class="text-sm font-semibold" for="email">
                {{ tr('auth.fields.email', 'Email') }}
              </label>
              <input
                id="email"
                v-model.trim="email"
                type="email"
                class="input"
                autocomplete="email"
                :placeholder="tr('auth.placeholders.email', 'nom@domaine.com')"
              />
              <p class="text-xs text-muted">
                {{ tr('auth.verify.resend.help', 'Si le lien a expiré, renvoie un nouvel email de confirmation.') }}
              </p>
            </div>

            <button class="btn w-full" type="button" :disabled="resendLoading" @click="resend">
              <Icon name="mdi:email-fast" aria-hidden="true" />
              <span>
                {{
                  resendLoading
                    ? tr('auth.verify.resend.loading', 'Envoi…')
                    : tr('auth.verify.resend.cta', 'Renvoyer l’email de confirmation')
                }}
              </span>
            </button>

            <p v-if="resendMsg" class="text-xs text-muted">{{ resendMsg }}</p>

            <NuxtLink :to="localePath('/login')" class="btn btn-primary w-full">
              <Icon name="mdi:login" aria-hidden="true" />
              <span>{{ tr('auth.verify.toLogin', 'Aller à la connexion') }}</span>
            </NuxtLink>
          </div>
        </div>

        <div v-else class="rounded-2xl border border-border bg-surface2 p-3 text-sm">
          <div class="font-semibold">{{ tr('auth.verify.doneTitle', 'Terminé') }}</div>
          <div class="text-muted mt-1">{{ tr('auth.verify.doneBody', 'Redirection…') }}</div>
        </div>
      </div>
    </div>

    <div class="text-xs text-muted text-center">
      {{ tr('auth.verify.note', 'Si rien ne se passe, reviens à la connexion.') }}
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, useI18n, useLocalePath } from '#imports'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const localePath = useLocalePath()

function tr(key, fallback) {
  const v = t(key)
  return v === key ? fallback : v
}

const state = ref('loading') // loading | ok | error
const errorMsg = ref('')
const email = ref('')

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

async function verifyToken(token) {
  state.value = 'loading'
  errorMsg.value = ''
  try {
    await $fetch('/api/auth/verify-email', {
      method: 'GET',
      query: { token },
      credentials: 'include',
    })
    state.value = 'ok'
    await router.push(localePath('/verify-email/success'))
  } catch (err) {
    state.value = 'error'
    errorMsg.value = normalizeError(err)
  }
}

async function resend() {
  resendMsg.value = ''
  if (!email.value) {
    resendMsg.value = tr('auth.errors.emailRequired', 'Email requis.')
    return
  }
  resendLoading.value = true
  try {
    await $fetch('/api/auth/resend-verify', {
      method: 'POST',
      body: { email: email.value },
      credentials: 'include',
    })
    resendMsg.value = tr('auth.verify.resend.sent', 'Email envoyé. Vérifie ta boîte de réception.')
  } catch (err) {
    resendMsg.value = normalizeError(err)
  } finally {
    resendLoading.value = false
  }
}

onMounted(() => {
  const token = typeof route.query?.token === 'string' ? route.query.token : ''
  if (!token) {
    state.value = 'error'
    errorMsg.value = tr('auth.verify.missingToken', 'Token manquant.')
    return
  }
  verifyToken(token)
})
</script>
