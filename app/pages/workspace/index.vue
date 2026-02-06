<template>
  <section class="space-y-6 sm:space-y-10">
    <!-- Hero -->
    <div class="card overflow-hidden">
      <div class="card-body">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-3">
            <p class="badge">
              <Icon name="mdi:feather" aria-hidden="true" />
              {{ t("home.hero.kicker") }}
            </p>

            <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {{ t("home.hero.title") }}
            </h1>

            <p class="text-muted max-w-2xl">
              {{ t("home.hero.subtitle") }}
            </p>

            <div class="flex flex-wrap gap-2 pt-2">
              <NuxtLink :to="localePath('/characters')" class="btn btn-primary focus-ring">
                <Icon name="mdi:account-group" aria-hidden="true" />
                {{ t("home.hero.ctaPrimary") }}
              </NuxtLink>

              <NuxtLink :to="localePath('/timeline')" class="btn btn-ghost focus-ring">
                <Icon name="mdi:timeline" aria-hidden="true" />
                {{ t("home.hero.ctaSecondary") }}
              </NuxtLink>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 w-full sm:w-90">
            <div class="card bg-surface2">
              <div class="card-body">
                <div class="text-xs text-muted">{{ t("home.tiles.characters.label") }}</div>
                <div class="text-lg font-extrabold">{{ t("home.tiles.characters.title") }}</div>
                <div class="text-xs text-muted mt-1">{{ t("home.tiles.characters.desc") }}</div>
              </div>
            </div>

            <div class="card bg-surface2">
              <div class="card-body">
                <div class="text-xs text-muted">{{ t("home.tiles.scenes.label") }}</div>
                <div class="text-lg font-extrabold">{{ t("home.tiles.scenes.title") }}</div>
                <div class="text-xs text-muted mt-1">{{ t("home.tiles.scenes.desc") }}</div>
              </div>
            </div>

            <div class="card bg-surface2">
              <div class="card-body">
                <div class="text-xs text-muted">{{ t("home.tiles.timeline.label") }}</div>
                <div class="text-lg font-extrabold">{{ t("home.tiles.timeline.title") }}</div>
                <div class="text-xs text-muted mt-1">{{ t("home.tiles.timeline.desc") }}</div>
              </div>
            </div>

            <div class="card bg-surface2">
              <div class="card-body">
                <div class="text-xs text-muted">{{ t("home.tiles.glossary.label") }}</div>
                <div class="text-lg font-extrabold">{{ t("home.tiles.glossary.title") }}</div>
                <div class="text-xs text-muted mt-1">{{ t("home.tiles.glossary.desc") }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modules -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink :to="localePath('/characters')" class="card hover:opacity-[0.98] transition focus-ring">
        <div class="card-body space-y-2">
          <div class="flex items-center justify-between">
            <div class="badge">
              <Icon name="mdi:account-group" aria-hidden="true" />
              {{ t("home.modules.characters.badge") }}
            </div>
            <Icon name="mdi:chevron-right" class="text-muted" aria-hidden="true" />
          </div>
          <div class="font-extrabold text-lg">{{ t("home.modules.characters.title") }}</div>
          <p class="text-sm text-muted">{{ t("home.modules.characters.desc") }}</p>
        </div>
      </NuxtLink>

      <NuxtLink :to="localePath('/scenes')" class="card hover:opacity-[0.98] transition focus-ring">
        <div class="card-body space-y-2">
          <div class="flex items-center justify-between">
            <div class="badge">
              <Icon name="mdi:movie-open" aria-hidden="true" />
              {{ t("home.modules.scenes.badge") }}
            </div>
            <Icon name="mdi:chevron-right" class="text-muted" aria-hidden="true" />
          </div>
          <div class="font-extrabold text-lg">{{ t("home.modules.scenes.title") }}</div>
          <p class="text-sm text-muted">{{ t("home.modules.scenes.desc") }}</p>
        </div>
      </NuxtLink>

      <NuxtLink :to="localePath('/timeline')" class="card hover:opacity-[0.98] transition focus-ring">
        <div class="card-body space-y-2">
          <div class="flex items-center justify-between">
            <div class="badge">
              <Icon name="mdi:timeline" aria-hidden="true" />
              {{ t("home.modules.timeline.badge") }}
            </div>
            <Icon name="mdi:chevron-right" class="text-muted" aria-hidden="true" />
          </div>
          <div class="font-extrabold text-lg">{{ t("home.modules.timeline.title") }}</div>
          <p class="text-sm text-muted">{{ t("home.modules.timeline.desc") }}</p>
        </div>
      </NuxtLink>

      <NuxtLink :to="localePath('/glossary')" class="card hover:opacity-[0.98] transition focus-ring">
        <div class="card-body space-y-2">
          <div class="flex items-center justify-between">
            <div class="badge">
              <Icon name="mdi:book-open-page-variant" aria-hidden="true" />
              {{ t("home.modules.glossary.badge") }}
            </div>
            <Icon name="mdi:chevron-right" class="text-muted" aria-hidden="true" />
          </div>
          <div class="font-extrabold text-lg">{{ t("home.modules.glossary.title") }}</div>
          <p class="text-sm text-muted">{{ t("home.modules.glossary.desc") }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Trust -->
    <div class="card">
      <div class="card-body flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="text-sm text-muted">
          {{ t("home.trust.text") }}
        </div>
        <NuxtLink :to="localePath('/login')" class="btn btn-sm focus-ring">
          <Icon name="mdi:login" aria-hidden="true" />
          {{ t("home.trust.cta") }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })


  import { computed, useColorMode, useI18n, useLocalePath, useSwitchLocalePath } from '#imports'
import { useAuthStore } from '~/stores/auth.store'




const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const config = useRuntimeConfig()

const appName = computed(() => config.public?.APP_NAME || t("app.name"))
const siteUrl = computed(() => config.public?.SITE_URL || config.public?.APP_URL || "http://localhost:3009")

/**
 * Canonical = URL absolue de la page courante.
 * Ici: home => "/"
 * (Tu peux généraliser ensuite avec useRoute().path)
 */
const canonical = computed(() => new URL(localePath("/"), siteUrl.value).toString())

/**
 * Alternates i18n
 */
const alternateFr = computed(() => new URL(switchLocalePath("fr") || "/", siteUrl.value).toString())
const alternateEn = computed(() => new URL(switchLocalePath("en") || "/en", siteUrl.value).toString())
const alternatePt = computed(() => new URL(switchLocalePath("en") || "/pt", siteUrl.value).toString())

/**
 * Images OG (mets un vrai fichier dans /public/og/og.png par exemple)
 */
const ogImage = computed(() => new URL("/og/og.png", siteUrl.value).toString())

/**
 * Locale OG
 */
const ogLocale = computed(() => (locale.value === "fr" ? "fr_FR" : "en_US"))

/**
 * Keywords : optionnel (Google en tient peu compte), mais utile pour certains moteurs / cohérence.
 * Garde-le sobre.
 */
const keywords = computed(() => t("app.meta.keywords"))

/**
 * Theme color : si tu utilises color-mode, tu peux le lier à .dark
 * Si tu n’as pas encore de palette, laisse un couple sobre.
 */
const themeColorLight = computed(() => t("app.meta.themeColorLight"))
const themeColorDark = computed(() => t("app.meta.themeColorDark"))

useSeoMeta(() => ({
  // Base
  title: t("app.meta.title", { name: appName.value }),
  description: t("app.meta.description"),
  applicationName: appName.value,

  // Robots
  robots: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",

  // Canonical/URL
  ogUrl: canonical.value,

  // Open Graph
  ogType: "website",
  ogSiteName: appName.value,
  ogTitle: t("app.meta.ogTitle", { name: appName.value }),
  ogDescription: t("app.meta.ogDescription"),
  ogImage: ogImage.value,
  ogImageAlt: t("app.meta.ogImageAlt"),
  ogLocale: ogLocale.value,

  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: t("app.meta.ogTitle", { name: appName.value }),
  twitterDescription: t("app.meta.ogDescription"),
  twitterImage: ogImage.value,

  // Optionnels mais propres
  keywords: keywords.value,
  themeColor: themeColorLight.value
}))

useHead(() => ({
  link: [
    { rel: "canonical", href: canonical.value },

    // Alternates
    { rel: "alternate", href: alternateFr.value, hreflang: "fr" },
    { rel: "alternate", href: alternateEn.value, hreflang: "en" },
    { rel: "alternate", href: canonical.value, hreflang: "x-default" }
  ],
  meta: [
    // theme-color selon scheme (supporté par Chrome/Android notamment)
    { name: "theme-color", content: themeColorLight.value, media: "(prefers-color-scheme: light)" },
    { name: "theme-color", content: themeColorDark.value, media: "(prefers-color-scheme: dark)" }
  ],
  htmlAttrs: {
    lang: locale.value
  }
}))
</script>

