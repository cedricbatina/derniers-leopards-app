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
  __name: "structuring",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const config = useRuntimeConfig();
    const canonicalPath = computed(() => localePath("/explore/structuring"));
    const baseUrl = config.public?.SITE_URL || "";
    const canonicalUrl = computed(() => baseUrl ? new URL(canonicalPath.value, baseUrl).toString() : canonicalPath.value);
    useSeoMeta({
      title: () => t("seo.explore.structuring.title"),
      description: () => t("seo.explore.structuring.description"),
      ogTitle: () => t("seo.explore.structuring.title"),
      ogDescription: () => t("seo.explore.structuring.description"),
      ogType: "website",
      ogUrl: canonicalUrl
    });
    useHead({
      link: [{ rel: "canonical", href: canonicalUrl.value }]
    });
    const jsonLd = computed(() => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: t("seo.explore.structuring.title"),
      description: t("seo.explore.structuring.description"),
      inLanguage: locale.value,
      url: baseUrl || canonicalUrl.value
    }));
    useHead({
      script: [{ type: "application/ld+json", children: JSON.stringify(jsonLd.value) }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6 sm:space-y-10" }, _attrs))} data-v-40551cd2><div class="card card-hover card-accent accent-earth overflow-hidden js-reveal" data-v-40551cd2><div class="card-body" data-v-40551cd2><div class="flex flex-col gap-4 sm:gap-5" data-v-40551cd2><p class="badge badge-accent w-fit" data-v-40551cd2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:layers-triple",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.structuring.hero.badge"))}</p><h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.hero.title"))}</h1><p class="text-subtle max-w-2xl" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.hero.lead"))}</p><div class="flex flex-wrap gap-2 pt-1" data-v-40551cd2>`);
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
            _push2(` ${ssrInterpolate(unref(t)("explore.structuring.hero.ctaWorkflow"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:rocket-launch-outline",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.structuring.hero.ctaWorkflow")), 1)
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
      _push(`</div></div></div></div><div class="grid gap-4 lg:grid-cols-3" data-v-40551cd2><div class="card card-hover card-accent accent-river js-reveal" data-v-40551cd2><div class="card-body space-y-2" data-v-40551cd2><div class="badge badge-accent w-fit" data-v-40551cd2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:book-open-page-variant-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.structuring.pillars.project.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.pillars.project.title"))}</div><p class="text-sm text-muted" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.pillars.project.desc"))}</p></div></div><div class="card card-hover card-accent accent-forest js-reveal" data-v-40551cd2><div class="card-body space-y-2" data-v-40551cd2><div class="badge badge-accent w-fit" data-v-40551cd2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:shape-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.structuring.pillars.entities.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.pillars.entities.title"))}</div><p class="text-sm text-muted" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.pillars.entities.desc"))}</p></div></div><div class="card card-hover card-accent accent-copper js-reveal" data-v-40551cd2><div class="card-body space-y-2" data-v-40551cd2><div class="badge badge-accent w-fit" data-v-40551cd2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:vector-link",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.structuring.pillars.links.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.pillars.links.title"))}</div><p class="text-sm text-muted" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.pillars.links.desc"))}</p></div></div></div><div class="card card-hover card-accent accent-earth js-reveal" data-v-40551cd2><div class="card-body" data-v-40551cd2><div class="flex items-center justify-between gap-3" data-v-40551cd2><div data-v-40551cd2><div class="font-extrabold text-lg title-gradient" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.outputs.title"))}</div><div class="text-sm text-muted" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.outputs.subtitle"))}</div></div><div class="badge" data-v-40551cd2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:checkbox-multiple-marked-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.structuring.outputs.badge"))}</div></div><div class="grid gap-3 sm:grid-cols-3 mt-4" data-v-40551cd2><div class="card card-hover bg-surface2 card-accent accent-earth js-reveal" data-v-40551cd2><div class="card-body space-y-2" data-v-40551cd2><div class="flex items-start justify-between gap-3" data-v-40551cd2><div class="badge badge-accent w-fit" data-v-40551cd2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:check-decagram-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.structuring.outputs.one.kicker"))}</div>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:arrow-right",
        class: "text-xl opacity-60",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</div><div class="font-extrabold title-gradient" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.outputs.one.title"))}</div><p class="text-sm text-muted" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.outputs.one.desc"))}</p></div></div><div class="card card-hover bg-surface2 card-accent accent-river js-reveal" data-v-40551cd2><div class="card-body space-y-2" data-v-40551cd2><div class="flex items-start justify-between gap-3" data-v-40551cd2><div class="badge badge-accent w-fit" data-v-40551cd2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:cached",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.structuring.outputs.two.kicker"))}</div>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:arrow-right",
        class: "text-xl opacity-60",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</div><div class="font-extrabold title-gradient" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.outputs.two.title"))}</div><p class="text-sm text-muted" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.outputs.two.desc"))}</p></div></div><div class="card card-hover bg-surface2 card-accent accent-copper js-reveal" data-v-40551cd2><div class="card-body space-y-2" data-v-40551cd2><div class="flex items-start justify-between gap-3" data-v-40551cd2><div class="badge badge-accent w-fit" data-v-40551cd2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:account-group-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.structuring.outputs.three.kicker"))}</div>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:arrow-right",
        class: "text-xl opacity-60",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</div><div class="font-extrabold title-gradient" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.outputs.three.title"))}</div><p class="text-sm text-muted" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.outputs.three.desc"))}</p></div></div></div></div></div><div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal" data-v-40551cd2><div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-v-40551cd2><div class="space-y-1" data-v-40551cd2><div class="badge badge-accent w-fit" data-v-40551cd2>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:timeline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("explore.structuring.bottom.badge"))}</div><div class="font-extrabold text-lg title-gradient" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.bottom.title"))}</div><p class="text-sm text-muted" data-v-40551cd2>${ssrInterpolate(unref(t)("explore.structuring.bottom.desc"))}</p></div><div class="flex flex-wrap gap-2" data-v-40551cd2>`);
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
            _push2(` ${ssrInterpolate(unref(t)("explore.structuring.bottom.ctaTimeline"))}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:arrow-right",
                "aria-hidden": "true"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("explore.structuring.bottom.ctaTimeline")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/explore/structuring.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const structuring = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-40551cd2"]]);

export { structuring as default };
//# sourceMappingURL=structuring-CrGGx8vt.mjs.map
