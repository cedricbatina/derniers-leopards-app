import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a as useI18n, b as useLocalePath } from './server.mjs';
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
    const { t, te } = useI18n();
    const localePath = useLocalePath();
    function tr(key, fallback) {
      return te(key) ? t(key) : fallback;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-lg space-y-6" }, _attrs))}><div class="card overflow-hidden"><div class="card-body space-y-5"><p class="badge w-fit">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:shield-check",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(tr("auth.verifySuccess.kicker", "Sécurité & accès"))}</p><div class="space-y-2"><h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">${ssrInterpolate(tr("auth.verifySuccess.title", "Adresse email confirmée"))}</h1><p class="text-sm sm:text-base text-muted">${ssrInterpolate(tr("auth.verifySuccess.subtitle", "Votre compte est désormais activé. Vous pouvez vous connecter."))}</p></div><div class="rounded-2xl border border-border bg-surface2 p-4 space-y-2 text-sm"><div class="font-semibold flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:information-outline",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(tr("auth.verifySuccess.next.title", "Prochaine étape"))}</div><ul class="list-disc pl-5 text-muted space-y-1"><li>${ssrInterpolate(tr("auth.verifySuccess.next.item1", "Connectez-vous pour accéder à votre espace."))}</li><li>${ssrInterpolate(tr("auth.verifySuccess.next.item2", "Vous pourrez ensuite compléter votre profil et commencer à travailler."))}</li></ul></div><div class="flex flex-col sm:flex-row gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/login"),
        class: "btn btn-primary w-full focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:login",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(tr("auth.verifySuccess.toLogin", "Se connecter"))}</span>`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:login",
                "aria-hidden": "true"
              }),
              createVNode("span", null, toDisplayString(tr("auth.verifySuccess.toLogin", "Se connecter")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/"),
        class: "btn btn-ghost w-full focus-ring"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:home-outline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(tr("auth.verifySuccess.toHome", "Retour à l’accueil"))}</span>`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:home-outline",
                "aria-hidden": "true"
              }),
              createVNode("span", null, toDisplayString(tr("auth.verifySuccess.toHome", "Retour à l’accueil")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><p class="text-xs text-muted text-center">${ssrInterpolate(tr("auth.verifySuccess.note", "Si vous rencontrez un problème, vous pouvez relancer la connexion ou demander un nouvel email de confirmation."))}</p></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/verify-email/success.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=success-Q2VyJTxY.mjs.map
