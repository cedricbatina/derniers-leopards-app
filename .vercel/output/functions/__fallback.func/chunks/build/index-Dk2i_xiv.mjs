import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { computed, withAsyncContext, ref, reactive, watchEffect, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
    const slug = computed(() => String(route.params.slug || ""));
    const { data, pending, refresh, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(() => `/api/projects/${slug.value}`, {
      credentials: "include"
    }, "$flJmbZtyM0")), __temp = await __temp, __restore(), __temp);
    const saving = ref(false);
    const deleting = ref(false);
    const form = reactive({
      title: "",
      title_en: "",
      title_pt: "",
      logline: "",
      pitch: "",
      status: "active"
    });
    watchEffect(() => {
      const p = data.value?.project;
      if (!p) return;
      form.title = p.title || "";
      form.title_en = p.title_en || "";
      form.title_pt = p.title_pt || "";
      form.logline = p.logline || "";
      form.pitch = p.pitch || "";
      form.status = p.status || "active";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page space-y-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "text-sm text-muted hover:opacity-100",
        to: unref(localePath)("/studio/projects")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← Back to projects `);
          } else {
            return [
              createTextVNode(" ← Back to projects ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-start justify-between gap-3"><div><h1 class="text-xl font-semibold">Project</h1><p class="text-sm text-muted">Slug is immutable: <span class="font-mono">${ssrInterpolate(slug.value)}</span></p></div><div class="flex gap-2"><button class="btn btn-primary focus-ring"${ssrIncludeBooleanAttr(saving.value || unref(pending)) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:content-save-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Save </button><button class="btn btn-ghost focus-ring"${ssrIncludeBooleanAttr(deleting.value) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:trash-can-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Delete </button></div></div>`);
      if (unref(error)) {
        _push(`<div class="card"><div class="card-body text-sm"> Error: ${ssrInterpolate(unref(error)?.statusMessage || unref(error))}</div></div>`);
      } else {
        _push(`<div class="card"><div class="card-body grid gap-3 md:grid-cols-2"><div><label class="text-xs text-muted">Title (default)</label><input${ssrRenderAttr("value", form.title)} class="input w-full"></div><div><label class="text-xs text-muted">Status</label><select class="input w-full"><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(form.status) ? ssrLooseContain(form.status, "draft") : ssrLooseEqual(form.status, "draft")) ? " selected" : ""}>draft</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(form.status) ? ssrLooseContain(form.status, "active") : ssrLooseEqual(form.status, "active")) ? " selected" : ""}>active</option><option value="archived"${ssrIncludeBooleanAttr(Array.isArray(form.status) ? ssrLooseContain(form.status, "archived") : ssrLooseEqual(form.status, "archived")) ? " selected" : ""}>archived</option></select></div><div><label class="text-xs text-muted">Title EN</label><input${ssrRenderAttr("value", form.title_en)} class="input w-full"></div><div><label class="text-xs text-muted">Title PT</label><input${ssrRenderAttr("value", form.title_pt)} class="input w-full"></div><div class="md:col-span-2"><label class="text-xs text-muted">Logline</label><input${ssrRenderAttr("value", form.logline)} class="input w-full"></div><div class="md:col-span-2"><label class="text-xs text-muted">Pitch</label><textarea class="input w-full min-h-28">${ssrInterpolate(form.pitch)}</textarea></div></div></div>`);
      }
      _push(`<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "card hover:bg-surface2",
        to: unref(localePath)(`/studio/projects/${slug.value}/scenes`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-body"${_scopeId}><div class="font-extrabold"${_scopeId}>Scenes</div><div class="text-xs text-muted mt-1"${_scopeId}>Write &amp; structure.</div></div>`);
          } else {
            return [
              createVNode("div", { class: "card-body" }, [
                createVNode("div", { class: "font-extrabold" }, "Scenes"),
                createVNode("div", { class: "text-xs text-muted mt-1" }, "Write & structure.")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "card hover:bg-surface2",
        to: unref(localePath)(`/studio/projects/${slug.value}/characters`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-body"${_scopeId}><div class="font-extrabold"${_scopeId}>Characters</div><div class="text-xs text-muted mt-1"${_scopeId}>Arcs &amp; relations.</div></div>`);
          } else {
            return [
              createVNode("div", { class: "card-body" }, [
                createVNode("div", { class: "font-extrabold" }, "Characters"),
                createVNode("div", { class: "text-xs text-muted mt-1" }, "Arcs & relations.")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "card hover:bg-surface2",
        to: unref(localePath)(`/studio/projects/${slug.value}/timeline`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-body"${_scopeId}><div class="font-extrabold"${_scopeId}>Timeline</div><div class="text-xs text-muted mt-1"${_scopeId}>Chronology.</div></div>`);
          } else {
            return [
              createVNode("div", { class: "card-body" }, [
                createVNode("div", { class: "font-extrabold" }, "Timeline"),
                createVNode("div", { class: "text-xs text-muted mt-1" }, "Chronology.")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "card hover:bg-surface2",
        to: unref(localePath)(`/studio/projects/${slug.value}/glossary`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-body"${_scopeId}><div class="font-extrabold"${_scopeId}>Glossary</div><div class="text-xs text-muted mt-1"${_scopeId}>Terms &amp; vocabulary.</div></div>`);
          } else {
            return [
              createVNode("div", { class: "card-body" }, [
                createVNode("div", { class: "font-extrabold" }, "Glossary"),
                createVNode("div", { class: "text-xs text-muted mt-1" }, "Terms & vocabulary.")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/studio/projects/[slug]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dk2i_xiv.mjs.map
