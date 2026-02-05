<!-- layouts/default.vue -->
<template>
  <div class="min-h-dvh bg-fun">
    <a href="#main" class="skip-link">{{ t('a11y.skipToContent') }}</a>

    <header>
      <!-- Sticky: topbar uniquement -->
      <div class="topbar">
        <div class="container-app flex items-center justify-between py-3 gap-3">
          <!-- Brand -->
          <NuxtLink :to="localePath('/')" class="flex items-center gap-3 focus-ring rounded-xl">
            <NuxtImg
              src="/images/logo-sonekeno.png"
              width="40"
              height="40"
              decoding="async"
              class="h-20 w-20 rounded-2xl border border-border bg-transparent object-contain shadow-soft"
              :alt="t('app.logoAlt')"
            />
            <div class="leading-tight">
              <div class="font-extrabold tracking-tight">{{ t('app.name') }}</div>
              <div class="text-xs text-muted">{{ t('app.tagline') }}</div>
            </div>
          </NuxtLink>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Lang switch (toujours visible, compact) -->
            <div
              class="flex items-center gap-1 rounded-full border border-border bg-surface2 p-1"
              :aria-label="t('lang.label')"
            >
              <NuxtLink
                :to="switchLocalePath('fr')"
                class="lang-chip"
                :class="{ 'lang-chip--active': locale === 'fr' }"
              >
                {{ t('lang.fr') }}
              </NuxtLink>
              <NuxtLink
                :to="switchLocalePath('en')"
                class="lang-chip"
                :class="{ 'lang-chip--active': locale === 'en' }"
              >
                {{ t('lang.en') }}
              </NuxtLink>
              <NuxtLink
                :to="switchLocalePath('pt')"
                class="lang-chip"
                :class="{ 'lang-chip--active': locale === 'pt' }"
              >
                {{ t('lang.pt') }}
              </NuxtLink>
            </div>

            <!-- Theme (vrai bouton icône) -->
            <button
              class="btn btn-ghost btn-icon focus-ring"
              type="button"
              @click="toggleTheme"
              :aria-label="themeAria"
              :title="themeTitle"
            >
              <Icon :name="themeIcon" aria-hidden="true" class="text-lg" />
            </button>
          </div>
        </div>

        <div class="divider" />
      </div>

      <!-- NON sticky: user card -->
      <div class="container-app py-3">
        <UserInlineCard
          :user="auth.user"
          :is-authenticated="isAuthed"
          @go-dashboard="goDashboard"
          @go-notifications="goNotifications"
          @logout="handleLogout"
          @login="goLogin"
          @register="goRegister"
        />
      </div>

      <!-- NAV toujours visible (pas de hamburger) -->
      <div class="container-app pb-3">
        <nav class="flex flex-wrap gap-2" :aria-label="t('nav.aria')">
          <NuxtLink :to="localePath('/characters')" class="pill" active-class="pill-active">
            <Icon name="mdi:account-group" aria-hidden="true" />
            <span>{{ t('nav.characters') }}</span>
          </NuxtLink>

          <NuxtLink :to="localePath('/scenes')" class="pill" active-class="pill-active">
            <Icon name="mdi:movie-open" aria-hidden="true" />
            <span>{{ t('nav.scenes') }}</span>
          </NuxtLink>

          <NuxtLink :to="localePath('/timeline')" class="pill" active-class="pill-active">
            <Icon name="mdi:timeline" aria-hidden="true" />
            <span>{{ t('nav.timeline') }}</span>
          </NuxtLink>

          <NuxtLink :to="localePath('/glossary')" class="pill" active-class="pill-active">
            <Icon name="mdi:book-open-page-variant" aria-hidden="true" />
            <span>{{ t('nav.glossary') }}</span>
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Contenu page -->
    <main id="main" class="page">
      <slot />
    </main>

    <footer class="container-app pb-10 text-sm text-muted">
      <div class="divider my-6" />
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>{{ t('footer.rights', { year }) }}</div>

        <div class="flex flex-wrap items-center gap-2">
          <span class="badge">{{ t('footer.tags.mobile') }}</span>
          <span class="badge">{{ t('footer.tags.multilang') }}</span>
          <span class="badge">{{ t('footer.tags.offline') }}</span>
          <span class="badge">{{ t('footer.tags.search') }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth.store'
import { useColorMode, useI18n, useLocalePath, useSwitchLocalePath } from '#imports'

const router = useRouter()
const auth = useAuthStore()

const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const colorMode = useColorMode()

const year = new Date().getFullYear()
const isAuthed = computed(() => !!auth.user?.id)

function goDashboard() { router.push('/characters') }
function goNotifications() { router.push('/notifications') }

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

function goLogin() { router.push('/login') }
function goRegister() { router.push('/register') }

const themeTitle = computed(() => {
  if (colorMode.preference === 'system') return t('theme.toDark')
  if (colorMode.preference === 'dark') return t('theme.toLight')
  return t('theme.toSystem')
})

const themeModeLabel = computed(() => t(`theme.modes.${colorMode.preference}`))

const themeAria = computed(() =>
  t('theme.aria', { mode: themeModeLabel.value, action: themeTitle.value })
)

const themeIcon = computed(() =>
  colorMode.value === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'
)

function toggleTheme() {
  const pref = colorMode.preference
  if (pref === 'system') colorMode.preference = 'dark'
  else if (pref === 'dark') colorMode.preference = 'light'
  else colorMode.preference = 'system'
}
</script>
