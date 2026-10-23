// nuxt.config.mjs — extension .mjs : évite bugs de rechargement (jiti + runtimeConfig) avec nuxt.config.js
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-20',
  ssr: true,
  devtools: { enabled: true },
  vite: {
    server: {
      hmr: { port: 24720, clientPort: 24720 },
    },
    plugins: [tailwindcss()],
  },
  devServer: {
    port: 3009,
    host: '0.0.0.0',
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'ldl-color-mode',
  },

  // Pas de bloc `nitro` ici : avec nuxt.config.* + reload à chaud, il peut déclencher
  // « Cannot delete property 'runtimeConfig' » (nuxt/nuxt#33436). La compression des
  // assets statiques reste disponible via preset de déploiement si besoin.

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      titleTemplate: '%s · Sonekeno',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', content: '#FBF8F1' },
        {
          name: 'description',
          content:
            'Sonekeno — studio narratif : univers, romans et séries (scènes, personnages, chronologie). IP pilier : Les Derniers Léopards.',
        },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
      ],
    },
  },

  i18n: {
    locales: [
      { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'pt', iso: 'pt-PT', file: 'pt.json', name: 'Português' },
    ],
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: 'locales',
    vueI18n: './i18n.config.js',
    customRoutes: 'config',
    pages: {
      'access-denied': {
        fr: '/acces-refuse',
        en: '/access-denied',
        pt: '/acesso-negado',
      },
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Sonekeno',
      short_name: 'Sonekeno',
      description:
        'Espace pour structurer univers, romans et séries — scènes, personnages, chronologie.',
      lang: 'fr',
      theme_color: '#FBF8F1',
      background_color: '#FBF8F1',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/maskable-icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        { src: '/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    devOptions: {
      enabled: process.env.PWA_DEV === 'true',
      type: 'module',
    },
  },

  sitemap: {
    siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3009',
    autoLastmod: true,
    xsl: false,
    i18n: true,
  },

  runtimeConfig: {
    DB_HOST: process.env.DB_HOST || '',
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    DB_USER: process.env.DB_USER || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || '',
    DB_HOST_LOCAL: process.env.DB_HOST_LOCAL,
    DB_PORT_LOCAL: process.env.DB_PORT_LOCAL,
    DB_USER_LOCAL: process.env.DB_USER_LOCAL,
    DB_PASSWORD_LOCAL: process.env.DB_PASSWORD_LOCAL,
    DB_NAME_LOCAL: process.env.DB_NAME_LOCAL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    EMAIL_FROM: process.env.EMAIL_FROM || '',
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Les derniers léopards',
    EMAIL_TO: process.env.EMAIL_TO || '',
    APP_URL: process.env.APP_URL || 'http://localhost:3009',
    /** Racine absolue où se trouvent `scripts/canon-sources.mjs` + `text-files/` (vide = process.cwd()). */
    canonSyncRoot: process.env.CANON_SYNC_ROOT || '',
    public: {
      APP_NAME: process.env.APP_NAME || 'Les derniers léopards',
      APP_URL: process.env.APP_URL || 'http://localhost:3009',
      SITE_URL: process.env.NUXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3009',
    },
  },
})
