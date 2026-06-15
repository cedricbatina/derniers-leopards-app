import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { computed, withAsyncContext, ref, reactive, watchEffect, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
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
  __name: "[sceneSlug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const localePath = useLocalePath();
    const route = useRoute();
    const projectSlug = computed(() => String(route.params.slug || ""));
    const sceneSlug = computed(() => String(route.params.sceneSlug || ""));
    const allowTrashed = computed(() => String(route.query.trashed || "") === "1");
    const sceneQuery = computed(() => ({ trashed: allowTrashed.value ? 1 : void 0 }));
    const { data, pending, refresh, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => `/api/projects/${projectSlug.value}/scenes/${sceneSlug.value}`,
      { query: sceneQuery, credentials: "include" },
      "$Y7VT5gxZPZ"
    )), __temp = await __temp, __restore(), __temp);
    const { data: chaptersData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => `/api/projects/${projectSlug.value}/chapters`,
      { credentials: "include" },
      "$ReJUj68D09"
    )), __temp = await __temp, __restore(), __temp);
    const { data: charactersData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => `/api/projects/${projectSlug.value}/characters`,
      { credentials: "include" },
      "$UiD-mxzhZB"
    )), __temp = await __temp, __restore(), __temp);
    const chapters = computed(() => chaptersData.value?.chapters || []);
    const characters = computed(() => charactersData.value?.characters || []);
    const saving = ref(false);
    const deleting = ref(false);
    const restoring = ref(false);
    const form = reactive({
      chapter_id: "",
      scene_no: "",
      title: "",
      pov_character_id: "",
      time_of_day: "",
      objective: "",
      summary: "",
      content: "",
      conflict: "",
      turning_point: "",
      outcome: "",
      hook: "",
      indesign_style: ""
    });
    watchEffect(() => {
      const s = data.value?.scene;
      if (!s) return;
      form.chapter_id = s.chapter_id ? String(s.chapter_id) : "";
      form.scene_no = s.scene_no !== null && s.scene_no !== void 0 ? String(s.scene_no) : "";
      form.title = s.title || "";
      form.pov_character_id = s.pov_character_id ? String(s.pov_character_id) : "";
      form.time_of_day = s.time_of_day || "";
      form.objective = s.objective || "";
      form.summary = s.summary || "";
      form.content = s.content || "";
      form.conflict = s.conflict || "";
      form.turning_point = s.turning_point || "";
      form.outcome = s.outcome || "";
      form.hook = s.hook || "";
      form.indesign_style = s.indesign_style || "";
    });
    const isTrashed = computed(() => !!data.value?.scene?.deleted_at);
    function chapterLabel(id, chapterNo) {
      if (chapterNo !== null && chapterNo !== void 0) return `Chapter ${chapterNo}`;
      return `Chapter #${id}`;
    }
    function characterLabel(c) {
      return c?.name ? `${c.name} (${c.slug})` : c?.slug || String(c?.id || "");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page space-y-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "text-sm text-muted hover:opacity-100",
        to: unref(localePath)(`/studio/projects/${projectSlug.value}/scenes${allowTrashed.value ? "?trashed=1" : ""}`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← Back to scenes `);
          } else {
            return [
              createTextVNode(" ← Back to scenes ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-start justify-between gap-3"><div><h1 class="text-xl font-semibold">Scene</h1><p class="text-sm text-muted">${ssrInterpolate(sceneSlug.value)}</p></div><div class="flex items-center gap-2">`);
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
      _push(`<div class="card"><div class="card-body space-y-4">`);
      if (unref(pending)) {
        _push(`<div class="text-sm text-muted">Loading…</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-3 md:grid-cols-3"><div><label class="text-xs text-muted">Chapter</label><select class="input w-full"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.chapter_id) ? ssrLooseContain(form.chapter_id, "") : ssrLooseEqual(form.chapter_id, "")) ? " selected" : ""}>Select…</option><!--[-->`);
      ssrRenderList(chapters.value, (c) => {
        _push(`<option${ssrRenderAttr("value", String(c.id))}${ssrIncludeBooleanAttr(Array.isArray(form.chapter_id) ? ssrLooseContain(form.chapter_id, String(c.id)) : ssrLooseEqual(form.chapter_id, String(c.id))) ? " selected" : ""}>${ssrInterpolate(chapterLabel(c.id, c.chapter_no))}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="text-xs text-muted">Scene #</label><input${ssrRenderAttr("value", form.scene_no)} class="input w-full"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""} placeholder="1"></div><div><label class="text-xs text-muted">POV</label><select class="input w-full"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.pov_character_id) ? ssrLooseContain(form.pov_character_id, "") : ssrLooseEqual(form.pov_character_id, "")) ? " selected" : ""}>—</option><!--[-->`);
      ssrRenderList(characters.value, (c) => {
        _push(`<option${ssrRenderAttr("value", String(c.id))}${ssrIncludeBooleanAttr(Array.isArray(form.pov_character_id) ? ssrLooseContain(form.pov_character_id, String(c.id)) : ssrLooseEqual(form.pov_character_id, String(c.id))) ? " selected" : ""}>${ssrInterpolate(characterLabel(c))}</option>`);
      });
      _push(`<!--]--></select></div></div><div class="grid gap-3 md:grid-cols-2"><div><label class="text-xs text-muted">Title</label><input${ssrRenderAttr("value", form.title)} class="input w-full"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}></div><div><label class="text-xs text-muted">Time of day</label><input${ssrRenderAttr("value", form.time_of_day)} class="input w-full"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""} placeholder="Matin / Nuit…"></div></div><div><label class="text-xs text-muted">Objective</label><input${ssrRenderAttr("value", form.objective)} class="input w-full"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}></div><div><label class="text-xs text-muted">Summary</label><textarea class="input w-full min-h-24"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}>${ssrInterpolate(form.summary)}</textarea></div><div><label class="text-xs text-muted">Content</label><textarea class="input w-full min-h-40"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}>${ssrInterpolate(form.content)}</textarea></div><div class="grid gap-3 md:grid-cols-2"><div><label class="text-xs text-muted">Conflict</label><textarea class="input w-full min-h-24"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}>${ssrInterpolate(form.conflict)}</textarea></div><div><label class="text-xs text-muted">Turning point</label><textarea class="input w-full min-h-24"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}>${ssrInterpolate(form.turning_point)}</textarea></div></div><div class="grid gap-3 md:grid-cols-3"><div><label class="text-xs text-muted">Outcome</label><textarea class="input w-full min-h-24"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}>${ssrInterpolate(form.outcome)}</textarea></div><div><label class="text-xs text-muted">Hook</label><textarea class="input w-full min-h-24"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}>${ssrInterpolate(form.hook)}</textarea></div><div><label class="text-xs text-muted">InDesign style</label><textarea class="input w-full min-h-24"${ssrIncludeBooleanAttr(isTrashed.value) ? " disabled" : ""}>${ssrInterpolate(form.indesign_style)}</textarea></div></div><button class="btn btn-primary w-full focus-ring"${ssrIncludeBooleanAttr(saving.value || isTrashed.value) ? " disabled" : ""}>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/[slug]/scenes/[sceneSlug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_sceneSlug_-Dxnzqcxd.mjs.map
