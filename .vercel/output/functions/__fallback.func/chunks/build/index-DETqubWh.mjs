import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { ref, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { f as useRoute, g as useRouter, b as useLocalePath, a as useI18n } from './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useRouter();
    const localePath = useLocalePath();
    const { t, te } = useI18n();
    function tr(key, fallback) {
      return te(key) ? t(key) : fallback;
    }
    const state = ref("loading");
    const errorMsg = ref("");
    const email = ref("");
    const resendLoading = ref(false);
    const resendMsg = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-md space-y-6" }, _attrs))}><div class="card"><div class="card-body space-y-4"><div class="space-y-1"><h1 class="text-2xl font-extrabold tracking-tight">${ssrInterpolate(tr("auth.verify.title", "Confirmation email"))}</h1><p class="text-sm text-muted">${ssrInterpolate(tr("auth.verify.subtitle", "Vérification du lien en cours…"))}</p></div>`);
      if (state.value === "loading") {
        _push(`<div class="rounded-2xl border border-border bg-surface2 p-3 text-sm"><div class="font-semibold">${ssrInterpolate(tr("auth.verify.loadingTitle", "Validation en cours"))}</div><div class="text-muted mt-1">${ssrInterpolate(tr("auth.verify.loadingBody", "Merci de patienter quelques secondes."))}</div></div>`);
      } else if (state.value === "error") {
        _push(`<div class="rounded-2xl border border-border bg-surface2 p-3 text-sm" role="alert"><div class="font-semibold">${ssrInterpolate(tr("auth.verify.errorTitle", "Lien invalide ou expiré"))}</div><div class="text-muted mt-1">${ssrInterpolate(errorMsg.value)}</div><div class="mt-4 space-y-3"><div class="space-y-1"><label class="text-sm font-semibold" for="email">${ssrInterpolate(tr("auth.fields.email", "Email"))}</label><input id="email"${ssrRenderAttr("value", email.value)} type="email" class="input" autocomplete="email"${ssrRenderAttr("placeholder", tr("auth.placeholders.email", "nom@domaine.com"))}><p class="text-xs text-muted">${ssrInterpolate(tr("auth.verify.resend.help", "Si le lien a expiré, vous pouvez renvoyer un email de confirmation."))}</p></div><button class="btn w-full" type="button"${ssrIncludeBooleanAttr(resendLoading.value || !email.value) ? " disabled" : ""}>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:email-fast",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`<span>${ssrInterpolate(resendLoading.value ? tr("auth.verify.resend.loading", "Envoi…") : tr("auth.verify.resend.cta", "Renvoyer l’email de confirmation"))}</span></button>`);
        if (resendMsg.value) {
          _push(`<p class="text-xs text-muted">${ssrInterpolate(resendMsg.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
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
              _push2(`<span${_scopeId}>${ssrInterpolate(tr("auth.verify.toLogin", "Aller à la connexion"))}</span>`);
            } else {
              return [
                createVNode(_component_Icon, {
                  name: "mdi:login",
                  "aria-hidden": "true"
                }),
                createVNode("span", null, toDisplayString(tr("auth.verify.toLogin", "Aller à la connexion")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<div class="rounded-2xl border border-border bg-surface2 p-3 text-sm"><div class="font-semibold">${ssrInterpolate(tr("auth.verify.doneTitle", "Confirmation effectuée"))}</div><div class="text-muted mt-1">${ssrInterpolate(tr("auth.verify.doneBody", "Redirection…"))}</div></div>`);
      }
      _push(`</div></div><div class="text-xs text-muted text-center">${ssrInterpolate(tr("auth.verify.note", "Si rien ne se passe, revenez à la page de connexion."))}</div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/verify-email/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DETqubWh.mjs.map
