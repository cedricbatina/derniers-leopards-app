import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { computed, ref, reactive, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { b as useLocalePath, f as useRoute } from './server.mjs';
import { u as useFetch } from './fetch-DWjYLp75.mjs';
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
import '@vue/shared';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const localePath = useLocalePath();
    const route = useRoute();
    const projectSlug = computed(() => String(route.params.slug || ""));
    const q = ref("");
    const trashed = ref(false);
    const creating = ref(false);
    const form = reactive({
      title: "",
      slug: "",
      subtitle: ""
    });
    const queryObj = computed(() => ({
      q: q.value?.trim() || void 0,
      trashed: trashed.value ? 1 : void 0
    }));
    const { data, pending, refresh, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => `/api/projects/${projectSlug.value}/books`,
      { query: queryObj, credentials: "include" },
      "$M0_13U7Fy1"
    )), __temp = await __temp, __restore(), __temp);
    async function softDelete(b) {
      if (!confirm(`Delete book "${b.title}"?`)) return;
      await $fetch(`/api/projects/${projectSlug.value}/books/${b.slug}`, {
        method: "DELETE",
        credentials: "include"
      });
      await refresh();
    }
    async function restore(b) {
      await $fetch(`/api/projects/${projectSlug.value}/books/${b.slug}/restore`, {
        method: "POST",
        credentials: "include"
      });
      await refresh();
    }
    function bookTo(b) {
      const base = `/studio/projects/${projectSlug.value}/books/${b.slug}`;
      if (trashed.value) return localePath(`${base}?trashed=1`);
      return localePath(base);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_2;
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
      _push(`<div class="flex items-start justify-between gap-3"><div><h1 class="text-xl font-semibold">Books</h1><p class="text-sm text-muted">Tomes, essais, bibles… par projet.</p></div><div class="flex items-center gap-2"><label class="text-sm text-muted flex items-center gap-2 select-none"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(trashed.value) ? ssrLooseContain(trashed.value, null) : trashed.value) ? " checked" : ""}> Trashed </label></div></div><div class="card"><div class="card-body grid gap-3 md:grid-cols-4"><div class="md:col-span-1"><label class="text-xs text-muted">Search</label><input${ssrRenderAttr("value", q.value)} class="input w-full" placeholder="title / slug / subtitle…"></div><div class="md:col-span-1"><label class="text-xs text-muted">New title</label><input${ssrRenderAttr("value", form.title)} class="input w-full" placeholder="e.g. Tome I"></div><div class="md:col-span-1"><label class="text-xs text-muted">Subtitle (optional)</label><input${ssrRenderAttr("value", form.subtitle)} class="input w-full" placeholder="e.g. Les derniers léopards"></div><div class="md:col-span-1"><label class="text-xs text-muted">Slug (optional)</label><input${ssrRenderAttr("value", form.slug)} class="input w-full" placeholder="tome-1"></div><div class="md:col-span-4"><button class="btn btn-primary w-full focus-ring"${ssrIncludeBooleanAttr(creating.value) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:plus",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Create </button></div></div></div>`);
      if (unref(error)) {
        _push(`<div class="card"><div class="card-body text-sm"> Error: ${ssrInterpolate(unref(error)?.statusMessage || unref(error))}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="card overflow-hidden"><div class="card-body flex items-center justify-between"><div class="text-sm text-muted">`);
      if (unref(pending)) {
        _push(`<span>Loading…</span>`);
      } else {
        _push(`<span>${ssrInterpolate(unref(data)?.books?.length || 0)} book(s)</span>`);
      }
      _push(`</div></div><div class="divide-y divide-border"><!--[-->`);
      ssrRenderList(unref(data)?.books || [], (b) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: b.slug,
          class: "block p-4 hover:bg-surface2",
          to: bookTo(b)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><div class="font-extrabold"${_scopeId}>${ssrInterpolate(b.title)}</div>`);
              if (b.subtitle) {
                _push2(`<div class="text-sm text-muted mt-1"${_scopeId}>${ssrInterpolate(b.subtitle)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="text-xs text-muted mt-1"${_scopeId}>${ssrInterpolate(b.slug)}</div></div><div class="flex items-center gap-2"${_scopeId}>`);
              if (b.deleted_at) {
                _push2(`<span class="badge"${_scopeId}>trashed</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (!b.deleted_at) {
                _push2(`<button class="btn btn-ghost focus-ring"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "mdi:trash-can-outline",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<button class="btn btn-ghost focus-ring"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "mdi:backup-restore",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              }
              _push2(`</div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("div", { class: "font-extrabold" }, toDisplayString(b.title), 1),
                    b.subtitle ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-sm text-muted mt-1"
                    }, toDisplayString(b.subtitle), 1)) : createCommentVNode("", true),
                    createVNode("div", { class: "text-xs text-muted mt-1" }, toDisplayString(b.slug), 1)
                  ]),
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    b.deleted_at ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "badge"
                    }, "trashed")) : createCommentVNode("", true),
                    !b.deleted_at ? (openBlock(), createBlock("button", {
                      key: 1,
                      class: "btn btn-ghost focus-ring",
                      onClick: withModifiers(($event) => softDelete(b), ["prevent", "stop"])
                    }, [
                      createVNode(_component_Icon, {
                        name: "mdi:trash-can-outline",
                        "aria-hidden": "true"
                      })
                    ], 8, ["onClick"])) : (openBlock(), createBlock("button", {
                      key: 2,
                      class: "btn btn-ghost focus-ring",
                      onClick: withModifiers(($event) => restore(b), ["prevent", "stop"])
                    }, [
                      createVNode(_component_Icon, {
                        name: "mdi:backup-restore",
                        "aria-hidden": "true"
                      })
                    ], 8, ["onClick"]))
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/studio/projects/[slug]/books/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-3tqUj9st.mjs.map
