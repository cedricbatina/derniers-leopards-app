import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { computed, withAsyncContext, ref, reactive, watchEffect, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
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
  __name: "[bookSlug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const localePath = useLocalePath();
    const route = useRoute();
    const projectSlug = computed(() => String(route.params.slug || ""));
    const bookSlug = computed(() => String(route.params.bookSlug || ""));
    const allowTrashed = computed(() => String(route.query.trashed || "") === "1");
    const { data, pending, refresh, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => `/api/projects/${projectSlug.value}/books/${bookSlug.value}`,
      {
        query: computed(() => ({ trashed: allowTrashed.value ? 1 : void 0 })),
        credentials: "include"
      },
      "$ZtuaQsw9Q7"
    )), __temp = await __temp, __restore(), __temp);
    const { data: charsData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => `/api/projects/${projectSlug.value}/characters`,
      { credentials: "include" },
      "$P_ah4r2G9a"
    )), __temp = await __temp, __restore(), __temp);
    const saving = ref(false);
    const deleting = ref(false);
    const restoring = ref(false);
    const form = reactive({
      title: "",
      subtitle: "",
      subtitle_en: "",
      subtitle_pt: "",
      summary: "",
      narrator_character_ids: []
    });
    watchEffect(() => {
      const b = data.value?.book;
      if (!b) return;
      form.title = b.title || "";
      form.subtitle = b.subtitle || "";
      form.subtitle_en = b.subtitle_en || "";
      form.subtitle_pt = b.subtitle_pt || "";
      form.summary = b.summary || "";
      form.narrator_character_ids = (data.value?.narrators || []).map((n) => n.id);
    });
    const narratorSet = computed(() => new Set(form.narrator_character_ids.map((x) => Number(x))));
    const characters = computed(() => charsData.value?.characters || []);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page space-y-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "text-sm text-muted hover:opacity-100",
        to: unref(localePath)(`/studio/projects/${projectSlug.value}/books`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← Back to books `);
          } else {
            return [
              createTextVNode(" ← Back to books ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-start justify-between gap-3"><div><h1 class="text-xl font-semibold">Book</h1><p class="text-sm text-muted">Slug is immutable: <span class="font-mono">${ssrInterpolate(bookSlug.value)}</span></p></div><div class="flex gap-2"><button class="btn btn-primary focus-ring"${ssrIncludeBooleanAttr(saving.value || unref(pending)) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:content-save-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Save </button>`);
      if (unref(data)?.book?.deleted_at) {
        _push(`<button class="btn btn-ghost focus-ring"${ssrIncludeBooleanAttr(restoring.value) ? " disabled" : ""}>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:backup-restore",
          "aria-hidden": "true"
        }, null, _parent));
        _push(` Restore </button>`);
      } else {
        _push(`<button class="btn btn-ghost focus-ring"${ssrIncludeBooleanAttr(deleting.value) ? " disabled" : ""}>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:trash-can-outline",
          "aria-hidden": "true"
        }, null, _parent));
        _push(` Delete </button>`);
      }
      _push(`</div></div>`);
      if (unref(error)) {
        _push(`<div class="card"><div class="card-body text-sm"> Error: ${ssrInterpolate(unref(error)?.statusMessage || unref(error))}</div></div>`);
      } else {
        _push(`<div class="card"><div class="card-body grid gap-3 md:grid-cols-2"><div><label class="text-xs text-muted">Title</label><input${ssrRenderAttr("value", form.title)} class="input w-full"></div><div><label class="text-xs text-muted">Subtitle</label><input${ssrRenderAttr("value", form.subtitle)} class="input w-full"></div><div><label class="text-xs text-muted">Subtitle EN</label><input${ssrRenderAttr("value", form.subtitle_en)} class="input w-full"></div><div><label class="text-xs text-muted">Subtitle PT</label><input${ssrRenderAttr("value", form.subtitle_pt)} class="input w-full"></div><div class="md:col-span-2"><label class="text-xs text-muted">Summary</label><textarea class="input w-full min-h-28">${ssrInterpolate(form.summary)}</textarea></div></div></div>`);
      }
      _push(`<div class="card"><div class="card-body space-y-3"><div class="flex items-center justify-between"><div><div class="font-extrabold">Narrators</div><div class="text-xs text-muted">Book narrators (link to Characters).</div></div><div class="text-xs text-muted">${ssrInterpolate(form.narrator_character_ids.length)} selected</div></div>`);
      if (!characters.value.length) {
        _push(`<div class="text-sm text-muted"> No characters yet. </div>`);
      } else {
        _push(`<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(characters.value, (c) => {
          _push(`<label class="flex items-center gap-2 p-2 rounded-xl border border-border hover:bg-surface2 cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(narratorSet.value.has(c.id)) ? " checked" : ""}><div><div class="text-sm font-semibold">${ssrInterpolate(c.name)}</div><div class="text-xs text-muted">${ssrInterpolate(c.slug)}</div></div></label>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/studio/projects/[slug]/books/[bookSlug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_bookSlug_-DPrl1Ytf.mjs.map
