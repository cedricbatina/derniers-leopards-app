import { _ as __nuxt_component_0 } from './nuxt-link-CVOQNIrk.mjs';
import { computed, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, ref, useAttrs, useTemplateRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderSlot, ssrRenderClass } from 'vue/server-renderer';
import { a8 as defu, al as withLeadingSlash, V as hasProtocol, X as joinURL, a5 as parseURL, am as encodeParam, an as encodePath } from '../nitro/nitro.mjs';
import { c as useAuthStore, a as useI18n, b as useLocalePath, h as useSwitchLocalePath, q as useState, u as useHead, i as useNuxtApp, d as useRuntimeConfig, _ as __nuxt_component_1$1 } from './server.mjs';
import { _ as __nuxt_component_2 } from './index-CqX1hnUF.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { useRouter } from 'vue-router';
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
import 'jose';
import '@iconify/utils';
import 'consola';
import 'node:url';
import 'ipx';
import 'pinia';
import '@iconify/vue';
import 'tailwindcss/colors';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';

const useColorMode = () => {
  return useState("color-mode").value;
};
async function imageMeta(_ctx, url) {
  const meta = await _imageMeta(url).catch((err) => {
    console.error("Failed to get image meta for " + url, err + "");
    return {
      width: 0,
      height: 0,
      ratio: 0
    };
  });
  return meta;
}
async function _imageMeta(url) {
  {
    const imageMeta2 = await import('image-meta').then((r) => r.imageMeta);
    const data = await fetch(url).then((res) => res.buffer());
    const metadata = imageMeta2(data);
    if (!metadata) {
      throw new Error(`No metadata could be extracted from the image \`${url}\`.`);
    }
    const { width, height } = metadata;
    const meta = {
      width,
      height,
      ratio: width && height ? width / height : void 0
    };
    return meta;
  }
}
function createMapper(map) {
  return ((key) => key !== void 0 ? map[key] || key : map.missingValue);
}
function createOperationsGenerator(config = {}) {
  const formatter = config.formatter;
  const keyMap = config.keyMap && typeof config.keyMap !== "function" ? createMapper(config.keyMap) : config.keyMap;
  const map = {};
  for (const key in config.valueMap) {
    const valueKey = key;
    const value = config.valueMap[valueKey];
    map[valueKey] = typeof value === "object" ? createMapper(value) : value;
  }
  return (modifiers) => {
    const operations = [];
    for (const _key in modifiers) {
      const key = _key;
      if (typeof modifiers[key] === "undefined") {
        continue;
      }
      const value = typeof map[key] === "function" ? map[key](modifiers[key]) : modifiers[key];
      operations.push([keyMap ? keyMap(key) : key, value]);
    }
    if (formatter) {
      return operations.map((entry) => formatter(...entry)).join(config.joinWith ?? "&");
    }
    return new URLSearchParams(operations).toString();
  };
}
function parseDensities(input = "") {
  if (input === void 0 || !input.length) {
    return [];
  }
  const densities = /* @__PURE__ */ new Set();
  for (const density of input.split(" ")) {
    const d = Number.parseInt(density.replace("x", ""));
    if (d) {
      densities.add(d);
    }
  }
  return Array.from(densities);
}
function checkDensities(densities) {
  if (densities.length === 0) {
    throw new Error("`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)");
  }
}
function parseSize(input = "") {
  if (typeof input === "number") {
    return input;
  }
  if (typeof input === "string") {
    if (input.replace("px", "").match(/^\d+$/g)) {
      return Number.parseInt(input, 10);
    }
  }
}
function parseSizes(input) {
  const sizes = {};
  if (typeof input === "string") {
    for (const entry of input.split(/[\s,]+/).filter((e) => e)) {
      const s = entry.split(":");
      if (s.length !== 2) {
        sizes["1px"] = s[0].trim();
      } else {
        sizes[s[0].trim()] = s[1].trim();
      }
    }
  } else {
    Object.assign(sizes, input);
  }
  return sizes;
}
function createImage(globalOptions) {
  const ctx = {
    options: globalOptions
  };
  const getImage = (input, options = {}) => {
    const image = resolveImage(ctx, input, options);
    return image;
  };
  const $img = ((input, modifiers, options) => getImage(input, defu({ modifiers }, options)).url);
  for (const presetName in globalOptions.presets) {
    $img[presetName] = ((source, modifiers, options) => $img(source, modifiers, { ...globalOptions.presets[presetName], ...options }));
  }
  $img.options = globalOptions;
  $img.getImage = getImage;
  $img.getMeta = ((input, options) => getMeta(ctx, input, options));
  $img.getSizes = ((input, options) => getSizes(ctx, input, options));
  ctx.$img = $img;
  return $img;
}
async function getMeta(ctx, input, options) {
  const image = resolveImage(ctx, input, { ...options });
  if (typeof image.getMeta === "function") {
    return await image.getMeta();
  } else {
    return await imageMeta(ctx, image.url);
  }
}
function resolveImage(ctx, input, options) {
  if (input && typeof input !== "string") {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`);
  }
  if (!input || input.startsWith("data:")) {
    return {
      url: input
    };
  }
  const { setup, defaults } = getProvider(ctx, options.provider || ctx.options.provider);
  const provider = setup();
  const preset = getPreset(ctx, options.preset);
  input = hasProtocol(input) ? input : withLeadingSlash(input);
  if (!provider.supportsAlias) {
    for (const base in ctx.options.alias) {
      if (input.startsWith(base)) {
        const alias = ctx.options.alias[base];
        if (alias) {
          input = joinURL(alias, input.slice(base.length));
        }
      }
    }
  }
  if (provider.validateDomains && hasProtocol(input)) {
    const inputHost = parseURL(input).host;
    if (!ctx.options.domains.find((d) => d === inputHost)) {
      return {
        url: input
      };
    }
  }
  const _options = defu(options, preset, defaults);
  const resolvedOptions = {
    ..._options,
    modifiers: {
      ..._options.modifiers,
      width: _options.modifiers?.width ? parseSize(_options.modifiers.width) : void 0,
      height: _options.modifiers?.height ? parseSize(_options.modifiers.height) : void 0
    }
  };
  const image = provider.getImage(input, resolvedOptions, ctx);
  image.format ||= resolvedOptions.modifiers.format || "";
  return image;
}
function getProvider(ctx, name) {
  const provider = ctx.options.providers[name];
  if (!provider) {
    throw new Error("Unknown provider: " + name);
  }
  return provider;
}
function getPreset(ctx, name) {
  if (!name) {
    return {};
  }
  if (!ctx.options.presets[name]) {
    throw new Error("Unknown preset: " + name);
  }
  return ctx.options.presets[name];
}
function getSizes(ctx, input, opts) {
  const preset = getPreset(ctx, opts.preset);
  const merged = defu(opts, preset);
  const width = parseSize(merged.modifiers?.width);
  const height = parseSize(merged.modifiers?.height);
  const sizes = merged.sizes ? parseSizes(merged.sizes) : {};
  const _densities = merged.densities?.trim();
  const densities = _densities ? parseDensities(_densities) : ctx.options.densities;
  checkDensities(densities);
  const hwRatio = width && height ? height / width : 0;
  const sizeVariants = [];
  const srcsetVariants = [];
  if (Object.keys(sizes).length >= 1) {
    for (const key in sizes) {
      const variant = getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx);
      if (variant === void 0) {
        continue;
      }
      sizeVariants.push({
        size: variant.size,
        screenMaxWidth: variant.screenMaxWidth,
        media: `(max-width: ${variant.screenMaxWidth}px)`
      });
      for (const density of densities) {
        srcsetVariants.push({
          width: variant._cWidth * density,
          src: getVariantSrc(ctx, input, opts, variant, density)
        });
      }
    }
    finaliseSizeVariants(sizeVariants);
  } else {
    for (const density of densities) {
      const key = Object.keys(sizes)[0];
      let variant = key ? getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx) : void 0;
      if (variant === void 0) {
        variant = {
          size: "",
          screenMaxWidth: 0,
          _cWidth: opts.modifiers?.width,
          _cHeight: opts.modifiers?.height
        };
      }
      srcsetVariants.push({
        width: density,
        src: getVariantSrc(ctx, input, opts, variant, density)
      });
    }
  }
  finaliseSrcsetVariants(srcsetVariants);
  const defaultVariant = srcsetVariants[srcsetVariants.length - 1];
  const sizesVal = sizeVariants.length ? sizeVariants.map((v) => `${v.media ? v.media + " " : ""}${v.size}`).join(", ") : void 0;
  const suffix = sizesVal ? "w" : "x";
  const srcsetVal = srcsetVariants.map((v) => `${v.src} ${v.width}${suffix}`).join(", ");
  return {
    sizes: sizesVal,
    srcset: srcsetVal,
    src: defaultVariant?.src
  };
}
function getSizesVariant(key, size, height, hwRatio, ctx) {
  const screenMaxWidth = ctx.options.screens && ctx.options.screens[key] || Number.parseInt(key);
  const isFluid = size.endsWith("vw");
  if (!isFluid && /^\d+$/.test(size)) {
    size = size + "px";
  }
  if (!isFluid && !size.endsWith("px")) {
    return void 0;
  }
  let _cWidth = Number.parseInt(size);
  if (!screenMaxWidth || !_cWidth) {
    return void 0;
  }
  if (isFluid) {
    _cWidth = Math.round(_cWidth / 100 * screenMaxWidth);
  }
  const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height;
  return {
    size,
    screenMaxWidth,
    _cWidth,
    _cHeight
  };
}
function getVariantSrc(ctx, input, opts, variant, density) {
  return ctx.$img(
    input,
    {
      ...opts.modifiers,
      width: variant._cWidth ? variant._cWidth * density : void 0,
      height: variant._cHeight ? variant._cHeight * density : void 0
    },
    opts
  );
}
function finaliseSizeVariants(sizeVariants) {
  sizeVariants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth);
  let previousMedia = null;
  for (let i = sizeVariants.length - 1; i >= 0; i--) {
    const sizeVariant = sizeVariants[i];
    if (sizeVariant.media === previousMedia) {
      sizeVariants.splice(i, 1);
    }
    previousMedia = sizeVariant.media;
  }
  for (let i = 0; i < sizeVariants.length; i++) {
    sizeVariants[i].media = sizeVariants[i + 1]?.media || "";
  }
}
function finaliseSrcsetVariants(srcsetVariants) {
  srcsetVariants.sort((v1, v2) => v1.width - v2.width);
  let previousWidth = null;
  for (let i = srcsetVariants.length - 1; i >= 0; i--) {
    const sizeVariant = srcsetVariants[i];
    if (sizeVariant.width === previousWidth) {
      srcsetVariants.splice(i, 1);
    }
    previousWidth = sizeVariant.width;
  }
}
function defineProvider(setup) {
  let result;
  return () => {
    if (result) {
      return result;
    }
    result = typeof setup === "function" ? setup() : setup;
    return result;
  };
}
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: "f",
    width: "w",
    height: "h",
    resize: "s",
    quality: "q",
    background: "b",
    position: "pos"
  },
  formatter: (key, val) => encodeParam(key) + "_" + encodeParam(val.toString())
});
const ipxRuntime$xb8d2Pohs67_45sR9Og6ZCvAAeN6jQh5DsnDAdcLqgNa0 = defineProvider({
  validateDomains: true,
  supportsAlias: true,
  getImage: (src, { modifiers, baseURL }, ctx) => {
    if (modifiers.width && modifiers.height) {
      modifiers.resize = `${modifiers.width}x${modifiers.height}`;
      delete modifiers.width;
      delete modifiers.height;
    }
    const params = operationsGenerator(modifiers) || "_";
    if (!baseURL) {
      baseURL = joinURL(ctx.options.nuxt.baseURL, "/_ipx");
    }
    return {
      url: joinURL(baseURL, params, encodePath(src))
    };
  }
});
const imageOptions = {
  ...{
    "screens": {
      "sm": 640,
      "md": 768,
      "lg": 1024,
      "xl": 1280,
      "2xl": 1536
    },
    "presets": {},
    "provider": "ipx",
    "domains": [],
    "alias": {},
    "densities": [
      1,
      2
    ],
    "format": [
      "webp"
    ]
  },
  /** @type {"ipx"} */
  provider: "ipx",
  providers: {
    ["ipx"]: { setup: ipxRuntime$xb8d2Pohs67_45sR9Og6ZCvAAeN6jQh5DsnDAdcLqgNa0, defaults: {} }
  }
};
const useImage = (event) => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  return nuxtApp.$img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    event: nuxtApp.ssrContext?.event,
    nuxt: {
      baseURL: config.app.baseURL
    },
    runtimeConfig: config
  }));
};
const useImageProps = (props) => {
  const $img = useImage();
  const providerOptions = computed(() => ({
    provider: props.provider,
    preset: props.preset
  }));
  const normalizedAttrs = computed(() => ({
    width: parseSize(props.width),
    height: parseSize(props.height),
    crossorigin: props.crossorigin === true ? "anonymous" : props.crossorigin || void 0,
    nonce: props.nonce
  }));
  const imageModifiers = computed(() => {
    return {
      ...props.modifiers,
      width: props.width,
      height: props.height,
      format: props.format,
      quality: props.quality || $img.options.quality,
      background: props.background,
      fit: props.fit
    };
  });
  return { providerOptions, normalizedAttrs, imageModifiers };
};
const _sfc_main$2 = {
  __name: "NuxtImg",
  __ssrInlineRender: true,
  props: {
    custom: { type: Boolean, required: false },
    placeholder: { type: [Boolean, String, Number, Array], required: false },
    placeholderClass: { type: String, required: false },
    src: { type: String, required: false },
    format: { type: String, required: false },
    quality: { type: [String, Number], required: false },
    background: { type: String, required: false },
    fit: { type: String, required: false },
    modifiers: { type: Object, required: false },
    preset: { type: String, required: false },
    provider: { type: null, required: false },
    sizes: { type: [String, Object], required: false },
    densities: { type: String, required: false },
    preload: { type: [Boolean, Object], required: false },
    width: { type: [String, Number], required: false },
    height: { type: [String, Number], required: false },
    crossorigin: { type: [String, Boolean], required: false },
    nonce: { type: String, required: false }
  },
  emits: ["load", "error"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const $img = useImage();
    const { providerOptions, normalizedAttrs, imageModifiers } = useImageProps(props);
    const sizes = computed(() => $img.getSizes(props.src, {
      ...providerOptions.value,
      sizes: props.sizes,
      densities: props.densities,
      modifiers: imageModifiers.value
    }));
    const placeholderLoaded = ref(false);
    const attrs = useAttrs();
    const imgAttrs = computed(() => ({
      ...normalizedAttrs.value,
      "data-nuxt-img": "",
      ...!props.placeholder || placeholderLoaded.value ? { sizes: sizes.value.sizes, srcset: sizes.value.srcset } : {},
      ...{ onerror: "this.setAttribute('data-error', 1)" },
      ...attrs
    }));
    const placeholder = computed(() => {
      if (placeholderLoaded.value) {
        return false;
      }
      const placeholder2 = props.placeholder === "" ? [10, 10] : props.placeholder;
      if (!placeholder2) {
        return false;
      }
      if (typeof placeholder2 === "string") {
        return placeholder2;
      }
      const [width = 10, height = width, quality = 50, blur = 3] = Array.isArray(placeholder2) ? placeholder2 : typeof placeholder2 === "number" ? [placeholder2] : [];
      return $img(props.src, {
        ...imageModifiers.value,
        width,
        height,
        quality,
        blur
      }, providerOptions.value);
    });
    const mainSrc = computed(
      () => props.sizes ? sizes.value.src : $img(props.src, imageModifiers.value, providerOptions.value)
    );
    const src = computed(() => placeholder.value || mainSrc.value);
    if (props.preload) {
      const hasMultipleDensities = sizes.value.srcset.includes("x, ");
      const isResponsive = hasMultipleDensities || !!sizes.value.sizes;
      useHead({
        link: [{
          rel: "preload",
          as: "image",
          nonce: props.nonce,
          crossorigin: normalizedAttrs.value.crossorigin,
          href: isResponsive ? sizes.value.src : src.value,
          ...sizes.value.sizes && { imagesizes: sizes.value.sizes },
          ...hasMultipleDensities && { imagesrcset: sizes.value.srcset },
          ...typeof props.preload !== "boolean" && props.preload.fetchPriority ? { fetchpriority: props.preload.fetchPriority } : {}
        }]
      });
    }
    useNuxtApp().isHydrating;
    const imgEl = useTemplateRef("imgEl");
    __expose({ imgEl });
    return (_ctx, _push, _parent, _attrs) => {
      if (!__props.custom) {
        _push(`<img${ssrRenderAttrs(mergeProps({
          ref_key: "imgEl",
          ref: imgEl,
          class: placeholder.value ? __props.placeholderClass : void 0
        }, imgAttrs.value, { src: src.value }, _attrs))}>`);
      } else {
        ssrRenderSlot(_ctx.$slots, "default", {
          imgAttrs: imgAttrs.value,
          isLoaded: placeholderLoaded.value,
          src: src.value
        }, null, _push, _parent);
      }
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$2, { __name: "NuxtImg" });
function useDateUtils() {
  let i18n = null;
  try {
    i18n = useI18n();
  } catch {
    i18n = null;
  }
  const getLocale = () => i18n?.locale?.value || "fr";
  const safeDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const formatDate = (dateStr) => {
    const d = safeDate(dateStr);
    if (!d) return "";
    return d.toLocaleDateString(getLocale(), {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };
  const formattedDate = (dateStr) => {
    const d = safeDate(dateStr);
    if (!d) return "";
    return d.toLocaleString(getLocale(), {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const formattedDateTimeWithSeconds = (dateStr) => {
    const d = safeDate(dateStr);
    if (!d) return "";
    return d.toLocaleString(getLocale(), {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };
  const formatDateISO = (date) => {
    if (!date) return "2025-01-01T00:00:00Z";
    try {
      return new Date(date).toISOString();
    } catch {
      return "2025-01-01T00:00:00Z";
    }
  };
  const formattedHourMinute = (dateStr) => {
    const d = safeDate(dateStr);
    if (!d) return "";
    return d.toLocaleTimeString(getLocale(), {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const getCountdownString = (date) => {
    const d = safeDate(date);
    if (!d) return "Date non définie";
    const now = /* @__PURE__ */ new Date();
    const distance = d - now;
    if (distance < 0) return "Session commencée";
    const days = Math.floor(distance / (1e3 * 60 * 60 * 24));
    const hours = Math.floor(distance / (1e3 * 60 * 60) % 24);
    const minutes = Math.floor(distance / (1e3 * 60) % 60);
    const seconds = Math.floor(distance / 1e3 % 60);
    return `${days} jours ${hours}h ${minutes}min ${seconds}s`;
  };
  const timeAgo = (inputDate) => {
    const d = safeDate(inputDate);
    if (!d) return "";
    const now = /* @__PURE__ */ new Date();
    const diff = (now - d) / 1e3;
    if (diff < 60) return "il y a quelques secondes";
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} mn`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
    if (diff < 2592e3) return `il y a ${Math.floor(diff / 86400)} jours`;
    if (diff < 31536e3) return `il y a ${Math.floor(diff / 2592e3)} mois`;
    return `${Math.floor(diff / 31536e3)} ans`;
  };
  const shortDate = (dateStr) => {
    const d = safeDate(dateStr);
    if (!d) return "";
    return d.toLocaleDateString(getLocale(), {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
    });
  };
  const toDateInput = (value) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = safeDate(value);
    if (!d) return String(value).slice(0, 10);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const toDateTimeLocalInput = (value) => {
    if (!value) return "";
    const d = safeDate(
      typeof value === "string" ? value.replace(" ", "T") : value
    );
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const normalizeDateTimeLocal = (value) => {
    if (!value) return null;
    const [date, time] = value.split("T");
    if (!date || !time) return value;
    const tPart = time.length === 5 ? `${time}:00` : time;
    return `${date} ${tPart}`;
  };
  return {
    timeAgo,
    shortDate,
    formatDate,
    formattedDate,
    formatDateISO,
    getCountdownString,
    formattedHourMinute,
    formattedDateTimeWithSeconds,
    safeDate,
    toDateInput,
    toDateTimeLocalInput,
    normalizeDateTimeLocal
  };
}
const _sfc_main$1 = {
  __name: "UserInlineCard",
  __ssrInlineRender: true,
  props: {
    user: { type: Object, default: null }
  },
  emits: ["go-dashboard", "logout", "login", "register"],
  setup(__props) {
    const props = __props;
    const { t, te } = useI18n();
    const { formattedDateTimeWithSeconds } = useDateUtils();
    function tr(key, fallback, params) {
      return te(key) ? t(key, params) : fallback;
    }
    const isAuthed = computed(() => !!props.user?.id);
    const now = ref(/* @__PURE__ */ new Date());
    computed(() => formattedDateTimeWithSeconds(now.value));
    const onlineLabel = computed(
      () => isAuthed.value ? tr("userInline.status.online", "Connecté") : tr("userInline.status.offline", "Hors ligne")
    );
    const accountType = computed(() => {
      const u = props.user;
      return String(u?.account_type || u?.accountType || "").toLowerCase().trim();
    });
    const primaryName = computed(() => {
      const u = props.user;
      if (!u) return "";
      if (accountType.value === "pro") {
        const org = u.organization_name || u.organizationName;
        if (org) return String(org);
      }
      if (accountType.value === "individual") {
        const full = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
        if (full) return full;
      }
      const dn = u.display_name || u.displayName;
      if (dn) return String(dn);
      if (u.username) return String(u.username);
      if (u.email) return String(u.email);
      return tr("userInline.fallbackUser", "Utilisateur");
    });
    const secondaryName = computed(() => {
      const u = props.user;
      if (!u) return "";
      const dn = (u.display_name || u.displayName || "").toString().trim();
      const username = (u.username || "").toString().trim();
      const email = (u.email || "").toString().trim();
      if (accountType.value === "pro") {
        const candidate2 = dn || email || username;
        if (!candidate2) return "";
        if (candidate2 === primaryName.value) return "";
        return candidate2;
      }
      const candidate = dn || username || email;
      if (!candidate) return "";
      if (candidate === primaryName.value) return "";
      return candidate;
    });
    const avatarUrl = computed(() => {
      const u = props.user;
      return u?.avatar_url || u?.avatarUrl || null;
    });
    const initials = computed(() => {
      const u = props.user;
      if (!u) return "";
      const base = primaryName.value || (u.email || "U");
      const parts = String(base).trim().split(/\s+/).slice(0, 2);
      return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
    });
    const roles = computed(() => {
      const u = props.user;
      if (!u) return [];
      if (Array.isArray(u.roles)) return u.roles.filter(Boolean);
      if (u.role) return [String(u.role)];
      if (u.primary_role) return [String(u.primary_role)];
      return [];
    });
    const primaryRole = computed(() => {
      const r = roles.value.map((x) => String(x).toLowerCase());
      if (r.includes("admin")) return "admin";
      if (r.includes("editor")) return "editor";
      return r[0] || "user";
    });
    const roleLabel = computed(() => {
      const r = primaryRole.value;
      if (r === "admin") return tr("userInline.role.admin", "Admin");
      if (r === "editor") return tr("userInline.role.editor", "Éditeur");
      return tr("userInline.role.standard", "Compte standard");
    });
    const roleIcon = computed(() => {
      const r = primaryRole.value;
      if (r === "admin") return "mdi:shield-crown-outline";
      if (r === "editor") return "mdi:pencil-outline";
      return "mdi:account-circle-outline";
    });
    const accountTypeLabel = computed(() => {
      if (accountType.value === "pro") return tr("userInline.accountType.pro", "Compte Pro");
      if (accountType.value === "individual") return tr("userInline.accountType.individual", "Particulier");
      return "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2;
      const _component_ClientOnly = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "user-inline-card",
        "aria-live": "polite"
      }, _attrs))} data-v-57fb98f3><div class="user-inline-main" data-v-57fb98f3><span class="status-dot"${ssrRenderAttr("title", onlineLabel.value)} data-v-57fb98f3><span class="${ssrRenderClass([{ "status-indicator--online": isAuthed.value }, "status-indicator"])}" data-v-57fb98f3></span></span>`);
      if (isAuthed.value) {
        _push(`<div class="user-inline-avatar" aria-hidden="true" data-v-57fb98f3>`);
        if (avatarUrl.value) {
          _push(`<img${ssrRenderAttr("src", avatarUrl.value)} alt="" class="user-inline-avatar__img" loading="lazy" data-v-57fb98f3>`);
        } else {
          _push(`<div class="user-inline-avatar__fallback" data-v-57fb98f3>${ssrInterpolate(initials.value)}</div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="user-inline-text" data-v-57fb98f3><p class="user-inline-primary" data-v-57fb98f3>`);
      if (isAuthed.value) {
        _push(`<span data-v-57fb98f3>${ssrInterpolate(primaryName.value)}</span>`);
      } else {
        _push(`<span data-v-57fb98f3>${ssrInterpolate(tr("userInline.guestLabel", "Invité"))}</span>`);
      }
      _push(`</p><p class="user-inline-secondary" data-v-57fb98f3>`);
      if (isAuthed.value) {
        _push(`<div class="user-inline-secondary__line" data-v-57fb98f3>`);
        if (secondaryName.value) {
          _push(`<span class="user-inline-subname" data-v-57fb98f3>${ssrInterpolate(secondaryName.value)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="user-inline-badges" data-v-57fb98f3><span class="badge badge--soft" data-v-57fb98f3>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: roleIcon.value,
          "aria-hidden": "true"
        }, null, _parent));
        _push(` ${ssrInterpolate(roleLabel.value)}</span>`);
        if (accountTypeLabel.value) {
          _push(`<span class="badge badge--soft" data-v-57fb98f3>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "mdi:briefcase-outline",
            "aria-hidden": "true"
          }, null, _parent));
          _push(` ${ssrInterpolate(accountTypeLabel.value)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span></div>`);
      } else {
        _push(`<span data-v-57fb98f3>${ssrInterpolate(tr("userInline.guestHelper", "Connectez-vous pour accéder à votre espace."))}</span>`);
      }
      _push(`</p></div><div class="user-inline-actions" data-v-57fb98f3>`);
      if (isAuthed.value) {
        _push(`<!--[--><button type="button" class="btn btn-ghost btn-sm user-inline-btn" data-v-57fb98f3>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:view-dashboard-outline",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`<span data-v-57fb98f3>${ssrInterpolate(tr("userInline.dashboard", "Tableau de bord"))}</span></button><button type="button" class="btn btn-ghost btn-sm user-inline-btn" data-v-57fb98f3>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:logout",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`<span data-v-57fb98f3>${ssrInterpolate(tr("userInline.logout", "Déconnexion"))}</span></button><!--]-->`);
      } else {
        _push(`<!--[--><button type="button" class="btn btn-ghost btn-sm user-inline-btn" data-v-57fb98f3>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:login",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`<span data-v-57fb98f3>${ssrInterpolate(tr("userInline.login", "Connexion"))}</span></button><button type="button" class="btn btn-primary btn-sm user-inline-btn" data-v-57fb98f3>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:account-plus",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`<span data-v-57fb98f3>${ssrInterpolate(tr("userInline.register", "Créer un compte"))}</span></button><!--]-->`);
      }
      _push(`</div></div><div class="user-inline-meta" data-v-57fb98f3>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserInlineCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-57fb98f3"]]);
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const auth = useAuthStore();
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const switchLocalePath = useSwitchLocalePath();
    const colorMode = useColorMode();
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const isAuthed = computed(() => !!auth.user?.id);
    function goDashboard() {
      router.push("/characters");
    }
    function goNotifications() {
      router.push("/notifications");
    }
    async function handleLogout() {
      await auth.logout();
      router.push("/login");
    }
    function goLogin() {
      router.push("/login");
    }
    function goRegister() {
      router.push("/register");
    }
    const themeTitle = computed(() => {
      if (colorMode.preference === "system") return t("theme.toDark");
      if (colorMode.preference === "dark") return t("theme.toLight");
      return t("theme.toSystem");
    });
    const themeModeLabel = computed(() => t(`theme.modes.${colorMode.preference}`));
    const themeAria = computed(
      () => t("theme.aria", { mode: themeModeLabel.value, action: themeTitle.value })
    );
    const themeIcon = computed(
      () => colorMode.value === "dark" ? "mdi:weather-sunny" : "mdi:weather-night"
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_1;
      const _component_Icon = __nuxt_component_2;
      const _component_UserInlineCard = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-dvh bg-fun" }, _attrs))}><a href="#main" class="skip-link">${ssrInterpolate(unref(t)("a11y.skipToContent"))}</a><header><div class="topbar"><div class="container-app flex items-center justify-between py-3 gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/"),
        class: "flex items-center gap-3 focus-ring rounded-xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtImg, {
              src: "/images/logo-sonekeno.png",
              width: "80",
              height: "80",
              decoding: "async",
              class: "h-20 w-20 rounded-2xl border border-border bg-transparent object-contain shadow-soft",
              alt: unref(t)("app.logoAlt")
            }, null, _parent2, _scopeId));
            _push2(`<div class="leading-tight"${_scopeId}><div class="font-extrabold tracking-tight"${_scopeId}>${ssrInterpolate(unref(t)("app.name"))}</div><div class="text-xs text-muted"${_scopeId}>${ssrInterpolate(unref(t)("app.tagline"))}</div></div>`);
          } else {
            return [
              createVNode(_component_NuxtImg, {
                src: "/images/logo-sonekeno.png",
                width: "80",
                height: "80",
                decoding: "async",
                class: "h-20 w-20 rounded-2xl border border-border bg-transparent object-contain shadow-soft",
                alt: unref(t)("app.logoAlt")
              }, null, 8, ["alt"]),
              createVNode("div", { class: "leading-tight" }, [
                createVNode("div", { class: "font-extrabold tracking-tight" }, toDisplayString(unref(t)("app.name")), 1),
                createVNode("div", { class: "text-xs text-muted" }, toDisplayString(unref(t)("app.tagline")), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-2"><div class="flex items-center gap-1 rounded-full border border-border bg-surface2 p-1"${ssrRenderAttr("aria-label", unref(t)("lang.label"))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(switchLocalePath)("fr"),
        class: ["lang-chip", { "lang-chip--active": unref(locale) === "fr" }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("lang.fr"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("lang.fr")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(switchLocalePath)("en"),
        class: ["lang-chip", { "lang-chip--active": unref(locale) === "en" }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("lang.en"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("lang.en")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(switchLocalePath)("pt"),
        class: ["lang-chip", { "lang-chip--active": unref(locale) === "pt" }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("lang.pt"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("lang.pt")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><button class="btn btn-ghost btn-icon focus-ring" type="button"${ssrRenderAttr("aria-label", themeAria.value)}${ssrRenderAttr("title", themeTitle.value)}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: themeIcon.value,
        "aria-hidden": "true",
        class: "text-lg"
      }, null, _parent));
      _push(`</button></div></div><div class="divider"></div></div><div class="container-app py-3">`);
      _push(ssrRenderComponent(_component_UserInlineCard, {
        user: unref(auth).user,
        "is-authenticated": isAuthed.value,
        onGoDashboard: goDashboard,
        onGoNotifications: goNotifications,
        onLogout: handleLogout,
        onLogin: goLogin,
        onRegister: goRegister
      }, null, _parent));
      _push(`</div><div class="container-app pb-3"><nav class="flex flex-wrap gap-2"${ssrRenderAttr("aria-label", unref(t)("nav.aria"))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/characters"),
        class: "pill",
        "active-class": "pill-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:account-group",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(unref(t)("nav.characters"))}</span>`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:account-group",
                "aria-hidden": "true"
              }),
              createVNode("span", null, toDisplayString(unref(t)("nav.characters")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/scenes"),
        class: "pill",
        "active-class": "pill-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:movie-open",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(unref(t)("nav.scenes"))}</span>`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:movie-open",
                "aria-hidden": "true"
              }),
              createVNode("span", null, toDisplayString(unref(t)("nav.scenes")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/timeline"),
        class: "pill",
        "active-class": "pill-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:timeline",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(unref(t)("nav.timeline"))}</span>`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:timeline",
                "aria-hidden": "true"
              }),
              createVNode("span", null, toDisplayString(unref(t)("nav.timeline")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/glossary"),
        class: "pill",
        "active-class": "pill-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:book-open-page-variant",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(unref(t)("nav.glossary"))}</span>`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "mdi:book-open-page-variant",
                "aria-hidden": "true"
              }),
              createVNode("span", null, toDisplayString(unref(t)("nav.glossary")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div></header><main id="main" class="page">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="container-app pb-10 text-sm text-muted"><div class="divider my-6"></div><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div>${ssrInterpolate(unref(t)("footer.rights", { year: unref(year) }))}</div><div class="flex flex-wrap items-center gap-2"><span class="badge">${ssrInterpolate(unref(t)("footer.tags.mobile"))}</span><span class="badge">${ssrInterpolate(unref(t)("footer.tags.multilang"))}</span><span class="badge">${ssrInterpolate(unref(t)("footer.tags.offline"))}</span><span class="badge">${ssrInterpolate(unref(t)("footer.tags.search"))}</span></div></div></footer></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-1qQkIWu8.mjs.map
