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
  __name: "access",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const config = useRuntimeConfig();
    const canonicalPath = computed(() => localePath("/explore/access"));
    const baseUrl = computed(() => config.public?.SITE_URL || "");
    const canonicalUrl = computed(() => baseUrl.value ? new URL(canonicalPath.value, baseUrl.value).toString() : canonicalPath.value);
    const seoTitle = computed(() => t("seo.explore.access.title"));
    const seoDescription = computed(() => t("seo.explore.access.description"));
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
      principles: {
        auth: "/register",
        roles: "/explore/workflow",
        audit: "/explore/timeline"
      },
      levels: {
        viewer: "/explore/editors",
        editor: "/explore/writing",
        owner: "/register"
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6 sm:space-y-10" }, _attrs))} data-v-69541de3><div class="card card-hover card-accent accent-copper overflow-hidden js-reveal" data-v-69541de3><div class="card-body" data-v-69541de3><div class="flex flex-col gap-4 sm:gap-5" data-v-69541de3><p class="badge badge-accent w-fit" data-v-69541de3>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:shield-lock-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.access.hero.badge"))}</p><h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline" data-v-69541de3>${ssrInterpolate(unref(t)("explore.access.hero.title"))}</h1><p class="text-subtle max-w-2xl" data-v-69541de3>${ssrInterpolate(unref(t)("explore.access.hero.lead"))}</p><div class="flex flex-wrap gap-2 pt-1" data-v-69541de3>`);
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
        to: unref(localePath)("/explore/workflow"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:rocket-launch-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.access.hero.ctaWorkflow"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:rocket-launch-outline",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.access.hero.ctaWorkflow")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div><div class="grid gap-4 lg:grid-cols-3" data-v-69541de3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.principles.auth),
        class: "card-link focus-ring js-reveal",
        "aria-label": "Accès — Authentification"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-earth bg-surface2 h-full" data-v-69541de3${_scopeId}><div class="card-body space-y-2" data-v-69541de3${_scopeId}><div class="badge badge-accent w-fit" data-v-69541de3${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:cookie-lock",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.access.cards.auth.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-69541de3${_scopeId}>${ssrInterpolate(unref(t)("explore.access.cards.auth.title"))}</div><p class="text-sm text-muted" data-v-69541de3${_scopeId}>${ssrInterpolate(unref(t)("explore.access.cards.auth.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-earth bg-surface2 h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:cookie-lock",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.access.cards.auth.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.access.cards.auth.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.access.cards.auth.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.principles.roles),
        class: "card-link focus-ring js-reveal",
        "aria-label": "Accès — Permissions"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-river bg-surface2 h-full" data-v-69541de3${_scopeId}><div class="card-body space-y-2" data-v-69541de3${_scopeId}><div class="badge badge-accent w-fit" data-v-69541de3${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:shield-account-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.access.cards.roles.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-69541de3${_scopeId}>${ssrInterpolate(unref(t)("explore.access.cards.roles.title"))}</div><p class="text-sm text-muted" data-v-69541de3${_scopeId}>${ssrInterpolate(unref(t)("explore.access.cards.roles.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-river bg-surface2 h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:shield-account-outline",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.access.cards.roles.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.access.cards.roles.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.access.cards.roles.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.principles.audit),
        class: "card-link focus-ring js-reveal",
        "aria-label": "Accès — Traçabilité"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-forest bg-surface2 h-full" data-v-69541de3${_scopeId}><div class="card-body space-y-2" data-v-69541de3${_scopeId}><div class="badge badge-accent w-fit" data-v-69541de3${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:lock-check-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.access.cards.audit.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-69541de3${_scopeId}>${ssrInterpolate(unref(t)("explore.access.cards.audit.title"))}</div><p class="text-sm text-muted" data-v-69541de3${_scopeId}>${ssrInterpolate(unref(t)("explore.access.cards.audit.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-forest bg-surface2 h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:lock-check-outline",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.access.cards.audit.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.access.cards.audit.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.access.cards.audit.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="card js-reveal" data-v-69541de3><div class="card-body" data-v-69541de3><div class="flex items-center justify-between gap-3" data-v-69541de3><div data-v-69541de3><div class="font-extrabold text-lg title-gradient" data-v-69541de3>${ssrInterpolate(unref(t)("explore.access.levels.title"))}</div><div class="text-sm text-muted" data-v-69541de3>${ssrInterpolate(unref(t)("explore.access.levels.subtitle"))}</div></div><div class="badge" data-v-69541de3>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:account-key-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.access.levels.badge"))}</div></div><div class="grid gap-3 sm:grid-cols-3 mt-4" data-v-69541de3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.levels.viewer),
        class: "card-link focus-ring js-reveal",
        "aria-label": "Niveau d’accès — Lecture"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-earth h-full" data-v-69541de3${_scopeId}><div class="card-body space-y-2" data-v-69541de3${_scopeId}><div class="badge badge-accent w-fit" data-v-69541de3${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:eye-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.access.levels.viewer.badge"))}</div><div class="font-extrabold title-gradient" data-v-69541de3${_scopeId}>${ssrInterpolate(unref(t)("explore.access.levels.viewer.title"))}</div><p class="text-sm text-muted" data-v-69541de3${_scopeId}>${ssrInterpolate(unref(t)("explore.access.levels.viewer.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-earth h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:eye-outline",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.access.levels.viewer.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("explore.access.levels.viewer.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.access.levels.viewer.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.levels.editor),
        class: "card-link focus-ring js-reveal",
        "aria-label": "Niveau d’accès — Édition"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-river h-full" data-v-69541de3${_scopeId}><div class="card-body space-y-2" data-v-69541de3${_scopeId}><div class="badge badge-accent w-fit" data-v-69541de3${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:pencil-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.access.levels.editor.badge"))}</div><div class="font-extrabold title-gradient" data-v-69541de3${_scopeId}>${ssrInterpolate(unref(t)("explore.access.levels.editor.title"))}</div><p class="text-sm text-muted" data-v-69541de3${_scopeId}>${ssrInterpolate(unref(t)("explore.access.levels.editor.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-river h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:pencil-outline",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.access.levels.editor.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("explore.access.levels.editor.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.access.levels.editor.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.levels.owner),
        class: "card-link focus-ring js-reveal",
        "aria-label": "Niveau d’accès — Pilotage"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-copper h-full" data-v-69541de3${_scopeId}><div class="card-body space-y-2" data-v-69541de3${_scopeId}><div class="badge badge-accent w-fit" data-v-69541de3${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:crown-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.access.levels.owner.badge"))}</div><div class="font-extrabold title-gradient" data-v-69541de3${_scopeId}>${ssrInterpolate(unref(t)("explore.access.levels.owner.title"))}</div><p class="text-sm text-muted" data-v-69541de3${_scopeId}>${ssrInterpolate(unref(t)("explore.access.levels.owner.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-copper h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:crown-outline",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.access.levels.owner.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("explore.access.levels.owner.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.access.levels.owner.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal" data-v-69541de3><div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-v-69541de3><div class="space-y-1" data-v-69541de3><div class="badge badge-accent w-fit" data-v-69541de3>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:flash-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.access.bottom.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-69541de3>${ssrInterpolate(unref(t)("explore.access.bottom.title"))}</div><p class="text-sm text-muted" data-v-69541de3>${ssrInterpolate(unref(t)("explore.access.bottom.desc"))}</p></div><div class="flex flex-wrap gap-2" data-v-69541de3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/register"),
        class: "btn btn-primary focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("explore.common.start"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("explore.common.start")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/workflow"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:rocket-launch-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.access.bottom.ctaWorkflow"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:rocket-launch-outline",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.access.bottom.ctaWorkflow")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/explore/access.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const access = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-69541de3"]]);

export { access as default };
//# sourceMappingURL=access-BbKbvMC_.mjs.map
