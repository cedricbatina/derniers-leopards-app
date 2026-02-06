<template>
  <div ref="root" class="bm-user-inline" :class="{ 'is-open': open }">
    <button
      type="button"
      class="bm-user-chip bm-btn bm-btn-outline bm-btn-sm"
      :aria-expanded="open ? 'true' : 'false'"
      aria-haspopup="menu"
      @click="toggle"
    >
      <span class="bm-user-avatar" aria-hidden="true">
        <img v-if="avatarUrl" :src="avatarUrl" alt="" class="bm-user-avatar__img" />
        <span v-else class="bm-user-avatar__initials">{{ initials }}</span>
      </span>

      <span class="bm-user-chip__label">
        <span v-if="loading" class="bm-user-chip__skeleton" aria-hidden="true" />
        <span v-else>{{ chipLabel }}</span>
      </span>

      <Icon name="mdi:chevron-down" class="bm-user-chip__chev" aria-hidden="true" />
    </button>

    <div v-if="open" class="bm-user-menu bm-card bm-card-compact" role="menu">
      <div v-if="loading" class="bm-user-menu__loading">
        <p class="bm-text-soft">{{ t('user.menu.loading') }}</p>
      </div>

      <template v-else-if="user">
        <div class="bm-user-menu__header">
          <div class="bm-user-menu__identity">
            <p class="bm-user-menu__name">{{ displayName }}</p>
            <p class="bm-user-menu__email bm-text-muted">{{ user.email }}</p>
          </div>
        </div>

        <div class="bm-user-menu__divider" />

        <div class="bm-user-menu__actions" role="none">
          <NuxtLink
            v-if="showAccountLink"
            to="/account"
            class="bm-btn bm-btn-outline bm-btn-sm"
            role="menuitem"
            @click="close"
          >
            {{ t('user.menu.account') }}
          </NuxtLink>

          <button
            type="button"
            class="bm-btn bm-btn-outline bm-btn-sm"
            role="menuitem"
            @click="onLogout"
          >
            {{ t('user.menu.logout') }}
          </button>
        </div>
      </template>

      <template v-else>
        <div class="bm-user-menu__header">
          <p class="bm-user-menu__name">{{ t('user.menu.guestTitle') }}</p>
          <p class="bm-text-soft">{{ t('user.menu.guestSubtitle') }}</p>
        </div>

        <div class="bm-user-menu__divider" />

        <div class="bm-user-menu__actions" role="none">
          <NuxtLink
            to="/login"
            class="bm-btn bm-btn-primary bm-btn-sm"
            role="menuitem"
            @click="close"
          >
            {{ t('user.menu.login') }}
          </NuxtLink>

          <NuxtLink
            to="/register"
            class="bm-btn bm-btn-outline bm-btn-sm"
            role="menuitem"
            @click="close"
          >
            {{ t('user.menu.register') }}
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  user: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  // Optionnel: si /account existe déjà (sinon on le masque)
  showAccountLink: { type: Boolean, default: false }
})

const emit = defineEmits(['logout'])

const { t } = useI18n()
const route = useRoute()

const open = ref(false)
const root = ref(null)

const avatarUrl = computed(() => props.user?.avatar_url || props.user?.avatarUrl || '')

const displayName = computed(() => {
  const u = props.user
  if (!u) return ''
  return (
    u.display_name ||
    u.displayName ||
    u.username ||
    u.email ||
    ''
  )
})

const initials = computed(() => {
  const base = displayName.value || ''
  const parts = base
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)

  const a = (parts[0] || '').slice(0, 1)
  const b = (parts[1] || '').slice(0, 1)
  const out = `${a}${b}`.toUpperCase()
  return out || '•'
})

const chipLabel = computed(() => {
  if (props.loading) return t('user.chip.loading')
  if (props.user) return t('user.chip.authed')
  return t('user.chip.guest')
})

const toggle = () => {
  if (props.loading) return
  open.value = !open.value
}

const close = () => {
  open.value = false
}

const onDocClick = (e) => {
  if (!open.value) return
  const el = root.value
  if (!el) return
  if (el.contains(e.target)) return
  close()
}

const onKeydown = (e) => {
  if (e.key === 'Escape') close()
}

const onLogout = async () => {
  close()
  emit('logout')
}

watch(
  () => route.fullPath,
  () => close()
)

onMounted(() => {
  if (!import.meta.client) return
  document.addEventListener('click', onDocClick)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.bm-user-inline {
  position: relative;
}

.bm-user-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding-left: 0.55rem;
  padding-right: 0.55rem;
}

.bm-user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--bm-color-border-subtle);
  background: var(--bm-color-bg-elevated);
  flex: 0 0 auto;
}

.bm-user-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.bm-user-avatar__initials {
  font-weight: 750;
  font-size: 0.74rem;
  letter-spacing: 0.04em;
  color: var(--bm-color-text-strong);
}

.bm-user-chip__label {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.bm-user-chip__chev {
  width: 16px;
  height: 16px;
  opacity: 0.85;
}

.bm-user-chip__skeleton {
  width: 72px;
  height: 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--bm-color-border-subtle) 55%, transparent);
  display: inline-block;
}

.bm-user-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: min(320px, 86vw);
  z-index: 70;
}

.bm-user-menu__header {
  display: grid;
  gap: 0.35rem;
}

.bm-user-menu__identity {
  display: grid;
  gap: 0.2rem;
}

.bm-user-menu__name {
  font-weight: 700;
  letter-spacing: -0.01em;
}

.bm-user-menu__email {
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bm-user-menu__divider {
  height: 1px;
  margin: 0.85rem 0;
  background: linear-gradient(
    to right,
    transparent,
    color-mix(in srgb, var(--bm-color-border-subtle) 90%, transparent),
    transparent
  );
}

.bm-user-menu__actions {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.bm-user-menu__loading {
  padding: 0.25rem 0;
}

@media (max-width: 980px) {
  .bm-user-menu {
    right: auto;
    left: 0;
  }
}
</style>
