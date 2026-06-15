import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderAttr, ssrRenderDynamicModel } from 'vue/server-renderer';
import { c as useAuthStore, f as useRoute, g as useRouter, a as useI18n, b as useLocalePath } from './server.mjs';
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
    useAuthStore();
    const route = useRoute();
    useRouter();
    const { t, te } = useI18n();
    const localePath = useLocalePath();
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const loading = ref(false);
    const errorMsg = ref("");
    const canResendVerify = ref(false);
    const resendLoading = ref(false);
    const resendMsg = ref("");
    function tr(key, fallback) {
      return te(key) ? t(key) : fallback;
    }
    computed(() => {
      const q = route.query?.redirect;
      if (typeof q === "string" && q.startsWith("/") && !q.startsWith("//")) return q;
      return localePath("/workspace");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-md space-y-6" }, _attrs))}><div class="card"><div class="card-body space-y-4"><div class="space-y-1"><h1 class="text-2xl font-extrabold tracking-tight">${ssrInterpolate(tr("auth.login.title", "Connexion"))}</h1><p class="text-sm text-muted">${ssrInterpolate(tr("auth.login.subtitle", "Connectez-vous pour accéder à votre espace de travail."))}</p></div>`);
      if (errorMsg.value) {
        _push(`<div class="rounded-2xl border border-border bg-surface2 p-3 text-sm" role="alert"><div class="font-semibold">${ssrInterpolate(tr("auth.login.errorTitle", "Impossible de se connecter"))}</div><div class="text-muted mt-1">${ssrInterpolate(errorMsg.value)}</div>`);
        if (canResendVerify.value) {
          _push(`<div class="mt-3"><button class="btn btn-sm" type="button"${ssrIncludeBooleanAttr(resendLoading.value) ? " disabled" : ""}>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "mdi:email-fast",
            "aria-hidden": "true"
          }, null, _parent));
          _push(`<span>${ssrInterpolate(resendLoading.value ? tr("auth.login.resend.loading", "Envoi…") : tr("auth.login.resend.cta", "Renvoyer l’email de confirmation"))}</span></button>`);
          if (resendMsg.value) {
            _push(`<p class="text-xs text-muted mt-2">${ssrInterpolate(resendMsg.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="space-y-3"><div class="space-y-1"><label class="text-sm font-semibold" for="email">${ssrInterpolate(tr("auth.fields.email", "Email"))}</label><input id="email"${ssrRenderAttr("value", email.value)} type="email" class="input w-full" autocomplete="email" required${ssrRenderAttr("placeholder", tr("auth.placeholders.email", "nom@domaine.com"))}></div><div class="space-y-1"><label class="text-sm font-semibold" for="password">${ssrInterpolate(tr("auth.fields.password", "Mot de passe"))}</label><div class="relative"><input id="password"${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password.value, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} class="input w-full pr-11" autocomplete="current-password" required${ssrRenderAttr("placeholder", tr("auth.placeholders.password", "••••••••"))}><button type="button" class="btn btn-sm btn-ghost absolute right-1 top-1"${ssrRenderAttr("aria-label", showPassword.value ? tr("auth.hidePassword", "Masquer") : tr("auth.showPassword", "Afficher"))}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: showPassword.value ? "mdi:eye-off" : "mdi:eye",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button></div></div><button class="btn btn-primary w-full" type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:login",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(loading.value ? tr("auth.login.loading", "Connexion…") : tr("auth.login.cta", "Se connecter"))}</span></button></form><div class="flex items-center justify-between text-sm">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/register"),
        class: "link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(tr("auth.login.toRegister", "Créer un compte"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(tr("auth.login.toRegister", "Créer un compte")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/forgot-password"),
        class: "link text-muted"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(tr("auth.login.forgot", "Mot de passe oublié ?"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(tr("auth.login.forgot", "Mot de passe oublié ?")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="text-xs text-muted text-center">${ssrInterpolate(tr("auth.login.note", "Astuce : votre navigateur doit accepter les cookies pour la session."))}</div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BYzaC5YM.mjs.map
