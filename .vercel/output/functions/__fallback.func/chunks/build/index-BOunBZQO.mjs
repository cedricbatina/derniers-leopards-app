import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a as useI18n, b as useLocalePath, h as useSwitchLocalePath, d as useRuntimeConfig, e as useSeoMeta, u as useHead } from './server.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../nitro/nitro.mjs';
import 'node:crypto';
import 'nodemailer';
import 'mysql2/promise';
import 'argon2';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'vue-router';
import 'jose';
import '@iconify/utils';
import 'consola';
import 'node:url';
import 'ipx';
import 'pinia';
import 'tailwindcss/colors';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const switchLocalePath = useSwitchLocalePath();
    const config = useRuntimeConfig();
    const appName = computed(() => config.public?.APP_NAME || t("app.name"));
    const siteUrl = computed(() => config.public?.SITE_URL || config.public?.APP_URL || "http://localhost:3009");
    const canonical = computed(() => new URL(localePath("/"), siteUrl.value).toString());
    const alternateFr = computed(() => new URL(switchLocalePath("fr") || "/", siteUrl.value).toString());
    const alternateEn = computed(() => new URL(switchLocalePath("en") || "/en", siteUrl.value).toString());
    computed(() => new URL(switchLocalePath("en") || "/pt", siteUrl.value).toString());
    const ogImage = computed(() => new URL("/og/og.png", siteUrl.value).toString());
    const ogLocale = computed(() => locale.value === "fr" ? "fr_FR" : "en_US");
    const keywords = computed(() => t("app.meta.keywords"));
    const themeColorLight = computed(() => t("app.meta.themeColorLight"));
    const themeColorDark = computed(() => t("app.meta.themeColorDark"));
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
    }));
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
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6 sm:space-y-10" }, _attrs))}><div class="card overflow-hidden"><div class="card-body"><div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div class="space-y-3"><p class="badge">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:feather",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("home.hero.kicker"))}</p><h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">${ssrInterpolate(unref(t)("home.hero.title"))}</h1><p class="text-muted max-w-2xl">${ssrInterpolate(unref(t)("home.hero.subtitle"))}</p><div class="flex flex-wrap gap-2 pt-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/characters"),
        class: "btn btn-primary focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:account-group",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("home.hero.ctaPrimary"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:account-group",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("home.hero.ctaPrimary")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/timeline"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:timeline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("home.hero.ctaSecondary"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:timeline",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("home.hero.ctaSecondary")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="grid grid-cols-2 gap-3 w-full sm:w-90"><div class="card bg-surface2"><div class="card-body"><div class="text-xs text-muted">${ssrInterpolate(unref(t)("home.tiles.characters.label"))}</div><div class="text-lg font-extrabold">${ssrInterpolate(unref(t)("home.tiles.characters.title"))}</div><div class="text-xs text-muted mt-1">${ssrInterpolate(unref(t)("home.tiles.characters.desc"))}</div></div></div><div class="card bg-surface2"><div class="card-body"><div class="text-xs text-muted">${ssrInterpolate(unref(t)("home.tiles.scenes.label"))}</div><div class="text-lg font-extrabold">${ssrInterpolate(unref(t)("home.tiles.scenes.title"))}</div><div class="text-xs text-muted mt-1">${ssrInterpolate(unref(t)("home.tiles.scenes.desc"))}</div></div></div><div class="card bg-surface2"><div class="card-body"><div class="text-xs text-muted">${ssrInterpolate(unref(t)("home.tiles.timeline.label"))}</div><div class="text-lg font-extrabold">${ssrInterpolate(unref(t)("home.tiles.timeline.title"))}</div><div class="text-xs text-muted mt-1">${ssrInterpolate(unref(t)("home.tiles.timeline.desc"))}</div></div></div><div class="card bg-surface2"><div class="card-body"><div class="text-xs text-muted">${ssrInterpolate(unref(t)("home.tiles.glossary.label"))}</div><div class="text-lg font-extrabold">${ssrInterpolate(unref(t)("home.tiles.glossary.title"))}</div><div class="text-xs text-muted mt-1">${ssrInterpolate(unref(t)("home.tiles.glossary.desc"))}</div></div></div></div></div></div></div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/characters"),
        class: "card hover:opacity-[0.98] transition focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-body space-y-2"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="badge"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:account-group",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("home.modules.characters.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:chevron-right",
              class: "text-muted",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold text-lg"${_scopeId}>${ssrInterpolate(unref(t)("home.modules.characters.title"))}</div><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(t)("home.modules.characters.desc"))}</p></div>`);
          } else {
            return [
              createVNode("div", { class: "card-body space-y-2" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", { class: "badge" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:account-group",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("home.modules.characters.badge")), 1)
                  ]),
                  createVNode(_component_Icon, {
                    name: "mdi:chevron-right",
                    class: "text-muted",
                    "aria-hidden": "true"
                  })
                ]),
                createVNode("div", { class: "font-extrabold text-lg" }, toDisplayString(unref(t)("home.modules.characters.title")), 1),
                createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("home.modules.characters.desc")), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/scenes"),
        class: "card hover:opacity-[0.98] transition focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-body space-y-2"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="badge"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:movie-open",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("home.modules.scenes.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:chevron-right",
              class: "text-muted",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold text-lg"${_scopeId}>${ssrInterpolate(unref(t)("home.modules.scenes.title"))}</div><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(t)("home.modules.scenes.desc"))}</p></div>`);
          } else {
            return [
              createVNode("div", { class: "card-body space-y-2" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", { class: "badge" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:movie-open",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("home.modules.scenes.badge")), 1)
                  ]),
                  createVNode(_component_Icon, {
                    name: "mdi:chevron-right",
                    class: "text-muted",
                    "aria-hidden": "true"
                  })
                ]),
                createVNode("div", { class: "font-extrabold text-lg" }, toDisplayString(unref(t)("home.modules.scenes.title")), 1),
                createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("home.modules.scenes.desc")), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/timeline"),
        class: "card hover:opacity-[0.98] transition focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-body space-y-2"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="badge"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:timeline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("home.modules.timeline.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:chevron-right",
              class: "text-muted",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold text-lg"${_scopeId}>${ssrInterpolate(unref(t)("home.modules.timeline.title"))}</div><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(t)("home.modules.timeline.desc"))}</p></div>`);
          } else {
            return [
              createVNode("div", { class: "card-body space-y-2" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", { class: "badge" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:timeline",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("home.modules.timeline.badge")), 1)
                  ]),
                  createVNode(_component_Icon, {
                    name: "mdi:chevron-right",
                    class: "text-muted",
                    "aria-hidden": "true"
                  })
                ]),
                createVNode("div", { class: "font-extrabold text-lg" }, toDisplayString(unref(t)("home.modules.timeline.title")), 1),
                createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("home.modules.timeline.desc")), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/glossary"),
        class: "card hover:opacity-[0.98] transition focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-body space-y-2"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="badge"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:book-open-page-variant",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("home.modules.glossary.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:chevron-right",
              class: "text-muted",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold text-lg"${_scopeId}>${ssrInterpolate(unref(t)("home.modules.glossary.title"))}</div><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(t)("home.modules.glossary.desc"))}</p></div>`);
          } else {
            return [
              createVNode("div", { class: "card-body space-y-2" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", { class: "badge" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:book-open-page-variant",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("home.modules.glossary.badge")), 1)
                  ]),
                  createVNode(_component_Icon, {
                    name: "mdi:chevron-right",
                    class: "text-muted",
                    "aria-hidden": "true"
                  })
                ]),
                createVNode("div", { class: "font-extrabold text-lg" }, toDisplayString(unref(t)("home.modules.glossary.title")), 1),
                createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("home.modules.glossary.desc")), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="card"><div class="card-body flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div class="text-sm text-muted">${ssrInterpolate(unref(t)("home.trust.text"))}</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/login"),
        class: "btn btn-sm focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:login",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("home.trust.cta"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:login",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("home.trust.cta")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/workspace/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BOunBZQO.mjs.map
