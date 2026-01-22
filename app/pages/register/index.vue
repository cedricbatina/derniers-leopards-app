<template>
  <section class="mx-auto max-w-md space-y-6">
    <div class="card">
      <div class="card-body space-y-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-extrabold tracking-tight">
            {{ tr('auth.register.title', 'Créer un compte') }}
          </h1>
          <p class="text-sm text-muted">
            {{ tr('auth.register.subtitle', 'Crée ton compte. Tu recevras un email de confirmation.') }}
          </p>
        </div>

        <div
          v-if="errorMsg"
          class="rounded-2xl border border-border bg-surface2 p-3 text-sm"
          role="alert"
        >
          <div class="font-semibold">
            {{ tr('auth.register.errorTitle', 'Inscription impossible') }}
          </div>
          <div class="text-muted mt-1">{{ errorMsg }}</div>
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
              class="input"
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
                class="input pr-11"
                autocomplete="new-password"
                required
                minlength="8"
                :placeholder="tr('auth.placeholders.password', 'Minimum 8 caractères')"
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

          <div class="space-y-1">
            <label class="text-sm font-semibold" for="password2">
              {{ tr('auth.fields.passwordConfirm', 'Confirmer le mot de passe') }}
            </label>
            <input
              id="password2"
              v-model="password2"
              :type="showPassword ? 'text' : 'password'"
              class="input"
              autocomplete="new-password"
              required
              minlength="8"
              :placeholder="tr('auth.placeholders.passwordConfirm', 'Répète le mot de passe')"
            />
          </div>

          <div v-if="passwordHint" class="text-xs text-muted">
            {{ passwordHint }}
          </div>

          <button class="btn btn-primary w-full" type="submit" :disabled="loading">
            <Icon name="mdi:account-plus" aria-hidden="true" />
            <span>
              {{ loading ? tr('auth.register.loading', 'Création…') : tr('auth.register.cta', 'Créer mon compte') }}
            </span>
          </button>
        </form>

        <div class="text-sm">
          <span class="text-muted">{{ tr('auth.register.haveAccount', 'Déjà un compte ?') }}</span>
          <NuxtLink :to="localePath('/login')" class="link ml-2">
            {{ tr('auth.register.toLogin', 'Se connecter') }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="text-xs text-muted text-center">
      {{ tr('auth.register.note', 'Tu devras confirmer ton email avant de pouvoir te connecter.') }}
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useI18n, useLocalePath } from '#imports'
import { useAuthStore } from '~/stores/auth.store'

const auth = useAuthStore()
const router = useRouter()
const { t, te } = useI18n()



const localePath = useLocalePath()

const email = ref('')
const password = ref('')
const password2 = ref('')
const showPassword = ref(false)

const loading = ref(false)
const errorMsg = ref('')

function tr(key, fallback) {
  return te(key) ? t(key) : fallback
}

const passwordHint = computed(() => {
  if (!password.value) return ''
  if (password.value.length < 8) return tr('auth.register.passwordTooShort', 'Mot de passe trop court (min 8).')
  if (password2.value && password.value !== password2.value) return tr('auth.register.passwordMismatch', 'Les mots de passe ne correspondent pas.')
  return ''
})

function normalizeError(err) {
  const data = err?.data || err?.response?._data || null
  const msg =
    data?.statusMessage ||
    data?.message ||
    err?.message ||
    tr('auth.errors.generic', 'Erreur inattendue.')
  return msg
}

async function onSubmit() {
  errorMsg.value = ''

  if (!email.value) {
    errorMsg.value = tr('auth.errors.emailRequired', 'Email requis.')
    return
  }
  if (String(password.value || '').length < 8) {
    errorMsg.value = tr('auth.errors.passwordMin', 'Mot de passe: minimum 8 caractères.')
    return
  }
  if (password.value !== password2.value) {
    errorMsg.value = tr('auth.errors.passwordMismatch', 'Les mots de passe ne correspondent pas.')
    return
  }

  loading.value = true
  try {
    await auth.register({ email: email.value, password: password.value })
    await router.push({
      path: localePath('/register/success'),
      query: { email: email.value },
    })
  } catch (err) {
    errorMsg.value = normalizeError(err)
  } finally {
    loading.value = false
  }
}
</script>
