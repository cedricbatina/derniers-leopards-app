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
  __name: "workflow",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const config = useRuntimeConfig();
    const canonicalPath = computed(() => localePath("/explore/workflow"));
    const baseUrl = computed(() => config.public?.SITE_URL || "");
    const canonicalUrl = computed(() => baseUrl.value ? new URL(canonicalPath.value, baseUrl.value).toString() : canonicalPath.value);
    const seoTitle = computed(() => t("seo.explore.workflow.title"));
    const seoDescription = computed(() => t("seo.explore.workflow.description"));
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
    const stepLinks = {
      one: "/studio/projects",
      two: "/explore/structuring",
      three: "/explore/access"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6 sm:space-y-10" }, _attrs))} data-v-89fc1ed2><div class="card card-hover card-accent accent-forest overflow-hidden js-reveal" data-v-89fc1ed2><div class="card-body" data-v-89fc1ed2><div class="flex flex-col gap-4 sm:gap-5" data-v-89fc1ed2><p class="badge badge-accent w-fit" data-v-89fc1ed2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:rocket-launch-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.workflow.badge"))}</p><h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline" data-v-89fc1ed2>${ssrInterpolate(unref(t)("explore.workflow.title"))}</h1><p class="text-subtle max-w-2xl" data-v-89fc1ed2>${ssrInterpolate(unref(t)("explore.workflow.lead"))}</p><div class="flex flex-wrap gap-2 pt-1" data-v-89fc1ed2>`);
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
        to: unref(localePath)("/"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:home-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.common.home"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:home-outline",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.common.home")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex flex-wrap gap-2 pt-2" data-v-89fc1ed2><a class="pill" href="#step-1" data-v-89fc1ed2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:numeric-1-circle-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.workflow.quickNav.step1"))}</a><a class="pill" href="#step-2" data-v-89fc1ed2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:numeric-2-circle-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.workflow.quickNav.step2"))}</a><a class="pill" href="#step-3" data-v-89fc1ed2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:numeric-3-circle-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.workflow.quickNav.step3"))}</a></div></div></div></div><div class="grid gap-4 lg:grid-cols-3" data-v-89fc1ed2><div id="step-1" class="js-reveal" data-v-89fc1ed2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(stepLinks.one),
        class: "card-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-earth" data-v-89fc1ed2${_scopeId}><div class="card-body space-y-3" data-v-89fc1ed2${_scopeId}><div class="flex items-start justify-between gap-3" data-v-89fc1ed2${_scopeId}><div class="badge badge-accent w-fit" data-v-89fc1ed2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:folder-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.workflow.steps.one.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div data-v-89fc1ed2${_scopeId}><div class="text-xs text-muted" data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.one.kicker"))}</div><div class="font-extrabold text-lg title-gradient" data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.one.title"))}</div></div><p class="text-sm text-muted" data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.one.desc"))}</p><div class="divider" data-v-89fc1ed2${_scopeId}></div><div class="space-y-1" data-v-89fc1ed2${_scopeId}><div class="text-xs text-muted" data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.one.sectionTitle"))}</div><ul class="text-sm text-muted list-disc pl-5 space-y-1" data-v-89fc1ed2${_scopeId}><li data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.one.bullets.0"))}</li><li data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.one.bullets.1"))}</li><li data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.one.bullets.2"))}</li></ul></div><div class="pt-2" data-v-89fc1ed2${_scopeId}><span class="btn btn-ghost focus-ring" data-v-89fc1ed2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:view-dashboard-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.workflow.steps.one.cta"))}</span></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-earth" }, [
                createVNode("div", { class: "card-body space-y-3" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:folder-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.workflow.steps.one.badge")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", null, [
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("explore.workflow.steps.one.kicker")), 1),
                    createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.workflow.steps.one.title")), 1)
                  ]),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.workflow.steps.one.desc")), 1),
                  createVNode("div", { class: "divider" }),
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("explore.workflow.steps.one.sectionTitle")), 1),
                    createVNode("ul", { class: "text-sm text-muted list-disc pl-5 space-y-1" }, [
                      createVNode("li", null, toDisplayString(unref(t)("explore.workflow.steps.one.bullets.0")), 1),
                      createVNode("li", null, toDisplayString(unref(t)("explore.workflow.steps.one.bullets.1")), 1),
                      createVNode("li", null, toDisplayString(unref(t)("explore.workflow.steps.one.bullets.2")), 1)
                    ])
                  ]),
                  createVNode("div", { class: "pt-2" }, [
                    createVNode("span", { class: "btn btn-ghost focus-ring" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:view-dashboard-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.workflow.steps.one.cta")), 1)
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div id="step-2" class="js-reveal" data-v-89fc1ed2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(stepLinks.two),
        class: "card-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-river" data-v-89fc1ed2${_scopeId}><div class="card-body space-y-3" data-v-89fc1ed2${_scopeId}><div class="flex items-start justify-between gap-3" data-v-89fc1ed2${_scopeId}><div class="badge badge-accent w-fit" data-v-89fc1ed2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:layers-triple",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.workflow.steps.two.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div data-v-89fc1ed2${_scopeId}><div class="text-xs text-muted" data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.two.kicker"))}</div><div class="font-extrabold text-lg title-gradient" data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.two.title"))}</div></div><p class="text-sm text-muted" data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.two.desc"))}</p><div class="divider" data-v-89fc1ed2${_scopeId}></div><div class="space-y-1" data-v-89fc1ed2${_scopeId}><div class="text-xs text-muted" data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.two.sectionTitle"))}</div><ul class="text-sm text-muted list-disc pl-5 space-y-1" data-v-89fc1ed2${_scopeId}><li data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.two.bullets.0"))}</li><li data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.two.bullets.1"))}</li><li data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.two.bullets.2"))}</li></ul></div><div class="pt-2 flex flex-wrap gap-2" data-v-89fc1ed2${_scopeId}><span class="btn btn-ghost focus-ring" data-v-89fc1ed2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:layers-triple",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.common.structuring"))}</span><span class="btn btn-ghost focus-ring" data-v-89fc1ed2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:timeline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.common.timeline"))}</span></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-river" }, [
                createVNode("div", { class: "card-body space-y-3" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:layers-triple",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.workflow.steps.two.badge")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", null, [
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("explore.workflow.steps.two.kicker")), 1),
                    createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.workflow.steps.two.title")), 1)
                  ]),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.workflow.steps.two.desc")), 1),
                  createVNode("div", { class: "divider" }),
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("explore.workflow.steps.two.sectionTitle")), 1),
                    createVNode("ul", { class: "text-sm text-muted list-disc pl-5 space-y-1" }, [
                      createVNode("li", null, toDisplayString(unref(t)("explore.workflow.steps.two.bullets.0")), 1),
                      createVNode("li", null, toDisplayString(unref(t)("explore.workflow.steps.two.bullets.1")), 1),
                      createVNode("li", null, toDisplayString(unref(t)("explore.workflow.steps.two.bullets.2")), 1)
                    ])
                  ]),
                  createVNode("div", { class: "pt-2 flex flex-wrap gap-2" }, [
                    createVNode("span", { class: "btn btn-ghost focus-ring" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:layers-triple",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.common.structuring")), 1)
                    ]),
                    createVNode("span", { class: "btn btn-ghost focus-ring" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:timeline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.common.timeline")), 1)
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div id="step-3" class="js-reveal" data-v-89fc1ed2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(stepLinks.three),
        class: "card-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-copper" data-v-89fc1ed2${_scopeId}><div class="card-body space-y-3" data-v-89fc1ed2${_scopeId}><div class="flex items-start justify-between gap-3" data-v-89fc1ed2${_scopeId}><div class="badge badge-accent w-fit" data-v-89fc1ed2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:export-variant",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.workflow.steps.three.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div data-v-89fc1ed2${_scopeId}><div class="text-xs text-muted" data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.three.kicker"))}</div><div class="font-extrabold text-lg title-gradient" data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.three.title"))}</div></div><p class="text-sm text-muted" data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.three.desc"))}</p><div class="divider" data-v-89fc1ed2${_scopeId}></div><div class="space-y-1" data-v-89fc1ed2${_scopeId}><div class="text-xs text-muted" data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.three.sectionTitle"))}</div><ul class="text-sm text-muted list-disc pl-5 space-y-1" data-v-89fc1ed2${_scopeId}><li data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.three.bullets.0"))}</li><li data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.three.bullets.1"))}</li><li data-v-89fc1ed2${_scopeId}>${ssrInterpolate(unref(t)("explore.workflow.steps.three.bullets.2"))}</li></ul></div><div class="pt-2 flex flex-wrap gap-2" data-v-89fc1ed2${_scopeId}><span class="btn btn-ghost focus-ring" data-v-89fc1ed2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:shield-lock-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.common.accessRoles"))}</span><span class="btn btn-ghost focus-ring" data-v-89fc1ed2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:movie-open",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.common.studios"))}</span></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-copper" }, [
                createVNode("div", { class: "card-body space-y-3" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:export-variant",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.workflow.steps.three.badge")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", null, [
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("explore.workflow.steps.three.kicker")), 1),
                    createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.workflow.steps.three.title")), 1)
                  ]),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.workflow.steps.three.desc")), 1),
                  createVNode("div", { class: "divider" }),
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("explore.workflow.steps.three.sectionTitle")), 1),
                    createVNode("ul", { class: "text-sm text-muted list-disc pl-5 space-y-1" }, [
                      createVNode("li", null, toDisplayString(unref(t)("explore.workflow.steps.three.bullets.0")), 1),
                      createVNode("li", null, toDisplayString(unref(t)("explore.workflow.steps.three.bullets.1")), 1),
                      createVNode("li", null, toDisplayString(unref(t)("explore.workflow.steps.three.bullets.2")), 1)
                    ])
                  ]),
                  createVNode("div", { class: "pt-2 flex flex-wrap gap-2" }, [
                    createVNode("span", { class: "btn btn-ghost focus-ring" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:shield-lock-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.common.accessRoles")), 1)
                    ]),
                    createVNode("span", { class: "btn btn-ghost focus-ring" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:movie-open",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.common.studios")), 1)
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal" data-v-89fc1ed2><div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-v-89fc1ed2><div class="space-y-1" data-v-89fc1ed2><div class="badge badge-accent w-fit" data-v-89fc1ed2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:flash-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.workflow.bottom.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-89fc1ed2>${ssrInterpolate(unref(t)("explore.workflow.bottom.title"))}</div><p class="text-sm text-muted" data-v-89fc1ed2>${ssrInterpolate(unref(t)("explore.workflow.bottom.desc"))}</p></div><div class="flex flex-wrap gap-2" data-v-89fc1ed2>`);
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
        to: unref(localePath)("/explore"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("explore.common.backGuide"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("explore.common.backGuide")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/explore/workflow.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const workflow = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-89fc1ed2"]]);

export { workflow as default };
//# sourceMappingURL=workflow-C0R5NNr2.mjs.map
