// nuxt.config.js
export default defineNuxtConfig({
   compatibilityDate: '2026-01-20',
  ssr: true,
  devtools: { enabled: true },
  vite: {
    server: {
      hmr: { port: 24679 },
    },
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
    classSuffix: '', // => .dark sur <html>
    preference: 'system',
    fallback: 'light',
    storageKey: 'ldl-color-mode',
  },

  nitro: {
    preset: 'vercel',
    compressPublicAssets: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      titleTemplate: '%s · Les derniers léopards',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', content: '#FBF8F1' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' },
      ],
    },
  },

i18n: {
  locales: [
    { code: "fr", iso: "fr-FR", file: "fr.json", name: "Français" },
    { code: "en", iso: "en-US", file: "en.json", name: "English" },
         { code: "pt", iso: "pt-PT", file: "pt.json", name: "Português" },
    //  { code: "es", iso: "es-ES", file: "es.json", name: "Español" },
  ],
  defaultLocale: "fr",
  strategy: "prefix_except_default",
  lazy: true,

  // Dossier à la racine (exactement comme ton autre projet)
  langDir: "locales",

  // Fichier de config à la racine
  vueI18n: "./i18n.config.js",
},



  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Les derniers léopards',
      short_name: 'Léopards',
      description: 'Bible & app de production du roman Les derniers léopards.',
      lang: 'fr',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
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
    // Server-only
    DB_HOST: process.env.DB_HOST || '',
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    DB_USER: process.env.DB_USER || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || '',

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',

    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    EMAIL_FROM: process.env.EMAIL_FROM || '',
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Les derniers léopards',
    EMAIL_TO: process.env.EMAIL_TO || '',

    APP_URL: process.env.APP_URL || 'http://localhost:3010',

    // Client-exposed
    public: {
      APP_NAME: process.env.APP_NAME || 'Les derniers léopards',
      APP_URL: process.env.APP_URL || 'http://localhost:3009',
      SITE_URL: process.env.NUXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3009',
    },
  },
})
