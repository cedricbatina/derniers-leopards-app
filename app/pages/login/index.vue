<template>
  <section class="mx-auto max-w-md space-y-6">
    <div class="card">
      <div class="card-body space-y-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-extrabold tracking-tight">
            {{ tr('auth.login.title', 'Connexion') }}
          </h1>
          <p class="text-sm text-muted">
            {{ tr('auth.login.subtitle', 'Connecte-toi pour accéder au tableau de bord.') }}
          </p>
        </div>

        <!-- Error -->
        <div
          v-if="errorMsg"
          class="rounded-2xl border border-border bg-surface2 p-3 text-sm"
          role="alert"
        >
          <div class="font-semibold">
            {{ tr('auth.login.errorTitle', 'Impossible de se connecter') }}
          </div>
          <div class="text-muted mt-1">
            {{ errorMsg }}
          </div>

          <div v-if="canResendVerify" class="mt-3">
            <button class="btn btn-sm" type="button" :disabled="resendLoading" @click="resendVerify">
              <Icon name="mdi:email-fast" aria-hidden="true" />
              <span>
                {{
                  resendLoading
                    ? tr('auth.login.resend.loading', 'Envoi…')
                    : tr('auth.login.resend.cta', 'Renvoyer l’email de confirmation')
                }}
              </span>
            </button>
            <p v-if="resendMsg" class="text-xs text-muted mt-2">{{ resendMsg }}</p>
          </div>
        </div>

        <form class="space-y-3" @submit.prevent="onSubmit">
          <div class="space-y-1">
            <label class="text-sm font-semibold" for="email">
              {{ tr('auth.fields.email', 'Email') }}
            </label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              class="input w-full"
              autocomplete="email"
              required
              :placeholder="tr('auth.placeholders.email', 'nom@domaine.com')"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-semibold" for="password">
              {{ tr('auth.fields.password', 'Mot de passe') }}
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="input w-full pr-11"
                autocomplete="current-password"
                required
                :placeholder="tr('auth.placeholders.password', '••••••••')"
              />
              <button
                type="button"
                class="btn btn-sm btn-ghost absolute right-1 top-1"
                :aria-label="showPassword ? tr('auth.hidePassword', 'Masquer') : tr('auth.showPassword', 'Afficher')"
                @click="showPassword = !showPassword"
              >
                <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" aria-hidden="true" />
              </button>
            </div>
          </div>

          <button class="btn btn-primary w-full" type="submit" :disabled="loading">
            <Icon name="mdi:login" aria-hidden="true" />
            <span>{{ loading ? tr('auth.login.loading', 'Connexion…') : tr('auth.login.cta', 'Se connecter') }}</span>
          </button>
        </form>

        <div class="flex items-center justify-between text-sm">
          <NuxtLink :to="localePath('/register')" class="link">
            {{ tr('auth.login.toRegister', 'Créer un compte') }}
          </NuxtLink>

          <NuxtLink :to="localePath('/forgot-password')" class="link text-muted">
            {{ tr('auth.login.forgot', 'Mot de passe oublié ?') }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="text-xs text-muted text-center">
      {{ tr('auth.login.note', 'Astuce : ton navigateur doit accepter les cookies pour la session.') }}
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, useI18n, useLocalePath } from '#imports'
import { useAuthStore } from '~/stores/auth.store'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const { t, te } = useI18n()


const localePath = useLocalePath()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const loading = ref(false)
const errorMsg = ref('')
const canResendVerify = ref(false)
const resendLoading = ref(false)
const resendMsg = ref('')

function tr(key, fallback) {
  return te(key) ? t(key) : fallback
}
const redirectTo = computed(() => {
  const q = route.query?.redirect
  if (typeof q === 'string' && q.startsWith('/')) return q
  return localePath('/characters')
})

function normalizeError(err) {
  // Nuxt $fetch: err.data / err.response?._data peuvent exister selon version
  const data = err?.data || err?.response?._data || null
  const status = err?.statusCode || err?.response?.status || data?.statusCode

  const msg =
    data?.statusMessage ||
    data?.message ||
    err?.message ||
    tr('auth.errors.generic', 'Erreur inattendue.')

  return { status, msg, data }
}

async function onSubmit() {
  errorMsg.value = ''
  canResendVerify.value = false
  resendMsg.value = ''

  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    await router.push(redirectTo.value)
  } catch (err) {
    const { status, msg, data } = normalizeError(err)

    // cas typique: email non vérifié (selon votre backend, ça peut être 403/409)
    const raw = (data?.code || data?.error || '').toString().toLowerCase()
    const maybeUnverified =
      status === 403 ||
      status === 409 ||
      raw.includes('verify') ||
      raw.includes('unverified') ||
      msg.toLowerCase().includes('confir') ||
      msg.toLowerCase().includes('vérif')

    errorMsg.value = msg
    canResendVerify.value = !!maybeUnverified
  } finally {
    loading.value = false
  }
}

async function resendVerify() {
  resendMsg.value = ''
  resendLoading.value = true
  try {
    // Si vous avez un endpoint dédié, gardez-le.
    // Sinon, remplacez par celui qui existe (ex: /api/auth/resend-verify).
    await $fetch('/api/auth/resend-verify', {
      method: 'POST',
      body: { email: email.value },
      credentials: 'include',
    })
    resendMsg.value = tr('auth.login.resend.sent', 'Email envoyé. Vérifie ta boîte de réception.')
  } catch (err) {
    const { msg } = normalizeError(err)
    resendMsg.value = msg
  } finally {
    resendLoading.value = false
  }
}
</script>
