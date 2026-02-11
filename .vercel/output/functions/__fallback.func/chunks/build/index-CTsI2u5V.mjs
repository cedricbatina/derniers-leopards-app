import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a as useI18n, b as useLocalePath, c as useAuthStore, d as useRuntimeConfig, e as useSeoMeta, u as useHead } from './server.mjs';
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

const siteName = "Sonekeno";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale, te } = useI18n();
    const localePath = useLocalePath();
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const isAuthed = computed(() => !!auth.user?.id);
    const canonicalPath = computed(() => localePath("/"));
    const baseUrl = config.public?.SITE_URL || "";
    const canonicalUrl = computed(() => baseUrl ? new URL(canonicalPath.value, baseUrl).toString() : canonicalPath.value);
    const learnMore = computed(
      () => te("landing.common.learnMore") ? t("landing.common.learnMore") : "En savoir plus"
    );
    const title = computed(() => t("seo.home.title", { app: siteName }));
    const description = computed(() => t("seo.home.description", { app: siteName }));
    const ogImage = computed(() => baseUrl ? new URL("/images/og-home.png", baseUrl).toString() : "/images/og-home.png");
    useSeoMeta({
      title,
      description,
      ogTitle: title,
      ogDescription: description,
      ogType: "website",
      ogUrl: canonicalUrl,
      ogImage,
      twitterCard: "summary_large_image",
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage
    });
    useHead({
      link: [{ rel: "canonical", href: canonicalUrl.value }]
    });
    const jsonLd = computed(() => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: baseUrl || canonicalUrl.value,
      inLanguage: locale.value,
      description: description.value,
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl || ""}${localePath("/explore")}?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }));
    useHead({
      script: [{ type: "application/ld+json", children: JSON.stringify(jsonLd.value) }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6 sm:space-y-10" }, _attrs))}><div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal"><div class="card-body"><div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"><div class="space-y-4 max-w-2xl"><p class="badge badge-accent">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:creation",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("landing.hero.kicker"))}</p><h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">${ssrInterpolate(unref(t)("landing.hero.title"))}</h1><p class="text-base sm:text-lg text-subtle">${ssrInterpolate(unref(t)("landing.hero.subtitle"))}</p><div class="flex flex-wrap gap-2 pt-2">`);
      if (!isAuthed.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/register"),
          class: "btn btn-primary focus-ring"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: "mdi:account-plus",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("landing.hero.ctaPrimary"))}`);
            } else {
              return [
                createVNode(_component_Icon, {
                  name: "mdi:account-plus",
                  "aria-hidden": "true"
                }),
                createTextVNode(" " + toDisplayString(unref(t)("landing.hero.ctaPrimary")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!isAuthed.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/login"),
          class: "btn btn-ghost focus-ring"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: "mdi:login",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("landing.hero.ctaSecondary"))}`);
            } else {
              return [
                createVNode(_component_Icon, {
                  name: "mdi:login",
                  "aria-hidden": "true"
                }),
                createTextVNode(" " + toDisplayString(unref(t)("landing.hero.ctaSecondary")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/studio/projects"),
          class: "btn btn-primary focus-ring"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: "mdi:view-dashboard-outline",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("landing.hero.ctaAuthed"))}`);
            } else {
              return [
                createVNode(_component_Icon, {
                  name: "mdi:view-dashboard-outline",
                  "aria-hidden": "true"
                }),
                createTextVNode(" " + toDisplayString(unref(t)("landing.hero.ctaAuthed")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:compass-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("landing.hero.ctaExplore"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:compass-outline",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("landing.hero.ctaExplore")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="pt-3 text-xs text-muted">${ssrInterpolate(unref(t)("landing.hero.trustLine"))}</div></div><div class="w-full lg:w-md"><div class="grid grid-cols-2 gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/writing"),
        class: "card-link js-reveal",
        "aria-label": unref(t)("landing.tiles.authors.title")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 accent-earth"${_scopeId}><div class="card-body"${_scopeId}><div class="text-xs text-muted"${_scopeId}>${ssrInterpolate(unref(t)("landing.tiles.authors.label"))}</div><div class="text-lg font-extrabold title-gradient"${_scopeId}>${ssrInterpolate(unref(t)("landing.tiles.authors.title"))}</div><div class="text-xs text-muted mt-1"${_scopeId}>${ssrInterpolate(unref(t)("landing.tiles.authors.desc"))}</div><div class="mt-2 text-xs text-muted"${_scopeId}>→ ${ssrInterpolate(learnMore.value)}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 accent-earth" }, [
                createVNode("div", { class: "card-body" }, [
                  createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("landing.tiles.authors.label")), 1),
                  createVNode("div", { class: "text-lg font-extrabold title-gradient" }, toDisplayString(unref(t)("landing.tiles.authors.title")), 1),
                  createVNode("div", { class: "text-xs text-muted mt-1" }, toDisplayString(unref(t)("landing.tiles.authors.desc")), 1),
                  createVNode("div", { class: "mt-2 text-xs text-muted" }, "→ " + toDisplayString(learnMore.value), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/editors"),
        class: "card-link js-reveal",
        "aria-label": unref(t)("landing.tiles.editors.title")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 accent-forest"${_scopeId}><div class="card-body"${_scopeId}><div class="text-xs text-muted"${_scopeId}>${ssrInterpolate(unref(t)("landing.tiles.editors.label"))}</div><div class="text-lg font-extrabold title-gradient"${_scopeId}>${ssrInterpolate(unref(t)("landing.tiles.editors.title"))}</div><div class="text-xs text-muted mt-1"${_scopeId}>${ssrInterpolate(unref(t)("landing.tiles.editors.desc"))}</div><div class="mt-2 text-xs text-muted"${_scopeId}>→ ${ssrInterpolate(learnMore.value)}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 accent-forest" }, [
                createVNode("div", { class: "card-body" }, [
                  createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("landing.tiles.editors.label")), 1),
                  createVNode("div", { class: "text-lg font-extrabold title-gradient" }, toDisplayString(unref(t)("landing.tiles.editors.title")), 1),
                  createVNode("div", { class: "text-xs text-muted mt-1" }, toDisplayString(unref(t)("landing.tiles.editors.desc")), 1),
                  createVNode("div", { class: "mt-2 text-xs text-muted" }, "→ " + toDisplayString(learnMore.value), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/studios"),
        class: "card-link js-reveal",
        "aria-label": unref(t)("landing.tiles.studios.title")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 accent-river"${_scopeId}><div class="card-body"${_scopeId}><div class="text-xs text-muted"${_scopeId}>${ssrInterpolate(unref(t)("landing.tiles.studios.label"))}</div><div class="text-lg font-extrabold title-gradient"${_scopeId}>${ssrInterpolate(unref(t)("landing.tiles.studios.title"))}</div><div class="text-xs text-muted mt-1"${_scopeId}>${ssrInterpolate(unref(t)("landing.tiles.studios.desc"))}</div><div class="mt-2 text-xs text-muted"${_scopeId}>→ ${ssrInterpolate(learnMore.value)}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 accent-river" }, [
                createVNode("div", { class: "card-body" }, [
                  createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("landing.tiles.studios.label")), 1),
                  createVNode("div", { class: "text-lg font-extrabold title-gradient" }, toDisplayString(unref(t)("landing.tiles.studios.title")), 1),
                  createVNode("div", { class: "text-xs text-muted mt-1" }, toDisplayString(unref(t)("landing.tiles.studios.desc")), 1),
                  createVNode("div", { class: "mt-2 text-xs text-muted" }, "→ " + toDisplayString(learnMore.value), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/creators"),
        class: "card-link js-reveal",
        "aria-label": unref(t)("landing.tiles.creators.title")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 accent-copper"${_scopeId}><div class="card-body"${_scopeId}><div class="text-xs text-muted"${_scopeId}>${ssrInterpolate(unref(t)("landing.tiles.creators.label"))}</div><div class="text-lg font-extrabold title-gradient"${_scopeId}>${ssrInterpolate(unref(t)("landing.tiles.creators.title"))}</div><div class="text-xs text-muted mt-1"${_scopeId}>${ssrInterpolate(unref(t)("landing.tiles.creators.desc"))}</div><div class="mt-2 text-xs text-muted"${_scopeId}>→ ${ssrInterpolate(learnMore.value)}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 accent-copper" }, [
                createVNode("div", { class: "card-body" }, [
                  createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("landing.tiles.creators.label")), 1),
                  createVNode("div", { class: "text-lg font-extrabold title-gradient" }, toDisplayString(unref(t)("landing.tiles.creators.title")), 1),
                  createVNode("div", { class: "text-xs text-muted mt-1" }, toDisplayString(unref(t)("landing.tiles.creators.desc")), 1),
                  createVNode("div", { class: "mt-2 text-xs text-muted" }, "→ " + toDisplayString(learnMore.value), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/access"),
        class: "card-link js-reveal",
        "aria-label": unref(t)("landing.micro.title")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mt-3 card card-hover bg-surface2 card-accent accent-leopard"${_scopeId}><div class="card-body flex items-center justify-between gap-3"${_scopeId}><div${_scopeId}><div class="text-xs text-muted"${_scopeId}>${ssrInterpolate(unref(t)("landing.micro.kicker"))}</div><div class="font-extrabold title-gradient"${_scopeId}>${ssrInterpolate(unref(t)("landing.micro.title"))}</div><div class="text-xs text-muted mt-1"${_scopeId}>${ssrInterpolate(unref(t)("landing.micro.desc"))}</div><div class="mt-2 text-xs text-muted"${_scopeId}>→ ${ssrInterpolate(learnMore.value)}</div></div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:shield-lock-outline",
              class: "text-2xl",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "mt-3 card card-hover bg-surface2 card-accent accent-leopard" }, [
                createVNode("div", { class: "card-body flex items-center justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("landing.micro.kicker")), 1),
                    createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("landing.micro.title")), 1),
                    createVNode("div", { class: "text-xs text-muted mt-1" }, toDisplayString(unref(t)("landing.micro.desc")), 1),
                    createVNode("div", { class: "mt-2 text-xs text-muted" }, "→ " + toDisplayString(learnMore.value), 1)
                  ]),
                  createVNode(_component_Icon, {
                    name: "mdi:shield-lock-outline",
                    class: "text-2xl",
                    "aria-hidden": "true"
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/structuring"),
        class: "card-link js-reveal",
        "aria-label": unref(t)("landing.value.one.title")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-earth"${_scopeId}><div class="card-body space-y-2"${_scopeId}><div class="badge badge-accent"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:layers-triple",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("landing.value.one.badge"))}</div><div class="font-extrabold text-lg title-gradient"${_scopeId}>${ssrInterpolate(unref(t)("landing.value.one.title"))}</div><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(t)("landing.value.one.desc"))}</p><div class="text-xs text-muted"${_scopeId}>→ ${ssrInterpolate(learnMore.value)}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-earth" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:layers-triple",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("landing.value.one.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("landing.value.one.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("landing.value.one.desc")), 1),
                  createVNode("div", { class: "text-xs text-muted" }, "→ " + toDisplayString(learnMore.value), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/timeline"),
        class: "card-link js-reveal",
        "aria-label": unref(t)("landing.value.two.title")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-river"${_scopeId}><div class="card-body space-y-2"${_scopeId}><div class="badge badge-accent"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:timeline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("landing.value.two.badge"))}</div><div class="font-extrabold text-lg title-gradient"${_scopeId}>${ssrInterpolate(unref(t)("landing.value.two.title"))}</div><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(t)("landing.value.two.desc"))}</p><div class="text-xs text-muted"${_scopeId}>→ ${ssrInterpolate(learnMore.value)}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-river" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:timeline",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("landing.value.two.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("landing.value.two.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("landing.value.two.desc")), 1),
                  createVNode("div", { class: "text-xs text-muted" }, "→ " + toDisplayString(learnMore.value), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/access"),
        class: "card-link js-reveal",
        "aria-label": unref(t)("landing.value.three.title")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-copper"${_scopeId}><div class="card-body space-y-2"${_scopeId}><div class="badge badge-accent"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:book-open-page-variant",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("landing.value.three.badge"))}</div><div class="font-extrabold text-lg title-gradient"${_scopeId}>${ssrInterpolate(unref(t)("landing.value.three.title"))}</div><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(t)("landing.value.three.desc"))}</p><div class="text-xs text-muted"${_scopeId}>→ ${ssrInterpolate(learnMore.value)}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-copper" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:book-open-page-variant",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("landing.value.three.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("landing.value.three.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("landing.value.three.desc")), 1),
                  createVNode("div", { class: "text-xs text-muted" }, "→ " + toDisplayString(learnMore.value), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="card js-reveal"><div class="card-body"><div class="flex items-center justify-between gap-3"><div class="space-y-1"><div class="font-extrabold title-gradient">${ssrInterpolate(unref(t)("explore.index.modules.title"))}</div><div class="text-sm text-muted">${ssrInterpolate(unref(t)("explore.index.modules.subtitle"))}</div></div><div class="badge">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:apps",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.index.modules.badge"))}</div></div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/characters"),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-earth h-full"${_scopeId}><div class="card-body space-y-2"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div class="badge badge-accent w-fit"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:account-group-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.index.modules.cards.characters.title"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(t)("explore.index.modules.cards.characters.desc"))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-earth h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:account-group-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.index.modules.cards.characters.title")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.index.modules.cards.characters.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/scenes"),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-forest h-full"${_scopeId}><div class="card-body space-y-2"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div class="badge badge-accent w-fit"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:movie-open",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.index.modules.cards.scenes.title"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(t)("explore.index.modules.cards.scenes.desc"))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-forest h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:movie-open",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.index.modules.cards.scenes.title")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.index.modules.cards.scenes.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/timeline"),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-river h-full"${_scopeId}><div class="card-body space-y-2"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div class="badge badge-accent w-fit"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:timeline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.index.modules.cards.timeline.title"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(t)("explore.index.modules.cards.timeline.desc"))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-river h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:timeline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.index.modules.cards.timeline.title")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.index.modules.cards.timeline.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/glossary"),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-copper h-full"${_scopeId}><div class="card-body space-y-2"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div class="badge badge-accent w-fit"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:book-open-page-variant-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.index.modules.cards.glossary.title"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="text-sm text-muted"${_scopeId}>${ssrInterpolate(unref(t)("explore.index.modules.cards.glossary.desc"))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-copper h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:book-open-page-variant-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.index.modules.cards.glossary.title")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.index.modules.cards.glossary.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="card card-hover card-accent accent-forest js-reveal"><div class="card-body"><div class="flex items-center justify-between gap-3"><div><div class="font-extrabold text-lg title-gradient title-underline">${ssrInterpolate(unref(t)("landing.how.title"))}</div><div class="text-sm text-muted">${ssrInterpolate(unref(t)("landing.how.subtitle"))}</div></div><div class="badge badge-accent">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:rocket-launch-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("landing.how.badge"))}</div></div><div class="grid gap-3 sm:grid-cols-3 mt-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/workflow") + "#step-1",
        class: "card-link js-reveal",
        "aria-label": unref(t)("landing.how.steps.one.title")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 accent-earth"${_scopeId}><div class="card-body"${_scopeId}><div class="text-xs text-muted"${_scopeId}>${ssrInterpolate(unref(t)("landing.how.steps.one.kicker"))}</div><div class="font-extrabold title-gradient"${_scopeId}>${ssrInterpolate(unref(t)("landing.how.steps.one.title"))}</div><div class="text-sm text-muted mt-1"${_scopeId}>${ssrInterpolate(unref(t)("landing.how.steps.one.desc"))}</div><div class="mt-2 text-xs text-muted"${_scopeId}>→ ${ssrInterpolate(learnMore.value)}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 accent-earth" }, [
                createVNode("div", { class: "card-body" }, [
                  createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("landing.how.steps.one.kicker")), 1),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("landing.how.steps.one.title")), 1),
                  createVNode("div", { class: "text-sm text-muted mt-1" }, toDisplayString(unref(t)("landing.how.steps.one.desc")), 1),
                  createVNode("div", { class: "mt-2 text-xs text-muted" }, "→ " + toDisplayString(learnMore.value), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/workflow") + "#step-2",
        class: "card-link js-reveal",
        "aria-label": unref(t)("landing.how.steps.two.title")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 accent-river"${_scopeId}><div class="card-body"${_scopeId}><div class="text-xs text-muted"${_scopeId}>${ssrInterpolate(unref(t)("landing.how.steps.two.kicker"))}</div><div class="font-extrabold title-gradient"${_scopeId}>${ssrInterpolate(unref(t)("landing.how.steps.two.title"))}</div><div class="text-sm text-muted mt-1"${_scopeId}>${ssrInterpolate(unref(t)("landing.how.steps.two.desc"))}</div><div class="mt-2 text-xs text-muted"${_scopeId}>→ ${ssrInterpolate(learnMore.value)}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 accent-river" }, [
                createVNode("div", { class: "card-body" }, [
                  createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("landing.how.steps.two.kicker")), 1),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("landing.how.steps.two.title")), 1),
                  createVNode("div", { class: "text-sm text-muted mt-1" }, toDisplayString(unref(t)("landing.how.steps.two.desc")), 1),
                  createVNode("div", { class: "mt-2 text-xs text-muted" }, "→ " + toDisplayString(learnMore.value), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/workflow") + "#step-3",
        class: "card-link js-reveal",
        "aria-label": unref(t)("landing.how.steps.three.title")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 accent-copper"${_scopeId}><div class="card-body"${_scopeId}><div class="text-xs text-muted"${_scopeId}>${ssrInterpolate(unref(t)("landing.how.steps.three.kicker"))}</div><div class="font-extrabold title-gradient"${_scopeId}>${ssrInterpolate(unref(t)("landing.how.steps.three.title"))}</div><div class="text-sm text-muted mt-1"${_scopeId}>${ssrInterpolate(unref(t)("landing.how.steps.three.desc"))}</div><div class="mt-2 text-xs text-muted"${_scopeId}>→ ${ssrInterpolate(learnMore.value)}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 accent-copper" }, [
                createVNode("div", { class: "card-body" }, [
                  createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("landing.how.steps.three.kicker")), 1),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("landing.how.steps.three.title")), 1),
                  createVNode("div", { class: "text-sm text-muted mt-1" }, toDisplayString(unref(t)("landing.how.steps.three.desc")), 1),
                  createVNode("div", { class: "mt-2 text-xs text-muted" }, "→ " + toDisplayString(learnMore.value), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex flex-wrap gap-2 mt-5">`);
      if (!isAuthed.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/register"),
          class: "btn btn-primary focus-ring"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: "mdi:account-plus",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("landing.bottomCta.primary"))}`);
            } else {
              return [
                createVNode(_component_Icon, {
                  name: "mdi:account-plus",
                  "aria-hidden": "true"
                }),
                createTextVNode(" " + toDisplayString(unref(t)("landing.bottomCta.primary")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!isAuthed.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/login"),
          class: "btn btn-ghost focus-ring"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: "mdi:login",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("landing.bottomCta.secondary"))}`);
            } else {
              return [
                createVNode(_component_Icon, {
                  name: "mdi:login",
                  "aria-hidden": "true"
                }),
                createTextVNode(" " + toDisplayString(unref(t)("landing.bottomCta.secondary")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/studio/projects"),
          class: "btn btn-primary focus-ring"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: "mdi:view-dashboard-outline",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("landing.bottomCta.authed"))}`);
            } else {
              return [
                createVNode(_component_Icon, {
                  name: "mdi:view-dashboard-outline",
                  "aria-hidden": "true"
                }),
                createTextVNode(" " + toDisplayString(unref(t)("landing.bottomCta.authed")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/features"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:star-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("landing.bottomCta.features"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:star-outline",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("landing.bottomCta.features")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="card card-hover card-accent accent-river js-reveal"><div class="card-body"><div class="font-extrabold text-lg title-gradient title-underline">${ssrInterpolate(unref(t)("landing.faq.title"))}</div><div class="mt-4 grid gap-3"><details class="card card-hover bg-surface2 js-reveal"><summary class="card-body cursor-pointer font-bold">${ssrInterpolate(unref(t)("landing.faq.q1.q"))}</summary><div class="px-4 pb-4 text-sm text-muted">${ssrInterpolate(unref(t)("landing.faq.q1.a"))}</div></details><details class="card card-hover bg-surface2 js-reveal"><summary class="card-body cursor-pointer font-bold">${ssrInterpolate(unref(t)("landing.faq.q2.q"))}</summary><div class="px-4 pb-4 text-sm text-muted">${ssrInterpolate(unref(t)("landing.faq.q2.a"))}</div></details><details class="card card-hover bg-surface2 js-reveal"><summary class="card-body cursor-pointer font-bold">${ssrInterpolate(unref(t)("landing.faq.q3.q"))}</summary><div class="px-4 pb-4 text-sm text-muted">${ssrInterpolate(unref(t)("landing.faq.q3.a"))}</div></details></div></div></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CTsI2u5V.mjs.map
