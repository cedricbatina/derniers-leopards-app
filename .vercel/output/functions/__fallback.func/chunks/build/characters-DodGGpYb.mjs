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
  __name: "characters",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const config = useRuntimeConfig();
    const canonicalPath = computed(() => localePath("/explore/characters"));
    const baseUrl = computed(() => config.public?.SITE_URL || "");
    const canonicalUrl = computed(() => baseUrl.value ? new URL(canonicalPath.value, baseUrl.value).toString() : canonicalPath.value);
    const seoTitle = computed(() => t("seo.explore.characters.title"));
    const seoDescription = computed(() => t("seo.explore.characters.description"));
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
      openModule: "/characters",
      nextExplore: "/explore/scenes",
      related: {
        scenes: "/explore/scenes",
        timeline: "/explore/timeline"
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6 sm:space-y-10" }, _attrs))} data-v-5bb6e606><div class="card card-hover card-accent accent-earth overflow-hidden js-reveal" data-v-5bb6e606><div class="card-body" data-v-5bb6e606><div class="flex flex-col gap-4 sm:gap-5" data-v-5bb6e606><p class="badge badge-accent w-fit" data-v-5bb6e606>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:account-group-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.charactersPage.hero.badge"))}</p><h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline" data-v-5bb6e606>${ssrInterpolate(unref(t)("explore.charactersPage.hero.title"))}</h1><p class="text-subtle max-w-2xl" data-v-5bb6e606>${ssrInterpolate(unref(t)("explore.charactersPage.hero.lead"))}</p><div class="flex flex-wrap gap-2 pt-1" data-v-5bb6e606>`);
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
        to: unref(localePath)(linkMap.openModule),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:open-in-new",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.charactersPage.hero.ctaOpen"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:open-in-new",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.charactersPage.hero.ctaOpen")), 1)
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
      _push(`</div></div></div></div><div class="grid gap-4 lg:grid-cols-3" data-v-5bb6e606>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.openModule),
        class: "card-link focus-ring js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-forest bg-surface2 h-full" data-v-5bb6e606${_scopeId}><div class="card-body space-y-2" data-v-5bb6e606${_scopeId}><div class="badge badge-accent w-fit" data-v-5bb6e606${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:card-account-details-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.charactersPage.pillars.profile.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-5bb6e606${_scopeId}>${ssrInterpolate(unref(t)("explore.charactersPage.pillars.profile.title"))}</div><p class="text-sm text-muted" data-v-5bb6e606${_scopeId}>${ssrInterpolate(unref(t)("explore.charactersPage.pillars.profile.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-forest bg-surface2 h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:card-account-details-outline",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.charactersPage.pillars.profile.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.charactersPage.pillars.profile.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.charactersPage.pillars.profile.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.related.scenes),
        class: "card-link focus-ring js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-river bg-surface2 h-full" data-v-5bb6e606${_scopeId}><div class="card-body space-y-2" data-v-5bb6e606${_scopeId}><div class="badge badge-accent w-fit" data-v-5bb6e606${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:vector-link",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.charactersPage.pillars.relations.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-5bb6e606${_scopeId}>${ssrInterpolate(unref(t)("explore.charactersPage.pillars.relations.title"))}</div><p class="text-sm text-muted" data-v-5bb6e606${_scopeId}>${ssrInterpolate(unref(t)("explore.charactersPage.pillars.relations.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-river bg-surface2 h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:vector-link",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.charactersPage.pillars.relations.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.charactersPage.pillars.relations.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.charactersPage.pillars.relations.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.related.timeline),
        class: "card-link focus-ring js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-copper bg-surface2 h-full" data-v-5bb6e606${_scopeId}><div class="card-body space-y-2" data-v-5bb6e606${_scopeId}><div class="badge badge-accent w-fit" data-v-5bb6e606${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:timeline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.charactersPage.pillars.roles.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-5bb6e606${_scopeId}>${ssrInterpolate(unref(t)("explore.charactersPage.pillars.roles.title"))}</div><p class="text-sm text-muted" data-v-5bb6e606${_scopeId}>${ssrInterpolate(unref(t)("explore.charactersPage.pillars.roles.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-copper bg-surface2 h-full" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "badge badge-accent w-fit" }, [
                    createVNode(_component_Icon, {
                      name: "mdi:timeline",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("explore.charactersPage.pillars.roles.badge")), 1)
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.charactersPage.pillars.roles.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.charactersPage.pillars.roles.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="card js-reveal" data-v-5bb6e606><div class="card-body" data-v-5bb6e606><div class="flex items-center justify-between gap-3" data-v-5bb6e606><div data-v-5bb6e606><div class="font-extrabold text-lg title-gradient" data-v-5bb6e606>${ssrInterpolate(unref(t)("explore.charactersPage.outputs.title"))}</div><div class="text-sm text-muted" data-v-5bb6e606>${ssrInterpolate(unref(t)("explore.charactersPage.outputs.subtitle"))}</div></div><div class="badge" data-v-5bb6e606>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:checkbox-multiple-marked-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.charactersPage.outputs.badge"))}</div></div><div class="grid gap-3 sm:grid-cols-3 mt-4" data-v-5bb6e606><div class="card card-hover bg-surface2 card-accent accent-earth js-reveal" data-v-5bb6e606><div class="card-body space-y-2" data-v-5bb6e606><div class="badge badge-accent w-fit" data-v-5bb6e606>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:check-circle-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.charactersPage.outputs.one.badge"))}</div><div class="font-extrabold title-gradient" data-v-5bb6e606>${ssrInterpolate(unref(t)("explore.charactersPage.outputs.one.title"))}</div><p class="text-sm text-muted" data-v-5bb6e606>${ssrInterpolate(unref(t)("explore.charactersPage.outputs.one.desc"))}</p></div></div><div class="card card-hover bg-surface2 card-accent accent-river js-reveal" data-v-5bb6e606><div class="card-body space-y-2" data-v-5bb6e606><div class="badge badge-accent w-fit" data-v-5bb6e606>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:layers-triple",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.charactersPage.outputs.two.badge"))}</div><div class="font-extrabold title-gradient" data-v-5bb6e606>${ssrInterpolate(unref(t)("explore.charactersPage.outputs.two.title"))}</div><p class="text-sm text-muted" data-v-5bb6e606>${ssrInterpolate(unref(t)("explore.charactersPage.outputs.two.desc"))}</p></div></div><div class="card card-hover bg-surface2 card-accent accent-copper js-reveal" data-v-5bb6e606><div class="card-body space-y-2" data-v-5bb6e606><div class="badge badge-accent w-fit" data-v-5bb6e606>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:account-multiple-check-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.charactersPage.outputs.three.badge"))}</div><div class="font-extrabold title-gradient" data-v-5bb6e606>${ssrInterpolate(unref(t)("explore.charactersPage.outputs.three.title"))}</div><p class="text-sm text-muted" data-v-5bb6e606>${ssrInterpolate(unref(t)("explore.charactersPage.outputs.three.desc"))}</p></div></div></div></div></div><div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal" data-v-5bb6e606><div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-v-5bb6e606><div class="space-y-1" data-v-5bb6e606><div class="badge badge-accent w-fit" data-v-5bb6e606>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:movie-open",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.charactersPage.bottom.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-5bb6e606>${ssrInterpolate(unref(t)("explore.charactersPage.bottom.title"))}</div><p class="text-sm text-muted" data-v-5bb6e606>${ssrInterpolate(unref(t)("explore.charactersPage.bottom.desc"))}</p></div><div class="flex flex-wrap gap-2" data-v-5bb6e606>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.nextExplore),
        class: "btn btn-primary focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.charactersPage.bottom.ctaNext"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:arrow-right",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.charactersPage.bottom.ctaNext")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/explore/characters.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const characters = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5bb6e606"]]);

export { characters as default };
//# sourceMappingURL=characters-DodGGpYb.mjs.map
