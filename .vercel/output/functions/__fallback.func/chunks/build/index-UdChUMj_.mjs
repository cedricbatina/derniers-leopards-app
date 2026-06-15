import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { computed, ref, withAsyncContext, reactive, mergeProps, unref, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
    const chapterFilter = ref("");
    const creating = ref(false);
    const { data: chaptersData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => `/api/projects/${projectSlug.value}/chapters`,
      { credentials: "include" },
      "$SYx8jv_k46"
    )), __temp = await __temp, __restore(), __temp);
    const chapterOptions = computed(() => chaptersData.value?.chapters || []);
    const queryObj = computed(() => ({
      q: q.value?.trim() || void 0,
      trashed: trashed.value ? 1 : void 0,
      chapter_id: chapterFilter.value ? Number(chapterFilter.value) : void 0
    }));
    const { data, pending, refresh, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => `/api/projects/${projectSlug.value}/scenes`,
      { query: queryObj, credentials: "include" },
      "$R3m0BM4ZSc"
    )), __temp = await __temp, __restore(), __temp);
    const form = reactive({
      chapter_id: "",
      scene_no: "",
      title: "",
      slug: "",
      summary: ""
    });
    async function softDelete(s) {
      if (!confirm(`Delete scene "${s.title || s.slug}"?`)) return;
      await $fetch(`/api/projects/${projectSlug.value}/scenes/${s.slug}`, {
        method: "DELETE",
        credentials: "include"
      });
      await refresh();
    }
    async function restore(s) {
      await $fetch(`/api/projects/${projectSlug.value}/scenes/${s.slug}/restore`, {
        method: "POST",
        credentials: "include"
      });
      await refresh();
    }
    function sceneTo(s) {
      const base = `/studio/projects/${projectSlug.value}/scenes/${s.slug}`;
      return trashed.value ? localePath(`${base}?trashed=1`) : localePath(base);
    }
    function chapterLabel(id, chapterNo) {
      if (chapterNo !== null && chapterNo !== void 0) return `Chapter ${chapterNo}`;
      return `Chapter #${id}`;
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
      _push(`<div class="flex items-start justify-between gap-3"><div><h1 class="text-xl font-semibold">Scenes</h1><p class="text-sm text-muted">Scènes du projet (CRUD + corbeille).</p></div><label class="text-sm text-muted flex items-center gap-2 select-none"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(trashed.value) ? ssrLooseContain(trashed.value, null) : trashed.value) ? " checked" : ""}> Trashed </label></div><div class="card"><div class="card-body grid gap-3 md:grid-cols-6"><div class="md:col-span-2"><label class="text-xs text-muted">Search</label><input${ssrRenderAttr("value", q.value)} class="input w-full" placeholder="title / slug / summary…"></div><div class="md:col-span-2"><label class="text-xs text-muted">Filter by chapter</label><select class="input w-full"><option value=""${ssrIncludeBooleanAttr(Array.isArray(chapterFilter.value) ? ssrLooseContain(chapterFilter.value, "") : ssrLooseEqual(chapterFilter.value, "")) ? " selected" : ""}>All</option><!--[-->`);
      ssrRenderList(chapterOptions.value, (c) => {
        _push(`<option${ssrRenderAttr("value", String(c.id))}${ssrIncludeBooleanAttr(Array.isArray(chapterFilter.value) ? ssrLooseContain(chapterFilter.value, String(c.id)) : ssrLooseEqual(chapterFilter.value, String(c.id))) ? " selected" : ""}>${ssrInterpolate(chapterLabel(c.id, c.chapter_no))}</option>`);
      });
      _push(`<!--]--></select></div><div class="md:col-span-2"><label class="text-xs text-muted">New scene: chapter</label><select class="input w-full"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.chapter_id) ? ssrLooseContain(form.chapter_id, "") : ssrLooseEqual(form.chapter_id, "")) ? " selected" : ""}>Select…</option><!--[-->`);
      ssrRenderList(chapterOptions.value, (c) => {
        _push(`<option${ssrRenderAttr("value", String(c.id))}${ssrIncludeBooleanAttr(Array.isArray(form.chapter_id) ? ssrLooseContain(form.chapter_id, String(c.id)) : ssrLooseEqual(form.chapter_id, String(c.id))) ? " selected" : ""}>${ssrInterpolate(chapterLabel(c.id, c.chapter_no))}</option>`);
      });
      _push(`<!--]--></select></div><div class="md:col-span-1"><label class="text-xs text-muted">Scene #</label><input${ssrRenderAttr("value", form.scene_no)} class="input w-full" placeholder="1"></div><div class="md:col-span-2"><label class="text-xs text-muted">Title</label><input${ssrRenderAttr("value", form.title)} class="input w-full" placeholder="e.g. Désolation de Mbuila"></div><div class="md:col-span-2"><label class="text-xs text-muted">Slug (optional)</label><input${ssrRenderAttr("value", form.slug)} class="input w-full" placeholder="mbuila-desolation"></div><div class="md:col-span-6"><label class="text-xs text-muted">Summary</label><textarea class="input w-full min-h-24" placeholder="Résumé (optionnel)">${ssrInterpolate(form.summary)}</textarea></div><div class="md:col-span-6"><button class="btn btn-primary w-full focus-ring"${ssrIncludeBooleanAttr(creating.value) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:plus",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Create </button></div></div></div>`);
      if (unref(error)) {
        _push(`<div class="card"><div class="card-body text-sm">Error: ${ssrInterpolate(unref(error)?.statusMessage || unref(error))}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="card overflow-hidden"><div class="card-body flex items-center justify-between"><div class="text-sm text-muted">`);
      if (unref(pending)) {
        _push(`<span>Loading…</span>`);
      } else {
        _push(`<span>${ssrInterpolate(unref(data)?.scenes?.length || 0)} scene(s)</span>`);
      }
      _push(`</div></div><div class="divide-y divide-border"><!--[-->`);
      ssrRenderList(unref(data)?.scenes || [], (s) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: s.slug,
          class: "block p-4 hover:bg-surface2",
          to: sceneTo(s)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><div class="font-extrabold"${_scopeId}>`);
              if (s.chapter_no !== null && s.chapter_no !== void 0) {
                _push2(`<span class="text-muted"${_scopeId}> [Ch ${ssrInterpolate(s.chapter_no)}] </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(s.title || s.slug)}</div><div class="text-xs text-muted mt-1"${_scopeId}>${ssrInterpolate(s.slug)}</div>`);
              if (s.summary) {
                _push2(`<div class="text-sm text-muted mt-1 line-clamp-2"${_scopeId}>${ssrInterpolate(s.summary)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex items-center gap-2"${_scopeId}>`);
              if (s.deleted_at) {
                _push2(`<span class="badge"${_scopeId}>trashed</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (!s.deleted_at) {
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
                    createVNode("div", { class: "font-extrabold" }, [
                      s.chapter_no !== null && s.chapter_no !== void 0 ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "text-muted"
                      }, " [Ch " + toDisplayString(s.chapter_no) + "] ", 1)) : createCommentVNode("", true),
                      createTextVNode(" " + toDisplayString(s.title || s.slug), 1)
                    ]),
                    createVNode("div", { class: "text-xs text-muted mt-1" }, toDisplayString(s.slug), 1),
                    s.summary ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-sm text-muted mt-1 line-clamp-2"
                    }, toDisplayString(s.summary), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    s.deleted_at ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "badge"
                    }, "trashed")) : createCommentVNode("", true),
                    !s.deleted_at ? (openBlock(), createBlock("button", {
                      key: 1,
                      class: "btn btn-ghost focus-ring",
                      onClick: withModifiers(($event) => softDelete(s), ["prevent", "stop"])
                    }, [
                      createVNode(_component_Icon, {
                        name: "mdi:trash-can-outline",
                        "aria-hidden": "true"
                      })
                    ], 8, ["onClick"])) : (openBlock(), createBlock("button", {
                      key: 2,
                      class: "btn btn-ghost focus-ring",
                      onClick: withModifiers(($event) => restore(s), ["prevent", "stop"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/[slug]/scenes/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-UdChUMj_.mjs.map
