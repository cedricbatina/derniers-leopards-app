<!-- layouts/default.vue -->
<template>
  <div class="flex min-h-dvh flex-col bg-fun">
    <a href="#main" class="skip-link">{{ t('a11y.skipToContent') }}</a>

    <header>
      <!-- Sticky: topbar uniquement -->
      <div class="topbar">
        <div class="container-app flex items-center justify-between py-3 gap-3">
          <!-- Brand -->
          <NuxtLink :to="localePath('/')" class="flex items-center gap-3 focus-ring rounded-xl">
            <img
              :src="logoMarkSrc"
              width="80"
              height="80"
              decoding="async"
              class="h-20 w-20 object-contain drop-shadow-sm dark:drop-shadow-[0_1px_8px_rgba(251,191,36,0.25)]"
              :alt="t('app.logoAlt')"
            />
            <div class="leading-tight">
              <div class="brand-title">{{ t('app.name') }}</div>
              <div class="brand-tagline">{{ t('app.tagline') }}</div>
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
          @go-profile="() => router.push(localePath('/profile'))"
          @go-notifications="goNotifications"
          @logout="handleLogout"
          @login="goLogin"
          @register="goRegister"
        />
      </div>

      <!-- NAV toujours visible (pas de hamburger) -->
      <div class="container-app pb-3">
        <nav class="flex flex-wrap gap-2" :aria-label="t('nav.aria')">
          <NuxtLink :to="localePath('/explore')" class="pill focus-ring" active-class="pill-active">
            <Icon name="mdi:compass-outline" aria-hidden="true" />
            <span>{{ t('nav.guide') }}</span>
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/characters')" class="pill" active-class="pill-active">
            <Icon name="mdi:account-group" aria-hidden="true" />
            <span>{{ t('nav.characters') }}</span>
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/scenes')" class="pill" active-class="pill-active">
            <Icon name="mdi:movie-open" aria-hidden="true" />
            <span>{{ t('nav.scenes') }}</span>
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/timeline')" class="pill" active-class="pill-active">
            <Icon name="mdi:timeline" aria-hidden="true" />
            <span>{{ t('nav.timeline') }}</span>
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/glossary')" class="pill" active-class="pill-active">
            <Icon name="mdi:book-open-page-variant" aria-hidden="true" />
            <span>{{ t('nav.glossary') }}</span>
          </NuxtLink>

          <NuxtLink v-if="isAuthed" :to="localePath('/studio')" class="pill pill-primary" active-class="pill-active">
            <Icon name="mdi:briefcase" aria-hidden="true" />
            <span>Studio</span>
          </NuxtLink>

          <NuxtLink v-if="isAuthed" :to="localePath('/studio/todos')" class="pill" active-class="pill-active">
            <Icon name="mdi:checkbox-marked-outline" aria-hidden="true" />
            <span>{{ t('domain.todo.plural') }}</span>
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Contenu page -->
    <main id="main" class="page flex-1 min-h-0 w-full shrink-0">
      <slot />
    </main>

    <!-- Pas de text-muted sur le footer entier : le titre marque doit matcher le header (--text). -->
    <footer class="premium-footer mt-auto w-full shrink-0 text-sm text-text">
      <div class="divider" />
      <div class="container-app py-8 sm:py-10 lg:py-12">
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
          <section
            class="flex gap-4 border-b border-border pb-10 lg:col-span-4 lg:border-0 lg:pb-0"
            aria-labelledby="footer-brand-heading"
          >
            <img
              :src="logoMarkSrc"
              width="56"
              height="56"
              decoding="async"
              class="h-14 w-14 shrink-0 object-contain drop-shadow-sm dark:drop-shadow-[0_1px_6px_rgba(251,191,36,0.2)]"
              :alt="t('app.logoAlt')"
            />
            <div class="min-w-0 pt-0.5">
              <h2 id="footer-brand-heading" class="font-extrabold tracking-tight text-lg leading-snug text-text">
                {{ t('app.name') }}
              </h2>
              <p class="mt-2 text-xs leading-snug text-[rgb(var(--text-2))]">
                {{ t('app.tagline') }}
              </p>
              <p class="mt-2 text-xs text-muted">
                {{ t('footer.rights', { year, name: t('app.name') }) }}
              </p>
            </div>
          </section>

          <div
            class="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-11 lg:col-span-8 lg:grid-cols-3 lg:gap-x-12"
          >
            <nav aria-labelledby="footer-legal-heading">
              <h3 id="footer-legal-heading" class="footer-col-title">{{ t('footer.colLegal') }}</h3>
              <ul class="footer-link-stack">
                <li>
                  <NuxtLink :to="localePath('/mentions')" class="footer-link">
                    {{ t('footer.links.legalNotice') }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="localePath('/cgu')" class="footer-link">{{ t('footer.links.terms') }}</NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="localePath('/privacy')" class="footer-link">{{ t('footer.links.privacy') }}</NuxtLink>
                </li>
              </ul>
            </nav>

            <nav aria-labelledby="footer-resources-heading">
              <h3 id="footer-resources-heading" class="footer-col-title">{{ t('footer.colResources') }}</h3>
              <ul class="footer-link-stack">
                <li>
                  <NuxtLink :to="localePath('/contact')" class="footer-link">{{ t('footer.links.contact') }}</NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="localePath('/docs')" class="footer-link">{{ t('footer.links.docs') }}</NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="localePath('/services')" class="footer-link">{{ t('footer.links.services') }}</NuxtLink>
                </li>
              </ul>
            </nav>

            <nav
              class="sm:col-span-2 lg:col-span-1"
              aria-labelledby="footer-social-heading"
            >
              <h3 id="footer-social-heading" class="footer-col-title">{{ t('footer.colSocial') }}</h3>
              <ul class="footer-link-stack">
                <li>
                  <a
                    href="https://github.com/cedricbatina/derniers-leopards-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-link footer-link-inline"
                  >
                    <Icon name="mdi:github" class="footer-link-icon shrink-0" aria-hidden="true" />
                    <span>{{ t('footer.links.github') }}</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/sonekeno"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-link footer-link-inline"
                  >
                    <Icon name="mdi:twitter" class="footer-link-icon shrink-0" aria-hidden="true" />
                    <span>{{ t('footer.links.twitter') }}</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
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

/** Fichier servi depuis /public (éviter src statique `/…` → Vite tente un import module). */
const logoMarkSrc = '/images/logo-sonekeno-mark.png'

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

<style scoped>
.premium-footer {
  border-top: 1px solid rgb(var(--border));
  background: linear-gradient(to bottom, rgb(var(--surface) / 0.72), rgb(var(--surface2) / 0.94));
}
.dark .premium-footer {
  background: linear-gradient(to bottom, rgb(var(--surface) / 0.55), rgb(var(--surface2) / 0.97));
}
.footer-col-title {
  margin: 0 0 0.85rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.085em;
  text-transform: uppercase;
  color: rgb(var(--muted));
}
.footer-link-stack {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  align-items: flex-start;
}
.footer-link-stack--row {
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 1.1rem;
  row-gap: 0.65rem;
}
.footer-link {
  color: rgb(var(--brand));
  text-decoration: none;
  font-weight: 600;
  line-height: 1.42;
  transition:
    color var(--t-fast) var(--ease),
    opacity var(--t-fast) var(--ease);
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  max-width: 100%;
  word-break: break-word;
}
.footer-link-inline {
  align-items: center;
}
.footer-link-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}
.footer-link:hover {
  color: rgb(var(--brand2));
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.brand-title {
  font-weight: 900;
  letter-spacing: -0.02em;
  background: linear-gradient(90deg, rgb(var(--text)) 0%, rgb(var(--brand2)) 65%, rgb(var(--brand)) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.05;
}
.brand-tagline {
  margin-top: 0.15rem;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  color: rgb(var(--muted));
}
</style>