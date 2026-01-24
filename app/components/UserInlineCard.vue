<template>
  <div class="user-inline-card" aria-live="polite">
    <div class="user-inline-main">
      <span class="status-dot" :title="onlineLabel">
        <span class="status-indicator" :class="{ 'status-indicator--online': isAuthed }" />
      </span>

      <div class="user-inline-text">
        <p class="user-inline-primary">
          <span v-if="isAuthed">{{ displayName }}</span>
          <span v-else>{{ t('userInline.guestLabel') }}</span>
        </p>

        <p class="user-inline-secondary">
          <span v-if="isAuthed">{{ roleLabel }}</span>
          <span v-else>{{ t('userInline.guestHelper') }}</span>
        </p>
      </div>

      <div class="user-inline-actions">
        <template v-if="isAuthed">
          <button type="button" class="btn btn-ghost btn-sm user-inline-btn" @click="$emit('go-dashboard')">
            <Icon name="mdi:view-dashboard-outline" aria-hidden="true" />
            <span>{{ t('userInline.dashboard') }}</span>
          </button>

          <button type="button" class="btn btn-ghost btn-sm user-inline-btn" @click="$emit('logout')">
            <Icon name="mdi:logout" aria-hidden="true" />
            <span>{{ t('userInline.logout') }}</span>
          </button>
        </template>

        <template v-else>
          <button type="button" class="btn btn-ghost btn-sm user-inline-btn" @click="$emit('login')">
            <Icon name="mdi:login" aria-hidden="true" />
            <span>{{ t('userInline.login') }}</span>
          </button>

          <button type="button" class="btn btn-primary btn-sm user-inline-btn" @click="$emit('register')">
            <Icon name="mdi:account-plus" aria-hidden="true" />
            <span>{{ t('userInline.register') }}</span>
          </button>
        </template>
      </div>
    </div>

    <div class="user-inline-meta">
      <ClientOnly>
        <span class="user-inline-date">
          <Icon name="mdi:calendar" aria-hidden="true" />
          {{ t('userInline.todayLabel', { date: formattedNow }) }}
        </span>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDateUtils } from '~/composables/useDateUtils'

const props = defineProps({
  user: { type: Object, default: null },
})

defineEmits(['go-dashboard', 'logout', 'login', 'register'])

const { t } = useI18n()
const { formattedDateTimeWithSeconds } = useDateUtils()

/**
 * Auth dérivé du user.id (robuste et “source de vérité”)
 */
const isAuthed = computed(() => !!props.user?.id)

const now = ref(new Date())
let timer = null

onMounted(() => {
  timer = setInterval(() => (now.value = new Date()), 1000)
})
onUnmounted(() => timer && clearInterval(timer))

const formattedNow = computed(() => formattedDateTimeWithSeconds(now.value))

const onlineLabel = computed(() =>
  isAuthed.value
    ? t('userInline.status.online')
    : t('userInline.status.offline')
)

const displayName = computed(() => {
  const u = props.user
  if (!u) return ''

  // 1) display_name
  const dn = u.display_name || u.displayName
  if (dn) return dn

  // 2) username
  if (u.username) return u.username

  // 3) email (fallback)
  if (u.email) return u.email

  return t('userInline.fallbackUser')
})

/**
 * rôle “pro” : mapping vers libellés i18n (pas de brut)
 * - si vous avez role = 'user' : on affiche “Compte standard”
 */
const roleLabel = computed(() => {
  const u = props.user
  if (!u) return t('userInline.role.generic')

  const raw = String(u.role || '').toLowerCase().trim()

  // mapping stable
  if (raw === 'admin') return t('userInline.role.admin')
  if (raw === 'editor') return t('userInline.role.editor')
  if (raw === 'moderator') return t('userInline.role.moderator')
  if (raw === 'user') return t('userInline.role.standard')

  // fallback lisible (si nouveau rôle)
  return t('userInline.role.generic')
})
</script>

<style scoped>
.user-inline-card {
  font-size: 0.95rem;
  background: var(--color-surface-muted);
  border-radius: 0.75rem;
  border: 1px solid var(--color-border-subtle);
  padding: 0.4rem 0.75rem;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: var(--color-text-main);
}

.user-inline-main { display:flex; align-items:center; gap:0.5rem; }
.status-dot { display:inline-flex; align-items:center; justify-content:center; min-width:0.9rem; }
.status-indicator { width:0.55rem; height:0.55rem; border-radius:999px; background:#9ca3af; box-shadow:0 0 0 1px rgba(148,163,184,0.4); }
.status-indicator--online { background:#22c55e; box-shadow:0 0 0 1px rgba(34,197,94,0.5); }

.user-inline-text { display:flex; flex-direction:column; gap:0.05rem; flex:1; min-width:0; }
.user-inline-primary { margin:0; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.user-inline-secondary { margin:0; font-size:0.8rem; color: var(--color-text-soft); }

.user-inline-actions { display:flex; align-items:center; gap:0.25rem; }
.user-inline-btn { padding-inline:0.5rem; font-size:0.8rem; display:inline-flex; align-items:center; gap:0.35rem; }

.user-inline-meta { display:flex; justify-content:flex-start; margin-top:0.1rem; }
.user-inline-date { font-size:0.78rem; color: var(--color-text-soft); display:inline-flex; align-items:center; gap:0.3rem; }

@media (max-width: 640px) {
  .user-inline-main { flex-direction:column; align-items:flex-start; gap:0.4rem; }
  .user-inline-actions { width:100%; flex-wrap:wrap; gap:0.3rem; }
}
</style>
