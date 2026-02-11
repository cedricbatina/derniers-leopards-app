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
  __name: "scenes",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const config = useRuntimeConfig();
    const canonicalPath = computed(() => localePath("/explore/scenes"));
    const baseUrl = computed(() => config.public?.SITE_URL || "");
    const canonicalUrl = computed(() => baseUrl.value ? new URL(canonicalPath.value, baseUrl.value).toString() : canonicalPath.value);
    const seoTitle = computed(() => t("seo.explore.scenesPage.title"));
    const seoDescription = computed(() => t("seo.explore.scenesPage.description"));
    useSeoMeta({
      title: () => seoTitle.value,
      description: () => seoDescription.value,
      ogTitle: () => seoTitle.value,
      ogDescription: () => seoDescription.value,
      ogType: "website",
      ogUrl: () => canonicalUrl.value
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
        structure: "/scenes",
        // module scènes
        casting: "/characters",
        // module personnages
        versions: "/explore/timeline"
        // guide timeline (versions / révisions)
      },
      outputs: {
        one: "/scenes",
        two: "/characters",
        three: "/explore/workflow"
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6 sm:space-y-10" }, _attrs))} data-v-1efc6b73><div class="card card-hover card-accent accent-forest overflow-hidden js-reveal" data-v-1efc6b73><div class="card-body" data-v-1efc6b73><div class="flex flex-col gap-4 sm:gap-5" data-v-1efc6b73><p class="badge badge-accent w-fit" data-v-1efc6b73>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:movie-open",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.scenesPage.hero.badge"))}</p><h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline" data-v-1efc6b73>${ssrInterpolate(unref(t)("explore.scenesPage.hero.title"))}</h1><p class="text-subtle max-w-2xl" data-v-1efc6b73>${ssrInterpolate(unref(t)("explore.scenesPage.hero.lead"))}</p><div class="flex flex-wrap gap-2 pt-1" data-v-1efc6b73>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/scenes"),
        class: "btn btn-primary focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:script-text-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.scenesPage.hero.ctaOpen"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:script-text-outline",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.scenesPage.hero.ctaOpen")), 1)
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
        to: unref(localePath)("/explore/timeline"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.scenesPage.hero.ctaNext"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:arrow-right",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.scenesPage.hero.ctaNext")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div><div class="grid gap-4 lg:grid-cols-3" data-v-1efc6b73>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.pillars.structure),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-river bg-surface2" data-v-1efc6b73${_scopeId}><div class="card-body space-y-2" data-v-1efc6b73${_scopeId}><div class="flex items-start justify-between gap-3" data-v-1efc6b73${_scopeId}><div class="badge badge-accent w-fit" data-v-1efc6b73${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:clipboard-text-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.scenesPage.pillars.structure.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold text-lg title-gradient" data-v-1efc6b73${_scopeId}>${ssrInterpolate(unref(t)("explore.scenesPage.pillars.structure.title"))}</div><p class="text-sm text-muted" data-v-1efc6b73${_scopeId}>${ssrInterpolate(unref(t)("explore.scenesPage.pillars.structure.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-river bg-surface2" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:clipboard-text-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.scenesPage.pillars.structure.badge")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.scenesPage.pillars.structure.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.scenesPage.pillars.structure.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.pillars.casting),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-earth bg-surface2" data-v-1efc6b73${_scopeId}><div class="card-body space-y-2" data-v-1efc6b73${_scopeId}><div class="flex items-start justify-between gap-3" data-v-1efc6b73${_scopeId}><div class="badge badge-accent w-fit" data-v-1efc6b73${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:account-multiple-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.scenesPage.pillars.casting.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold text-lg title-gradient" data-v-1efc6b73${_scopeId}>${ssrInterpolate(unref(t)("explore.scenesPage.pillars.casting.title"))}</div><p class="text-sm text-muted" data-v-1efc6b73${_scopeId}>${ssrInterpolate(unref(t)("explore.scenesPage.pillars.casting.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-earth bg-surface2" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:account-multiple-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.scenesPage.pillars.casting.badge")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.scenesPage.pillars.casting.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.scenesPage.pillars.casting.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.pillars.versions),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-copper bg-surface2" data-v-1efc6b73${_scopeId}><div class="card-body space-y-2" data-v-1efc6b73${_scopeId}><div class="flex items-start justify-between gap-3" data-v-1efc6b73${_scopeId}><div class="badge badge-accent w-fit" data-v-1efc6b73${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:source-branch",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.scenesPage.pillars.versions.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold text-lg title-gradient" data-v-1efc6b73${_scopeId}>${ssrInterpolate(unref(t)("explore.scenesPage.pillars.versions.title"))}</div><p class="text-sm text-muted" data-v-1efc6b73${_scopeId}>${ssrInterpolate(unref(t)("explore.scenesPage.pillars.versions.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-copper bg-surface2" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:source-branch",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.scenesPage.pillars.versions.badge")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.scenesPage.pillars.versions.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.scenesPage.pillars.versions.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="card js-reveal" data-v-1efc6b73><div class="card-body" data-v-1efc6b73><div class="flex items-center justify-between gap-3" data-v-1efc6b73><div data-v-1efc6b73><div class="font-extrabold text-lg title-gradient" data-v-1efc6b73>${ssrInterpolate(unref(t)("explore.scenesPage.outputs.title"))}</div><div class="text-sm text-muted" data-v-1efc6b73>${ssrInterpolate(unref(t)("explore.scenesPage.outputs.subtitle"))}</div></div><div class="badge" data-v-1efc6b73>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:checkbox-multiple-marked-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.scenesPage.outputs.badge"))}</div></div><div class="grid gap-3 sm:grid-cols-3 mt-4" data-v-1efc6b73>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.outputs.one),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-earth" data-v-1efc6b73${_scopeId}><div class="card-body space-y-2" data-v-1efc6b73${_scopeId}><div class="flex items-start justify-between gap-3" data-v-1efc6b73${_scopeId}><div class="badge badge-accent w-fit" data-v-1efc6b73${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:eye-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.scenesPage.outputs.one.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold title-gradient" data-v-1efc6b73${_scopeId}>${ssrInterpolate(unref(t)("explore.scenesPage.outputs.one.title"))}</div><p class="text-sm text-muted" data-v-1efc6b73${_scopeId}>${ssrInterpolate(unref(t)("explore.scenesPage.outputs.one.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-earth" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:eye-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.scenesPage.outputs.one.badge")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("explore.scenesPage.outputs.one.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.scenesPage.outputs.one.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.outputs.two),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-river" data-v-1efc6b73${_scopeId}><div class="card-body space-y-2" data-v-1efc6b73${_scopeId}><div class="flex items-start justify-between gap-3" data-v-1efc6b73${_scopeId}><div class="badge badge-accent w-fit" data-v-1efc6b73${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:link-variant",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.scenesPage.outputs.two.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold title-gradient" data-v-1efc6b73${_scopeId}>${ssrInterpolate(unref(t)("explore.scenesPage.outputs.two.title"))}</div><p class="text-sm text-muted" data-v-1efc6b73${_scopeId}>${ssrInterpolate(unref(t)("explore.scenesPage.outputs.two.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-river" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:link-variant",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.scenesPage.outputs.two.badge")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("explore.scenesPage.outputs.two.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.scenesPage.outputs.two.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)(linkMap.outputs.three),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-copper" data-v-1efc6b73${_scopeId}><div class="card-body space-y-2" data-v-1efc6b73${_scopeId}><div class="flex items-start justify-between gap-3" data-v-1efc6b73${_scopeId}><div class="badge badge-accent w-fit" data-v-1efc6b73${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:export-variant",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.scenesPage.outputs.three.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold title-gradient" data-v-1efc6b73${_scopeId}>${ssrInterpolate(unref(t)("explore.scenesPage.outputs.three.title"))}</div><p class="text-sm text-muted" data-v-1efc6b73${_scopeId}>${ssrInterpolate(unref(t)("explore.scenesPage.outputs.three.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-copper" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:export-variant",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.scenesPage.outputs.three.badge")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("explore.scenesPage.outputs.three.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.scenesPage.outputs.three.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal" data-v-1efc6b73><div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-v-1efc6b73><div class="space-y-1" data-v-1efc6b73><div class="badge badge-accent w-fit" data-v-1efc6b73>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:timeline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.scenesPage.bottom.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-1efc6b73>${ssrInterpolate(unref(t)("explore.scenesPage.bottom.title"))}</div><p class="text-sm text-muted" data-v-1efc6b73>${ssrInterpolate(unref(t)("explore.scenesPage.bottom.desc"))}</p></div><div class="flex flex-wrap gap-2" data-v-1efc6b73>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/timeline"),
        class: "btn btn-primary focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.scenesPage.bottom.ctaNext"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:arrow-right",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.scenesPage.bottom.ctaNext")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/explore/scenes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const scenes = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1efc6b73"]]);

export { scenes as default };
//# sourceMappingURL=scenes-ClQf6w5i.mjs.map
