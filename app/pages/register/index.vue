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
          <!-- Type de compte -->
          <div class="space-y-1">
            <label class="text-sm font-semibold">
              {{ tr('auth.register.accountType', 'Type de compte') }}
            </label>

            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                class="btn btn-sm"
                :class="accountType === 'individual' ? 'btn-primary' : 'btn-ghost'"
                @click="accountType = 'individual'"
              >
                <Icon name="mdi:account" aria-hidden="true" />
                <span>{{ tr('auth.register.accountTypeIndividual', 'Particulier') }}</span>
              </button>

              <button
                type="button"
                class="btn btn-sm"
                :class="accountType === 'pro' ? 'btn-primary' : 'btn-ghost'"
                @click="accountType = 'pro'"
              >
                <Icon name="mdi:office-building" aria-hidden="true" />
                <span>{{ tr('auth.register.accountTypePro', 'Pro') }}</span>
              </button>
            </div>

            <p class="text-xs text-muted">
              {{
                accountType === 'pro'
                  ? tr('auth.register.accountTypeProHelp', 'Pour éditeurs, studios, collectifs, créateurs.')
                  : tr('auth.register.accountTypeIndividualHelp', 'Pour auteurs, scénaristes, poètes, créateurs indépendants.')
              }}
            </p>
          </div>

          <!-- Champs profil (individual/pro) -->
          <div v-if="accountType === 'individual'" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-sm font-semibold" for="firstName">
                {{ tr('auth.fields.firstName', 'Prénom') }}
              </label>
              <input
                id="firstName"
                v-model.trim="firstName"
                type="text"
                class="input"
                autocomplete="given-name"
                :placeholder="tr('auth.placeholders.firstName', 'Ex: Cédric')"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-semibold" for="lastName">
                {{ tr('auth.fields.lastName', 'Nom') }}
              </label>
              <input
                id="lastName"
                v-model.trim="lastName"
                type="text"
                class="input"
                autocomplete="family-name"
                :placeholder="tr('auth.placeholders.lastName', 'Ex: Batina')"
              />
            </div>
          </div>

          <div v-else class="space-y-1">
            <label class="text-sm font-semibold" for="organizationName">
              {{ tr('auth.fields.organizationName', 'Organisation') }}
              <span class="text-muted">*</span>
            </label>
            <input
              id="organizationName"
              v-model.trim="organizationName"
              type="text"
              class="input"
              autocomplete="organization"
              required
              :placeholder="tr('auth.placeholders.organizationName', 'Ex: Éditions … / Studio …')"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-sm font-semibold" for="displayName">
                {{ tr('auth.fields.displayName', 'Nom public') }}
              </label>
              <input
                id="displayName"
                v-model.trim="displayName"
                type="text"
                class="input"
                :placeholder="tr('auth.placeholders.displayName', 'Ex: Auteur / Studio / Pseudo')"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-semibold" for="profession">
                {{ tr('auth.fields.profession', 'Profession') }}
              </label>
              <input
                id="profession"
                v-model.trim="profession"
                type="text"
                class="input"
                :placeholder="tr('auth.placeholders.profession', 'Ex: écrivain, éditeur, scénariste…')"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-semibold" for="website">
              {{ tr('auth.fields.website', 'Site web') }}
            </label>
            <input
              id="website"
              v-model.trim="website"
              type="url"
              class="input"
              autocomplete="url"
              :placeholder="tr('auth.placeholders.website', 'https://…')"
            />
          </div>

          <!-- Email -->
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

          <!-- Password -->
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

          <!-- Password confirm -->
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

          <!-- Options (facultatif) -->
          <div class="flex items-start gap-2 pt-1">
            <input id="marketing" v-model="marketingOptIn" type="checkbox" class="mt-1" />
            <label for="marketing" class="text-xs text-muted">
              {{ tr('auth.register.marketingOptIn', 'Recevoir des mises à jour produit (optionnel).') }}
            </label>
          </div>

          <div class="flex items-start gap-2">
            <input id="terms" v-model="termsAccepted" type="checkbox" class="mt-1" required />
            <label for="terms" class="text-xs text-muted">
              {{ tr('auth.register.terms', 'J’accepte les conditions d’utilisation.') }}
            </label>
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
definePageMeta({ middleware: 'guest' })


import { ref, computed } from 'vue'
import { useRouter, useI18n, useLocalePath } from '#imports'
import { useAuthStore } from '~/stores/auth.store'




const auth = useAuthStore()
const router = useRouter()
const { t, te } = useI18n()
const localePath = useLocalePath()

function tr(key, fallback) {
  return te(key) ? t(key) : fallback
}

const accountType = ref('individual') // 'individual' | 'pro'
const firstName = ref('')
const lastName = ref('')
const organizationName = ref('')
const displayName = ref('')
const profession = ref('')
const website = ref('')

const email = ref('')
const password = ref('')
const password2 = ref('')
const showPassword = ref(false)

const marketingOptIn = ref(false)
const termsAccepted = ref(false)

const loading = ref(false)
const errorMsg = ref('')

const passwordHint = computed(() => {
  if (!password.value) return ''
  if (password.value.length < 8) return tr('auth.register.passwordTooShort', 'Mot de passe trop court (min 8).')
  if (password2.value && password.value !== password2.value) return tr('auth.register.passwordMismatch', 'Les mots de passe ne correspondent pas.')
  return ''
})

function normalizeError(err) {
  const data = err?.data || err?.response?._data || null
  return data?.statusMessage || data?.message || err?.message || tr('auth.errors.generic', 'Erreur inattendue.')
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
  if (accountType.value === 'pro' && !organizationName.value) {
    errorMsg.value = tr('auth.errors.organizationRequired', 'Organisation requise pour un compte pro.')
    return
  }
  if (!termsAccepted.value) {
    errorMsg.value = tr('auth.errors.termsRequired', 'Veuillez accepter les conditions.')
    return
  }

  loading.value = true
  try {
    await auth.register({
      email: email.value,
      password: password.value,

      // nouveaux champs vers ton register.post.js
      accountType: accountType.value,
      firstName: firstName.value || null,
      lastName: lastName.value || null,
      organizationName: organizationName.value || null,
      displayName: displayName.value || null,
      profession: profession.value || null,
      website: website.value || null,

      marketingOptIn: marketingOptIn.value,
      termsAccepted: termsAccepted.value,
    })

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
