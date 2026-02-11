import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { computed, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { f as useRoute, a as useI18n, b as useLocalePath } from './server.mjs';
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
  __name: "success",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t } = useI18n();
    const localePath = useLocalePath();
    function tr(key, fallback) {
      const v = t(key);
      return v === key ? fallback : v;
    }
    const email = computed(() => {
      const q = route.query?.email;
      return typeof q === "string" ? q : "";
    });
    const resendLoading = ref(false);
    const resendMsg = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-md space-y-6" }, _attrs))}><div class="card"><div class="card-body space-y-4"><div class="space-y-1"><h1 class="text-2xl font-extrabold tracking-tight">${ssrInterpolate(tr("auth.registerSuccess.title", "Compte créé"))}</h1><p class="text-sm text-muted">${ssrInterpolate(tr("auth.registerSuccess.subtitle", "Un email de confirmation a été envoyé."))}</p></div><div class="rounded-2xl border border-border bg-surface2 p-3 text-sm"><div class="font-semibold">${ssrInterpolate(tr("auth.registerSuccess.next", "Étape suivante"))}</div><div class="text-muted mt-1">${ssrInterpolate(tr("auth.registerSuccess.instructions", "Ouvre ton email et clique sur le lien de confirmation."))}</div>`);
      if (email.value) {
        _push(`<div class="mt-2 text-sm"><span class="text-muted">${ssrInterpolate(tr("auth.fields.email", "Email"))} :</span><span class="font-semibold ml-1">${ssrInterpolate(email.value)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2"><button class="btn w-full" type="button"${ssrIncludeBooleanAttr(resendLoading.value) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:email-fast",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(resendLoading.value ? tr("auth.registerSuccess.resend.loading", "Envoi…") : tr("auth.registerSuccess.resend.cta", "Renvoyer l’email de confirmation"))}</span></button>`);
      if (resendMsg.value) {
        _push(`<p class="text-xs text-muted">${ssrInterpolate(resendMsg.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="divider"></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/login"),
        class: "btn btn-primary w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:login",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(tr("auth.registerSuccess.toLogin", "Aller à la connexion"))}</span>`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:login",
                "aria-hidden": "true"
              }),
              createVNode("span", null, toDisplayString(tr("auth.registerSuccess.toLogin", "Aller à la connexion")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="text-xs text-muted text-center">${ssrInterpolate(tr("auth.registerSuccess.tip", "Pense à vérifier les spams si tu ne vois rien."))}</div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register/success.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=success-Ce-RlGdQ.mjs.map
