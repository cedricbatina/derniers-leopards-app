import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { a as useI18n, b as useLocalePath, e as useSeoMeta } from './server.mjs';
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
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
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
    useSeoMeta(() => ({
      title: t("pages.glossary.meta.title", { name: t("app.name") }),
      description: t("pages.glossary.meta.description"),
      ogTitle: t("pages.glossary.meta.ogTitle", { name: t("app.name") }),
      ogDescription: t("pages.glossary.meta.ogDescription")
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><header class="space-y-2"><h1 class="text-2xl font-extrabold tracking-tight">${ssrInterpolate(unref(t)("pages.glossary.title"))}</h1><p class="text-muted">${ssrInterpolate(unref(t)("pages.glossary.subtitle"))}</p></header><div class="card"><div class="card-body space-y-3"><p class="text-sm text-muted">${ssrInterpolate(unref(t)("pages.comingSoon"))}</p><div class="flex flex-wrap gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, { name: "mdi:arrow-left" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("common.back"))}`);
          } else {
            return [
              createVNode(_component_Icon, { name: "mdi:arrow-left" }),
              createTextVNode(" " + toDisplayString(unref(t)("common.back")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/glossary/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CHrmCpU9.mjs.map
