import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a as useI18n, b as useLocalePath, c as useAuthStore } from './server.mjs';
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
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const auth = useAuthStore();
    const isAuthed = computed(() => !!auth.user?.id);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6 sm:space-y-10" }, _attrs))}><div class="card overflow-hidden"><div class="card-body"><div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div class="space-y-3"><p class="badge">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:creation",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("landing.hero.kicker"))}</p><h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">${ssrInterpolate(unref(t)("landing.hero.title"))}</h1><p class="text-muted max-w-2xl">${ssrInterpolate(unref(t)("landing.hero.subtitle"))}</p><div class="flex flex-wrap gap-2 pt-2">`);
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
          to: unref(localePath)("/workspace"),
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
      _push(`</div></div><div class="grid grid-cols-2 gap-3 w-full sm:w-96"><div class="card bg-surface2"><div class="card-body"><div class="text-xs text-muted">${ssrInterpolate(unref(t)("landing.tiles.authors.label"))}</div><div class="text-lg font-extrabold">${ssrInterpolate(unref(t)("landing.tiles.authors.title"))}</div><div class="text-xs text-muted mt-1">${ssrInterpolate(unref(t)("landing.tiles.authors.desc"))}</div></div></div><div class="card bg-surface2"><div class="card-body"><div class="text-xs text-muted">${ssrInterpolate(unref(t)("landing.tiles.editors.label"))}</div><div class="text-lg font-extrabold">${ssrInterpolate(unref(t)("landing.tiles.editors.title"))}</div><div class="text-xs text-muted mt-1">${ssrInterpolate(unref(t)("landing.tiles.editors.desc"))}</div></div></div><div class="card bg-surface2"><div class="card-body"><div class="text-xs text-muted">${ssrInterpolate(unref(t)("landing.tiles.studios.label"))}</div><div class="text-lg font-extrabold">${ssrInterpolate(unref(t)("landing.tiles.studios.title"))}</div><div class="text-xs text-muted mt-1">${ssrInterpolate(unref(t)("landing.tiles.studios.desc"))}</div></div></div><div class="card bg-surface2"><div class="card-body"><div class="text-xs text-muted">${ssrInterpolate(unref(t)("landing.tiles.creators.label"))}</div><div class="text-lg font-extrabold">${ssrInterpolate(unref(t)("landing.tiles.creators.title"))}</div><div class="text-xs text-muted mt-1">${ssrInterpolate(unref(t)("landing.tiles.creators.desc"))}</div></div></div></div></div></div></div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><div class="card"><div class="card-body space-y-2"><div class="badge">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:layers-triple",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("landing.value.one.badge"))}</div><div class="font-extrabold text-lg">${ssrInterpolate(unref(t)("landing.value.one.title"))}</div><p class="text-sm text-muted">${ssrInterpolate(unref(t)("landing.value.one.desc"))}</p></div></div><div class="card"><div class="card-body space-y-2"><div class="badge">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:timeline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("landing.value.two.badge"))}</div><div class="font-extrabold text-lg">${ssrInterpolate(unref(t)("landing.value.two.title"))}</div><p class="text-sm text-muted">${ssrInterpolate(unref(t)("landing.value.two.desc"))}</p></div></div><div class="card"><div class="card-body space-y-2"><div class="badge">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:shield-lock-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("landing.value.three.badge"))}</div><div class="font-extrabold text-lg">${ssrInterpolate(unref(t)("landing.value.three.title"))}</div><p class="text-sm text-muted">${ssrInterpolate(unref(t)("landing.value.three.desc"))}</p></div></div></div><div class="card"><div class="card-body"><div class="flex items-center justify-between gap-3"><div><div class="font-extrabold text-lg">${ssrInterpolate(unref(t)("landing.how.title"))}</div><div class="text-sm text-muted">${ssrInterpolate(unref(t)("landing.how.subtitle"))}</div></div><div class="badge">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:rocket-launch-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("landing.how.badge"))}</div></div><div class="grid gap-3 sm:grid-cols-3 mt-4"><div class="card bg-surface2"><div class="card-body"><div class="text-xs text-muted">${ssrInterpolate(unref(t)("landing.how.steps.one.kicker"))}</div><div class="font-extrabold">${ssrInterpolate(unref(t)("landing.how.steps.one.title"))}</div><div class="text-sm text-muted mt-1">${ssrInterpolate(unref(t)("landing.how.steps.one.desc"))}</div></div></div><div class="card bg-surface2"><div class="card-body"><div class="text-xs text-muted">${ssrInterpolate(unref(t)("landing.how.steps.two.kicker"))}</div><div class="font-extrabold">${ssrInterpolate(unref(t)("landing.how.steps.two.title"))}</div><div class="text-sm text-muted mt-1">${ssrInterpolate(unref(t)("landing.how.steps.two.desc"))}</div></div></div><div class="card bg-surface2"><div class="card-body"><div class="text-xs text-muted">${ssrInterpolate(unref(t)("landing.how.steps.three.kicker"))}</div><div class="font-extrabold">${ssrInterpolate(unref(t)("landing.how.steps.three.title"))}</div><div class="text-sm text-muted mt-1">${ssrInterpolate(unref(t)("landing.how.steps.three.desc"))}</div></div></div></div><div class="flex flex-wrap gap-2 mt-5">`);
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
          to: unref(localePath)("/workspace"),
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
      _push(`</div></div></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/explore/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=about-BEBgNip0.mjs.map
