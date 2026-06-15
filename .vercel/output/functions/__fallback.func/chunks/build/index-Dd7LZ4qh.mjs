import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { c as useAuthStore, g as useRouter, a as useI18n, b as useLocalePath } from './server.mjs';
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
    useRouter();
    const { t, te } = useI18n();
    const localePath = useLocalePath();
    function tr(key, fallback) {
      return te(key) ? t(key) : fallback;
    }
    const accountType = ref("individual");
    const firstName = ref("");
    const lastName = ref("");
    const organizationName = ref("");
    const displayName = ref("");
    const profession = ref("");
    const website = ref("");
    const email = ref("");
    const password = ref("");
    const password2 = ref("");
    const showPassword = ref(false);
    const marketingOptIn = ref(false);
    const termsAccepted = ref(false);
    const loading = ref(false);
    const errorMsg = ref("");
    const passwordHint = computed(() => {
      if (!password.value) return "";
      if (password.value.length < 8) return tr("auth.register.passwordTooShort", "Mot de passe trop court (min 8).");
      if (password2.value && password.value !== password2.value) return tr("auth.register.passwordMismatch", "Les mots de passe ne correspondent pas.");
      return "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-md space-y-6" }, _attrs))}><div class="card"><div class="card-body space-y-4"><div class="space-y-1"><h1 class="text-2xl font-extrabold tracking-tight">${ssrInterpolate(tr("auth.register.title", "Créer un compte"))}</h1><p class="text-sm text-muted">${ssrInterpolate(tr("auth.register.subtitle", "Crée ton compte. Tu recevras un email de confirmation."))}</p></div>`);
      if (errorMsg.value) {
        _push(`<div class="rounded-2xl border border-border bg-surface2 p-3 text-sm" role="alert"><div class="font-semibold">${ssrInterpolate(tr("auth.register.errorTitle", "Inscription impossible"))}</div><div class="text-muted mt-1">${ssrInterpolate(errorMsg.value)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="space-y-3"><div class="space-y-1"><label class="text-sm font-semibold">${ssrInterpolate(tr("auth.register.accountType", "Type de compte"))}</label><div class="grid grid-cols-2 gap-2"><button type="button" class="${ssrRenderClass([accountType.value === "individual" ? "btn-primary" : "btn-ghost", "btn btn-sm"])}">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:account",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(tr("auth.register.accountTypeIndividual", "Particulier"))}</span></button><button type="button" class="${ssrRenderClass([accountType.value === "pro" ? "btn-primary" : "btn-ghost", "btn btn-sm"])}">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:office-building",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(tr("auth.register.accountTypePro", "Pro"))}</span></button></div><p class="text-xs text-muted">${ssrInterpolate(accountType.value === "pro" ? tr("auth.register.accountTypeProHelp", "Pour éditeurs, studios, collectifs, créateurs.") : tr("auth.register.accountTypeIndividualHelp", "Pour auteurs, scénaristes, poètes, créateurs indépendants."))}</p></div>`);
      if (accountType.value === "individual") {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><div class="space-y-1"><label class="text-sm font-semibold" for="firstName">${ssrInterpolate(tr("auth.fields.firstName", "Prénom"))}</label><input id="firstName"${ssrRenderAttr("value", firstName.value)} type="text" class="input" autocomplete="given-name"${ssrRenderAttr("placeholder", tr("auth.placeholders.firstName", "Ex: Cédric"))}></div><div class="space-y-1"><label class="text-sm font-semibold" for="lastName">${ssrInterpolate(tr("auth.fields.lastName", "Nom"))}</label><input id="lastName"${ssrRenderAttr("value", lastName.value)} type="text" class="input" autocomplete="family-name"${ssrRenderAttr("placeholder", tr("auth.placeholders.lastName", "Ex: Batina"))}></div></div>`);
      } else {
        _push(`<div class="space-y-1"><label class="text-sm font-semibold" for="organizationName">${ssrInterpolate(tr("auth.fields.organizationName", "Organisation"))} <span class="text-muted">*</span></label><input id="organizationName"${ssrRenderAttr("value", organizationName.value)} type="text" class="input" autocomplete="organization" required${ssrRenderAttr("placeholder", tr("auth.placeholders.organizationName", "Ex: Éditions … / Studio …"))}></div>`);
      }
      _push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><div class="space-y-1"><label class="text-sm font-semibold" for="displayName">${ssrInterpolate(tr("auth.fields.displayName", "Nom public"))}</label><input id="displayName"${ssrRenderAttr("value", displayName.value)} type="text" class="input"${ssrRenderAttr("placeholder", tr("auth.placeholders.displayName", "Ex: Auteur / Studio / Pseudo"))}></div><div class="space-y-1"><label class="text-sm font-semibold" for="profession">${ssrInterpolate(tr("auth.fields.profession", "Profession"))}</label><input id="profession"${ssrRenderAttr("value", profession.value)} type="text" class="input"${ssrRenderAttr("placeholder", tr("auth.placeholders.profession", "Ex: écrivain, éditeur, scénariste…"))}></div></div><div class="space-y-1"><label class="text-sm font-semibold" for="website">${ssrInterpolate(tr("auth.fields.website", "Site web"))}</label><input id="website"${ssrRenderAttr("value", website.value)} type="url" class="input" autocomplete="url"${ssrRenderAttr("placeholder", tr("auth.placeholders.website", "https://…"))}></div><div class="space-y-1"><label class="text-sm font-semibold" for="email">${ssrInterpolate(tr("auth.fields.email", "Email"))}</label><input id="email"${ssrRenderAttr("value", email.value)} type="email" class="input" autocomplete="email" required${ssrRenderAttr("placeholder", tr("auth.placeholders.email", "nom@domaine.com"))}></div><div class="space-y-1"><label class="text-sm font-semibold" for="password">${ssrInterpolate(tr("auth.fields.password", "Mot de passe"))}</label><div class="relative"><input id="password"${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password.value, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} class="input pr-11" autocomplete="new-password" required minlength="8"${ssrRenderAttr("placeholder", tr("auth.placeholders.password", "Minimum 8 caractères"))}><button type="button" class="btn btn-sm btn-ghost absolute right-1 top-1"${ssrRenderAttr("aria-label", showPassword.value ? tr("auth.hidePassword", "Masquer") : tr("auth.showPassword", "Afficher"))}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: showPassword.value ? "mdi:eye-off" : "mdi:eye",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button></div></div><div class="space-y-1"><label class="text-sm font-semibold" for="password2">${ssrInterpolate(tr("auth.fields.passwordConfirm", "Confirmer le mot de passe"))}</label><input id="password2"${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password2.value, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} class="input" autocomplete="new-password" required minlength="8"${ssrRenderAttr("placeholder", tr("auth.placeholders.passwordConfirm", "Répète le mot de passe"))}></div>`);
      if (passwordHint.value) {
        _push(`<div class="text-xs text-muted">${ssrInterpolate(passwordHint.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-start gap-2 pt-1"><input id="marketing"${ssrIncludeBooleanAttr(Array.isArray(marketingOptIn.value) ? ssrLooseContain(marketingOptIn.value, null) : marketingOptIn.value) ? " checked" : ""} type="checkbox" class="mt-1"><label for="marketing" class="text-xs text-muted">${ssrInterpolate(tr("auth.register.marketingOptIn", "Recevoir des mises à jour produit (optionnel)."))}</label></div><div class="flex items-start gap-2"><input id="terms"${ssrIncludeBooleanAttr(Array.isArray(termsAccepted.value) ? ssrLooseContain(termsAccepted.value, null) : termsAccepted.value) ? " checked" : ""} type="checkbox" class="mt-1" required><label for="terms" class="text-xs text-muted">${ssrInterpolate(tr("auth.register.terms", "J’accepte les conditions d’utilisation."))}</label></div><button class="btn btn-primary w-full" type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:account-plus",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(loading.value ? tr("auth.register.loading", "Création…") : tr("auth.register.cta", "Créer mon compte"))}</span></button></form><div class="text-sm"><span class="text-muted">${ssrInterpolate(tr("auth.register.haveAccount", "Déjà un compte ?"))}</span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/login"),
        class: "link ml-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(tr("auth.register.toLogin", "Se connecter"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(tr("auth.register.toLogin", "Se connecter")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="text-xs text-muted text-center">${ssrInterpolate(tr("auth.register.note", "Tu devras confirmer ton email avant de pouvoir te connecter."))}</div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dd7LZ4qh.mjs.map
