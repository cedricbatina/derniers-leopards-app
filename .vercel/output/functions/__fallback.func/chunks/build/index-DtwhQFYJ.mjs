import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { a as useI18n, b as useLocalePath, e as useSeoMeta } from './server.mjs';
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
    const { t } = useI18n();
    const localePath = useLocalePath();
    useSeoMeta({
      title: () => t("seo.explore.index.title"),
      description: () => t("seo.explore.index.description"),
      ogTitle: () => t("seo.explore.index.title"),
      ogDescription: () => t("seo.explore.index.description"),
      ogType: "website"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6 sm:space-y-10" }, _attrs))} data-v-9e613e56><div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal" data-v-9e613e56><div class="card-body" data-v-9e613e56><div class="flex flex-col gap-4 sm:gap-5" data-v-9e613e56><p class="badge badge-accent w-fit" data-v-9e613e56>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:compass-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.index.hero.badge"))}</p><h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline" data-v-9e613e56>${ssrInterpolate(unref(t)("explore.index.hero.title"))}</h1><p class="text-subtle max-w-2xl" data-v-9e613e56>${ssrInterpolate(unref(t)("explore.index.hero.lead"))}</p><div class="flex flex-wrap gap-2 pt-1" data-v-9e613e56>`);
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
        to: unref(localePath)("/"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:home-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.common.backHome"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:home-outline",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.common.backHome")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div><div class="card js-reveal" data-v-9e613e56><div class="card-body" data-v-9e613e56><div class="flex items-center justify-between gap-3" data-v-9e613e56><div class="space-y-1" data-v-9e613e56><div class="font-extrabold title-gradient" data-v-9e613e56>${ssrInterpolate(unref(t)("explore.index.forWho.title"))}</div><div class="text-sm text-muted" data-v-9e613e56>${ssrInterpolate(unref(t)("explore.index.forWho.subtitle"))}</div></div><div class="badge" data-v-9e613e56>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:account-group-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.index.forWho.badge"))}</div></div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4" data-v-9e613e56>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/writing"),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-earth" data-v-9e613e56${_scopeId}><div class="card-body space-y-2" data-v-9e613e56${_scopeId}><div class="flex items-start justify-between gap-3" data-v-9e613e56${_scopeId}><div class="badge badge-accent w-fit" data-v-9e613e56${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:pencil-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.index.cards.writing.title"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="text-sm text-muted" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.cards.writing.desc"))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-earth" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:pencil-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.index.cards.writing.title")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.index.cards.writing.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/editors"),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-forest" data-v-9e613e56${_scopeId}><div class="card-body space-y-2" data-v-9e613e56${_scopeId}><div class="flex items-start justify-between gap-3" data-v-9e613e56${_scopeId}><div class="badge badge-accent w-fit" data-v-9e613e56${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:clipboard-check-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.index.cards.editors.title"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="text-sm text-muted" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.cards.editors.desc"))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-forest" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:clipboard-check-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.index.cards.editors.title")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.index.cards.editors.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/studio"),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-river" data-v-9e613e56${_scopeId}><div class="card-body space-y-2" data-v-9e613e56${_scopeId}><div class="flex items-start justify-between gap-3" data-v-9e613e56${_scopeId}><div class="badge badge-accent w-fit" data-v-9e613e56${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:movie-open",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.index.cards.studios.title"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="text-sm text-muted" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.cards.studios.desc"))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-river" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:movie-open",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.index.cards.studios.title")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.index.cards.studios.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/creators"),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-copper" data-v-9e613e56${_scopeId}><div class="card-body space-y-2" data-v-9e613e56${_scopeId}><div class="flex items-start justify-between gap-3" data-v-9e613e56${_scopeId}><div class="badge badge-accent w-fit" data-v-9e613e56${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:palette-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.index.cards.creators.title"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="text-sm text-muted" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.cards.creators.desc"))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-copper" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:palette-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.index.cards.creators.title")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.index.cards.creators.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-v-9e613e56>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/structuring"),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-earth" data-v-9e613e56${_scopeId}><div class="card-body space-y-2" data-v-9e613e56${_scopeId}><div class="flex items-start justify-between gap-3" data-v-9e613e56${_scopeId}><div class="badge badge-accent w-fit" data-v-9e613e56${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:layers-triple",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.index.features.structuring.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold title-gradient" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.features.structuring.title"))}</div><p class="text-sm text-muted" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.features.structuring.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-earth" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:layers-triple",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.index.features.structuring.badge")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("explore.index.features.structuring.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.index.features.structuring.desc")), 1)
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
            _push2(`<div class="card card-hover card-accent accent-river" data-v-9e613e56${_scopeId}><div class="card-body space-y-2" data-v-9e613e56${_scopeId}><div class="flex items-start justify-between gap-3" data-v-9e613e56${_scopeId}><div class="badge badge-accent w-fit" data-v-9e613e56${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:timeline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.index.features.timeline.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold title-gradient" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.features.timeline.title"))}</div><p class="text-sm text-muted" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.features.timeline.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-river" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:timeline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.index.features.timeline.badge")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("explore.index.features.timeline.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.index.features.timeline.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/access"),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-copper" data-v-9e613e56${_scopeId}><div class="card-body space-y-2" data-v-9e613e56${_scopeId}><div class="flex items-start justify-between gap-3" data-v-9e613e56${_scopeId}><div class="badge badge-accent w-fit" data-v-9e613e56${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:shield-lock-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.index.features.access.badge"))}</div>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              class: "text-xl opacity-60",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="font-extrabold title-gradient" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.features.access.title"))}</div><p class="text-sm text-muted" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.features.access.desc"))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-copper" }, [
                createVNode("div", { class: "card-body space-y-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:shield-lock-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.index.features.access.badge")), 1)
                    ]),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      class: "text-xl opacity-60",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("div", { class: "font-extrabold title-gradient" }, toDisplayString(unref(t)("explore.index.features.access.title")), 1),
                  createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.index.features.access.desc")), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="card js-reveal" data-v-9e613e56><div class="card-body" data-v-9e613e56><div class="flex items-center justify-between gap-3" data-v-9e613e56><div class="space-y-1" data-v-9e613e56><div class="font-extrabold title-gradient" data-v-9e613e56>${ssrInterpolate(unref(t)("explore.index.modules.title"))}</div><div class="text-sm text-muted" data-v-9e613e56>${ssrInterpolate(unref(t)("explore.index.modules.subtitle"))}</div></div><div class="badge" data-v-9e613e56>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:apps",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.index.modules.badge"))}</div></div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4" data-v-9e613e56>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/characters"),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-earth" data-v-9e613e56${_scopeId}><div class="card-body space-y-2" data-v-9e613e56${_scopeId}><div class="flex items-start justify-between gap-3" data-v-9e613e56${_scopeId}><div class="badge badge-accent w-fit" data-v-9e613e56${_scopeId}>`);
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
            _push2(`</div><div class="text-sm text-muted" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.modules.cards.characters.desc"))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-earth" }, [
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
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-forest" data-v-9e613e56${_scopeId}><div class="card-body space-y-2" data-v-9e613e56${_scopeId}><div class="flex items-start justify-between gap-3" data-v-9e613e56${_scopeId}><div class="badge badge-accent w-fit" data-v-9e613e56${_scopeId}>`);
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
            _push2(`</div><div class="text-sm text-muted" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.modules.cards.scenes.desc"))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-forest" }, [
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
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-river" data-v-9e613e56${_scopeId}><div class="card-body space-y-2" data-v-9e613e56${_scopeId}><div class="flex items-start justify-between gap-3" data-v-9e613e56${_scopeId}><div class="badge badge-accent w-fit" data-v-9e613e56${_scopeId}>`);
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
            _push2(`</div><div class="text-sm text-muted" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.modules.cards.timeline.desc"))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-river" }, [
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
            _push2(`<div class="card card-hover bg-surface2 card-accent accent-copper" data-v-9e613e56${_scopeId}><div class="card-body space-y-2" data-v-9e613e56${_scopeId}><div class="flex items-start justify-between gap-3" data-v-9e613e56${_scopeId}><div class="badge badge-accent w-fit" data-v-9e613e56${_scopeId}>`);
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
            _push2(`</div><div class="text-sm text-muted" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.modules.cards.glossary.desc"))}</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover bg-surface2 card-accent accent-copper" }, [
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
      _push(`</div></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/explore/workflow"),
        class: "card-link js-reveal"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card card-hover card-accent accent-forest overflow-hidden" data-v-9e613e56${_scopeId}><div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-v-9e613e56${_scopeId}><div class="space-y-1" data-v-9e613e56${_scopeId}><div class="badge badge-accent w-fit" data-v-9e613e56${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:rocket-launch-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("explore.index.workflow.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.workflow.title"))}</div><p class="text-sm text-muted" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.workflow.desc"))}</p></div><div class="btn btn-ghost" data-v-9e613e56${_scopeId}>${ssrInterpolate(unref(t)("explore.index.workflow.cta"))} `);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-right",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card card-hover card-accent accent-forest overflow-hidden" }, [
                createVNode("div", { class: "card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" }, [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode("div", { class: "badge badge-accent w-fit" }, [
                      createVNode(_component_Icon, {
                        name: "mdi:rocket-launch-outline",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("explore.index.workflow.badge")), 1)
                    ]),
                    createVNode("div", { class: "font-extrabold text-lg title-gradient" }, toDisplayString(unref(t)("explore.index.workflow.title")), 1),
                    createVNode("p", { class: "text-sm text-muted" }, toDisplayString(unref(t)("explore.index.workflow.desc")), 1)
                  ]),
                  createVNode("div", { class: "btn btn-ghost" }, [
                    createTextVNode(toDisplayString(unref(t)("explore.index.workflow.cta")) + " ", 1),
                    createVNode(_component_Icon, {
                      name: "mdi:arrow-right",
                      "aria-hidden": "true"
                    })
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/explore/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9e613e56"]]);

export { index as default };
//# sourceMappingURL=index-DtwhQFYJ.mjs.map
