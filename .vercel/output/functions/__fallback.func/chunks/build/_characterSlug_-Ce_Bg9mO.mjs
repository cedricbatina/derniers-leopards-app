import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { computed, withAsyncContext, ref, reactive, watchEffect, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr } from 'vue/server-renderer';
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
  __name: "[characterSlug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const localePath = useLocalePath();
    const route = useRoute();
    const projectSlug = computed(() => String(route.params.slug || ""));
    const characterSlug = computed(() => String(route.params.characterSlug || ""));
    const allowTrashed = computed(() => String(route.query.trashed || "") === "1");
    const queryObj = computed(() => ({ trashed: allowTrashed.value ? 1 : void 0 }));
    const { data, pending, refresh, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => `/api/projects/${projectSlug.value}/characters/${characterSlug.value}`,
      { query: queryObj, credentials: "include" },
      "$vMaK6wZc-D"
    )), __temp = await __temp, __restore(), __temp);
    const saving = ref(false);
    const deleting = ref(false);
    const restoring = ref(false);
    const form = reactive({
      name: "",
      description: ""
    });
    watchEffect(() => {
      const c = data.value?.character;
      if (!c) return;
      form.name = c.name || "";
      form.description = c.description || "";
    });
    const isTrashed = computed(() => !!data.value?.character?.deleted_at);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page space-y-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "text-sm text-muted hover:opacity-100",
        to: unref(localePath)(`/studio/projects/${projectSlug.value}/characters${allowTrashed.value ? "?trashed=1" : ""}`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← Back to characters `);
          } else {
            return [
              createTextVNode(" ← Back to characters ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-start justify-between gap-3"><div><h1 class="text-xl font-semibold">Character</h1><p class="text-sm text-muted">${ssrInterpolate(characterSlug.value)}</p></div><div class="flex items-center gap-2">`);
      if (isTrashed.value) {
        _push(`<span class="badge">trashed</span>`);
      } else {
        _push(`<!---->`);
      }
      if (!isTrashed.value) {
        _push(`<button class="btn btn-ghost focus-ring"${ssrIncludeBooleanAttr(deleting.value) ? " disabled" : ""}>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:trash-can-outline",
          "aria-hidden": "true"
        }, null, _parent));
        _push(` Delete </button>`);
      } else {
        _push(`<button class="btn btn-ghost focus-ring"${ssrIncludeBooleanAttr(restoring.value) ? " disabled" : ""}>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:backup-restore",
          "aria-hidden": "true"
        }, null, _parent));
        _push(` Restore </button>`);
      }
      _push(`</div></div>`);
      if (unref(error)) {
        _push(`<div class="card"><div class="card-body text-sm">Error: ${ssrInterpolate(unref(error)?.statusMessage || unref(error))}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="card"><div class="card-body space-y-3">`);
      if (unref(pending)) {
        _push(`<div class="text-sm text-muted">Loading…</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-3 md:grid-cols-2"><div><label class="text-xs text-muted">Name</label><input${ssrRenderAttr("value", form.name)} class="input w-full"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}></div><div><label class="text-xs text-muted">Description</label><input${ssrRenderAttr("value", form.description)} class="input w-full"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}></div></div><button class="btn btn-primary w-full focus-ring"${ssrIncludeBooleanAttr(saving.value || isTrashed.value) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:content-save",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(saving.value ? "Saving…" : "Save")}</button></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/[slug]/characters/[characterSlug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_characterSlug_-Ce_Bg9mO.mjs.map
