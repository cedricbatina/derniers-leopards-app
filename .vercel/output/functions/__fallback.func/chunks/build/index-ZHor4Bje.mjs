import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { b as useLocalePath, f as useRoute } from './server.mjs';
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
import '@iconify/vue';
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
    const localePath = useLocalePath();
    const route = useRoute();
    const projectSlug = computed(() => String(route.params.slug || ""));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page space-y-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "text-sm text-muted hover:opacity-100",
        to: unref(localePath)(`/studio/projects/${projectSlug.value}`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← Back to project `);
          } else {
            return [
              createTextVNode(" ← Back to project ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="card"><div class="card-body"><h1 class="text-xl font-semibold">Timeline</h1><p class="text-sm text-muted mt-2">Placeholder (on branchera la timeline ici).</p></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/[slug]/timeline/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-ZHor4Bje.mjs.map
