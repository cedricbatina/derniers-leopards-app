import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { a as useI18n, b as useLocalePath, d as useRuntimeConfig, e as useSeoMeta, u as useHead } from './server.mjs';
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
  __name: "timeline",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const config = useRuntimeConfig();
    const canonicalPath = computed(() => localePath("/explore/timeline"));
    const baseUrl = computed(() => config.public?.SITE_URL || "");
    const canonicalUrl = computed(() => baseUrl.value ? new URL(canonicalPath.value, baseUrl.value).toString() : canonicalPath.value);
    const seoTitle = computed(() => t("seo.explore.timeline.title"));
    const seoDescription = computed(() => t("seo.explore.timeline.description"));
    const ogImage = computed(() => baseUrl.value ? new URL("/images/og-explore.png", baseUrl.value).toString() : "/images/og-explore.png");
    useSeoMeta({
      title: () => seoTitle.value,
      description: () => seoDescription.value,
      ogTitle: () => seoTitle.value,
      ogDescription: () => seoDescription.value,
      ogType: "website",
      ogUrl: () => canonicalUrl.value,
      ogImage: () => ogImage.value,
      twitterCard: "summary_large_image",
      twitterTitle: () => seoTitle.value,
      twitterDescription: () => seoDescription.value,
      twitterImage: () => ogImage.value
    });
    useHead(() => ({
      link: [{ rel: "canonical", href: canonicalUrl.value }]
    }));
    const jsonLd = computed(() => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: seoTitle.value,
      description: seoDescription.value,
      inLanguage: locale.value,
      url: baseUrl.value || canonicalUrl.value
    }));
    useHead(() => ({
      script: [{ type: "application/ld+json", children: JSON.stringify(jsonLd.value) }]
    }));
    const linkMap = {
      pillars: {
        events: "/explore/scenes",
        arcs: "/explore/characters",
        versions: "/explore/access"
      },
      practice: {
        one: "/explore/structuring",
        two: "/explore/characters",
        three: "/explore/access"
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6 sm:space-y-10" }, _attrs))} data-v-bf62a6fc><div class="card card-hover card-accent accent-river overflow-hidden js-reveal" data-v-bf62a6fc><div class="card-body" data-v-bf62a6fc><div class="flex flex-col gap-4 sm:gap-5" data-v-bf62a6fc><p class="badge badge-accent w-fit" data-v-bf62a6fc>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:timeline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.timelinePage.hero.badge"))}</p><h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline" data-v-bf62a6fc>${ssrInterpolate(unref(t)("explore.timelinePage.hero.title"))}</h1><p class="text-subtle max-w-2xl" data-v-bf62a6fc>${ssrInterpolate(unref(t)("explore.timelinePage.hero.lead"))}</p><div class="flex flex-wrap gap-2 pt-1" data-v-bf62a6fc>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/workflow"),
        class: "btn btn-primary focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:rocket-launch-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.timelinePage.hero.ctaWorkflow"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:rocket-launch-outline",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.timelinePage.hero.ctaWorkflow")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
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
            _push2(` ${ssrInterpolate(unref(t)("explore.common.backExplore"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:compass-outline",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.common.backExplore")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/register"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:account-plus",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.common.start"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:account-plus",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.common.start")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div><div class="grid gap-4 lg:grid-cols-3" data-v-bf62a6fc>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.pillars.events),
        class: "card-link focus-ring js-reveal",
        "aria-label": "Chronologie — Événements"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-earth bg-surface2 h-full" data-v-bf62a6fc${_scopeId}><div class="card-body space-y-2" data-v-bf62a6fc${_scopeId}><div class="badge badge-accent w-fit" data-v-bf62a6fc${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:calendar-clock-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.timelinePage.pillars.events.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-bf62a6fc${_scopeId}>${ssrInterpolate(unref(t)("explore.timelinePage.pillars.events.title"))}</div><p class="text-sm text-muted" data-v-bf62a6fc${_scopeId}>${ssrInterpolate(unref(t)("explore.timelinePage.pillars.events.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-earth bg-surface2 h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:calendar-clock-outline",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.timelinePage.pillars.events.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.timelinePage.pillars.events.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.timelinePage.pillars.events.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.pillars.arcs),
        class: "card-link focus-ring js-reveal",
        "aria-label": "Chronologie — Arcs & périodes"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-forest bg-surface2 h-full" data-v-bf62a6fc${_scopeId}><div class="card-body space-y-2" data-v-bf62a6fc${_scopeId}><div class="badge badge-accent w-fit" data-v-bf62a6fc${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:map-marker-path",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.timelinePage.pillars.arcs.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-bf62a6fc${_scopeId}>${ssrInterpolate(unref(t)("explore.timelinePage.pillars.arcs.title"))}</div><p class="text-sm text-muted" data-v-bf62a6fc${_scopeId}>${ssrInterpolate(unref(t)("explore.timelinePage.pillars.arcs.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-forest bg-surface2 h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:map-marker-path",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.timelinePage.pillars.arcs.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.timelinePage.pillars.arcs.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.timelinePage.pillars.arcs.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.pillars.versions),
        class: "card-link focus-ring js-reveal",
        "aria-label": "Chronologie — Versions"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-copper bg-surface2 h-full" data-v-bf62a6fc${_scopeId}><div class="card-body space-y-2" data-v-bf62a6fc${_scopeId}><div class="badge badge-accent w-fit" data-v-bf62a6fc${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:source-branch",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.timelinePage.pillars.versions.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-bf62a6fc${_scopeId}>${ssrInterpolate(unref(t)("explore.timelinePage.pillars.versions.title"))}</div><p class="text-sm text-muted" data-v-bf62a6fc${_scopeId}>${ssrInterpolate(unref(t)("explore.timelinePage.pillars.versions.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-copper bg-surface2 h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:source-branch",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.timelinePage.pillars.versions.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.timelinePage.pillars.versions.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.timelinePage.pillars.versions.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="card js-reveal" data-v-bf62a6fc><div class="card-body" data-v-bf62a6fc><div class="flex items-center justify-between gap-3" data-v-bf62a6fc><div data-v-bf62a6fc><div class="font-extrabold text-lg title-gradient" data-v-bf62a6fc>${ssrInterpolate(unref(t)("explore.timelinePage.practice.title"))}</div><div class="text-sm text-muted" data-v-bf62a6fc>${ssrInterpolate(unref(t)("explore.timelinePage.practice.subtitle"))}</div></div><div class="badge" data-v-bf62a6fc>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:toolbox-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.timelinePage.practice.badge"))}</div></div><div class="grid gap-3 sm:grid-cols-3 mt-4" data-v-bf62a6fc>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.practice.one),
        class: "card-link focus-ring js-reveal",
        "aria-label": "Concrètement — Vision"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-earth h-full" data-v-bf62a6fc${_scopeId}><div class="card-body space-y-2" data-v-bf62a6fc${_scopeId}><div class="badge badge-accent w-fit" data-v-bf62a6fc${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:flag-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.timelinePage.practice.one.badge"))}</div><div class="font-extrabold title-gradient" data-v-bf62a6fc${_scopeId}>${ssrInterpolate(unref(t)("explore.timelinePage.practice.one.title"))}</div><p class="text-sm text-muted" data-v-bf62a6fc${_scopeId}>${ssrInterpolate(unref(t)("explore.timelinePage.practice.one.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-earth h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:flag-outline",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.timelinePage.practice.one.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("explore.timelinePage.practice.one.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.timelinePage.practice.one.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.practice.two),
        class: "card-link focus-ring js-reveal",
        "aria-label": "Concrètement — Liens"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-river h-full" data-v-bf62a6fc${_scopeId}><div class="card-body space-y-2" data-v-bf62a6fc${_scopeId}><div class="badge badge-accent w-fit" data-v-bf62a6fc${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:link-variant",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.timelinePage.practice.two.badge"))}</div><div class="font-extrabold title-gradient" data-v-bf62a6fc${_scopeId}>${ssrInterpolate(unref(t)("explore.timelinePage.practice.two.title"))}</div><p class="text-sm text-muted" data-v-bf62a6fc${_scopeId}>${ssrInterpolate(unref(t)("explore.timelinePage.practice.two.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-river h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:link-variant",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.timelinePage.practice.two.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("explore.timelinePage.practice.two.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.timelinePage.practice.two.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.practice.three),
        class: "card-link focus-ring js-reveal",
        "aria-label": "Concrètement — Pilotage"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-copper h-full" data-v-bf62a6fc${_scopeId}><div class="card-body space-y-2" data-v-bf62a6fc${_scopeId}><div class="badge badge-accent w-fit" data-v-bf62a6fc${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:check-circle-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.timelinePage.practice.three.badge"))}</div><div class="font-extrabold title-gradient" data-v-bf62a6fc${_scopeId}>${ssrInterpolate(unref(t)("explore.timelinePage.practice.three.title"))}</div><p class="text-sm text-muted" data-v-bf62a6fc${_scopeId}>${ssrInterpolate(unref(t)("explore.timelinePage.practice.three.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-copper h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:check-circle-outline",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.timelinePage.practice.three.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("explore.timelinePage.practice.three.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.timelinePage.practice.three.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal" data-v-bf62a6fc><div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-v-bf62a6fc><div class="space-y-1" data-v-bf62a6fc><div class="badge badge-accent w-fit" data-v-bf62a6fc>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:shield-lock-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.timelinePage.bottom.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-bf62a6fc>${ssrInterpolate(unref(t)("explore.timelinePage.bottom.title"))}</div><p class="text-sm text-muted" data-v-bf62a6fc>${ssrInterpolate(unref(t)("explore.timelinePage.bottom.desc"))}</p></div><div class="flex flex-wrap gap-2" data-v-bf62a6fc>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/access"),
        class: "btn btn-primary focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.timelinePage.bottom.ctaAccess"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:arrow-right",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.timelinePage.bottom.ctaAccess")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("explore.common.backExplore"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("explore.common.backExplore")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/explore/timeline.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const timeline = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bf62a6fc"]]);

export { timeline as default };
//# sourceMappingURL=timeline-G67aX9dO.mjs.map
