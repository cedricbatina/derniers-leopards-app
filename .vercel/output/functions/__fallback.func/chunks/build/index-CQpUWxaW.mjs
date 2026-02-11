import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
      title: () => "Sonekeno — Écriture",
      description: () => "Écrire plus vite, rester cohérent : personnages, scènes, notes et versions dans un même espace."
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6 sm:space-y-10" }, _attrs))}><div class="card card-hover card-accent accent-earth overflow-hidden"><div class="card-body"><div class="flex flex-col gap-4 sm:gap-5"><p class="badge badge-accent w-fit">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:pencil-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Écriture </p><h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline"> Écrire avec une base solide </h1><p class="text-subtle max-w-2xl"> Du manuscrit au canon : structure ton récit sans perdre les détails (versions, liens, cohérence). </p><div class="flex flex-wrap gap-2 pt-1">`);
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
            _push2(` Voir le workflow `);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:rocket-launch-outline",
                "aria-hidden": "true"
              }),
              createTextVNode(" Voir le workflow ")
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
            _push2(` Retour explorer `);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:compass-outline",
                "aria-hidden": "true"
              }),
              createTextVNode(" Retour explorer ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div><div class="card"><div class="card-body text-sm text-muted"> Page en cours : on la remplit après stabilisation de Explore + bascule workspace sous /studio/*. </div></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/explore/writing/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CQpUWxaW.mjs.map
