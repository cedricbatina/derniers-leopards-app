<template>
  <section class="mx-auto max-w-md space-y-6">
    <div class="card">
      <div class="card-body space-y-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-extrabold tracking-tight">
            {{ tr('auth.verify.title', 'Confirmation email') }}
          </h1>
          <p class="text-sm text-muted">
            {{ tr('auth.verify.subtitle', 'Vérification du lien en cours…') }}
          </p>
        </div>

        <!-- Loading -->
        <div
          v-if="state === 'loading'"
          class="rounded-2xl border border-border bg-surface2 p-3 text-sm"
        >
          <div class="font-semibold">
            {{ tr('auth.verify.loadingTitle', 'Validation en cours') }}
          </div>
          <div class="text-muted mt-1">
            {{ tr('auth.verify.loadingBody', 'Merci de patienter quelques secondes.') }}
          </div>
        </div>

        <!-- Error -->
        <div
          v-else-if="state === 'error'"
          class="rounded-2xl border border-border bg-surface2 p-3 text-sm"
          role="alert"
        >
          <div class="font-semibold">
            {{ tr('auth.verify.errorTitle', 'Lien invalide ou expiré') }}
          </div>
          <div class="text-muted mt-1">
            {{ errorMsg }}
          </div>

          <div class="mt-4 space-y-3">
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
                {{ tr('auth.verify.resend.help', 'Si le lien a expiré, vous pouvez renvoyer un email de confirmation.') }}
              </p>
            </div>

            <button
              class="btn w-full"
              type="button"
              :disabled="resendLoading || !email"
              @click="resend"
            >
              <Icon name="mdi:email-fast" aria-hidden="true" />
              <span>
                {{
                  resendLoading
                    ? tr('auth.verify.resend.loading', 'Envoi…')
                    : tr('auth.verify.resend.cta', 'Renvoyer l’email de confirmation')
                }}
              </span>
            </button>

            <p v-if="resendMsg" class="text-xs text-muted">
              {{ resendMsg }}
            </p>

            <NuxtLink :to="localePath('/login')" class="btn btn-primary w-full">
              <Icon name="mdi:login" aria-hidden="true" />
              <span>{{ tr('auth.verify.toLogin', 'Aller à la connexion') }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Success (very brief, redirect) -->
        <div v-else class="rounded-2xl border border-border bg-surface2 p-3 text-sm">
          <div class="font-semibold">
            {{ tr('auth.verify.doneTitle', 'Confirmation effectuée') }}
          </div>
          <div class="text-muted mt-1">
            {{ tr('auth.verify.doneBody', 'Redirection…') }}
          </div>
        </div>
      </div>
    </div>

    <div class="text-xs text-muted text-center">
      {{ tr('auth.verify.note', 'Si rien ne se passe, revenez à la page de connexion.') }}
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, useI18n, useLocalePath } from '#imports'

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const { t, te } = useI18n()
function tr(key, fallback) {
  return te(key) ? t(key) : fallback
}

const state = ref('loading') // loading | ok | error
const errorMsg = ref('')
const email = ref('')

const resendLoading = ref(false)
const resendMsg = ref('')

function normalizeError(err) {
  const data = err?.data || err?.response?._data || null
  return (
    data?.message ||
    data?.statusMessage ||
    err?.message ||
    tr('auth.errors.generic', 'Erreur inattendue.')
  )
}

async function verifyToken(token) {
  state.value = 'loading'
  errorMsg.value = ''
  resendMsg.value = ''

  try {
    await $fetch('/api/auth/verify-email', {
      method: 'GET',
      query: { token },
      credentials: 'include',
    })

    state.value = 'ok'

    // Redirection vers la page success si elle existe dans votre projet
    try {
      await router.push(localePath('/verify-email/success'))
    } catch {
      // fallback robuste si route manquante
      await router.push(localePath('/login?verified=1'))
    }
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
    resendMsg.value = tr('auth.verify.resend.sent', 'Email envoyé. Veuillez vérifier votre boîte de réception.')
  } catch (err) {
    resendMsg.value = normalizeError(err)
  } finally {
    resendLoading.value = false
  }
}

onMounted(() => {
  // Pré-remplissage email si fourni dans l’URL (?email=...)
  const qEmail = typeof route.query?.email === 'string' ? route.query.email : ''
  if (qEmail && !email.value) email.value = qEmail

  const token = typeof route.query?.token === 'string' ? route.query.token : ''
  if (!token) {
    state.value = 'error'
    errorMsg.value = tr('auth.verify.missingToken', 'Token manquant.')
    return
  }

  verifyToken(token)
})
</script>
