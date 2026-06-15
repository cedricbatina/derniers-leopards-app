import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { f as useRoute, b as useLocalePath } from './server.mjs';
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
    const route = useRoute();
    const localePath = useLocalePath();
    const projectSlug = computed(() => String(route.params.slug || "").trim());
    const tiles = computed(() => [
      { label: "Books", icon: "mdi:book-open-page-variant-outline", to: `/studio/projects/${projectSlug.value}/books`, desc: "Tomes, chapitres, structure." },
      { label: "Scenes", icon: "mdi:movie-open-outline", to: `/studio/projects/${projectSlug.value}/scenes`, desc: "Écriture, enjeux, arcs." },
      { label: "Characters", icon: "mdi:account-group-outline", to: `/studio/projects/${projectSlug.value}/characters`, desc: "Personnages, liens, fiches." },
      { label: "Timeline", icon: "mdi:timeline-outline", to: `/studio/projects/${projectSlug.value}/timeline`, desc: "Chronologie & événements." },
      { label: "Glossary", icon: "mdi:book-alphabet", to: `/studio/projects/${projectSlug.value}/glossary`, desc: "Lexique, lieux, concepts." }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page space-y-4" }, _attrs))}><div class="flex items-start justify-between gap-3"><div><h1 class="text-xl font-semibold">Studio</h1><p class="text-sm text-muted"> Projet : <span class="font-semibold">${ssrInterpolate(projectSlug.value)}</span></p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/studio"),
        class: "btn btn-ghost focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:arrow-left",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Projects `);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:arrow-left",
                "aria-hidden": "true"
              }),
              createTextVNode(" Projects ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid gap-3 md:grid-cols-2"><!--[-->`);
      ssrRenderList(tiles.value, (t) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: t.label,
          to: unref(localePath)(t.to),
          class: "card hover:bg-surface2 transition"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="card-body flex items-start gap-3"${_scopeId}><div class="badge"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: t.icon,
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="min-w-0"${_scopeId}><div class="font-extrabold"${_scopeId}>${ssrInterpolate(t.label)}</div><div class="text-sm text-muted mt-1"${_scopeId}>${ssrInterpolate(t.desc)}</div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "card-body flex items-start gap-3" }, [
                  createVNode("div", { class: "badge" }, [
                    createVNode(_component_Icon, {
                      name: t.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["name"])
                  ]),
                  createVNode("div", { class: "min-w-0" }, [
                    createVNode("div", { class: "font-extrabold" }, toDisplayString(t.label), 1),
                    createVNode("div", { class: "text-sm text-muted mt-1" }, toDisplayString(t.desc), 1)
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/studio/projects/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-2F3-6uHN.mjs.map
