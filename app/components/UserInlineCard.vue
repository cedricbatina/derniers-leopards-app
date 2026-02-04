<template>
  <div class="user-inline-card" aria-live="polite">
    <div class="user-inline-main">
      <span class="status-dot" :title="onlineLabel">
        <span class="status-indicator" :class="{ 'status-indicator--online': isAuthed }" />
      </span>

      <!-- Avatar (optionnel) -->
      <div v-if="isAuthed" class="user-inline-avatar" aria-hidden="true">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt=""
          class="user-inline-avatar__img"
          loading="lazy"
        />
        <div v-else class="user-inline-avatar__fallback">
          {{ initials }}
        </div>
      </div>

      <div class="user-inline-text">
        <!-- ✅ TITRE -->
        <p class="user-inline-primary">
          <span v-if="isAuthed">{{ primaryName }}</span>
          <span v-else>{{ tr('userInline.guestLabel', 'Invité') }}</span>
        </p>

        <!-- ✅ SOUS-TITRE -->
        <p class="user-inline-secondary">
          <template v-if="isAuthed">
            <div class="user-inline-secondary__line">
              <!-- Sous-titre identité (selon type de compte) -->
              <span v-if="secondaryName" class="user-inline-subname">
                {{ secondaryName }}
              </span>

              <!-- Badges rôle + type -->
              <span class="user-inline-badges">
                <span class="badge badge--soft">
                  <Icon :name="roleIcon" aria-hidden="true" />
                  {{ roleLabel }}
                </span>

                <span v-if="accountTypeLabel" class="badge badge--soft">
                  <Icon name="mdi:briefcase-outline" aria-hidden="true" />
                  {{ accountTypeLabel }}
                </span>
              </span>
            </div>
          </template>

          <span v-else>
            {{ tr('userInline.guestHelper', 'Connectez-vous pour accéder à votre espace.') }}
          </span>
        </p>
      </div>

      <div class="user-inline-actions">
        <template v-if="isAuthed">
          <button type="button" class="btn btn-ghost btn-sm user-inline-btn" @click="$emit('go-dashboard')">
            <Icon name="mdi:view-dashboard-outline" aria-hidden="true" />
            <span>{{ tr('userInline.dashboard', 'Tableau de bord') }}</span>
          </button>

          <button type="button" class="btn btn-ghost btn-sm user-inline-btn" @click="$emit('logout')">
            <Icon name="mdi:logout" aria-hidden="true" />
            <span>{{ tr('userInline.logout', 'Déconnexion') }}</span>
          </button>
        </template>

        <template v-else>
          <button type="button" class="btn btn-ghost btn-sm user-inline-btn" @click="$emit('login')">
            <Icon name="mdi:login" aria-hidden="true" />
            <span>{{ tr('userInline.login', 'Connexion') }}</span>
          </button>

          <button type="button" class="btn btn-primary btn-sm user-inline-btn" @click="$emit('register')">
            <Icon name="mdi:account-plus" aria-hidden="true" />
            <span>{{ tr('userInline.register', 'Créer un compte') }}</span>
          </button>
        </template>
      </div>
    </div>

    <div class="user-inline-meta">
      <ClientOnly>
        <span class="user-inline-date">
          <Icon name="mdi:calendar" aria-hidden="true" />
          {{ tr('userInline.todayLabel', `Aujourd’hui : ${formattedNow}`, { date: formattedNow }) }}
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

const { t, te } = useI18n()
const { formattedDateTimeWithSeconds } = useDateUtils()

function tr(key, fallback, params) {
  return te(key) ? t(key, params) : fallback
}

const isAuthed = computed(() => !!props.user?.id)

const now = ref(new Date())
let timer = null
onMounted(() => { timer = setInterval(() => (now.value = new Date()), 1000) })
onUnmounted(() => timer && clearInterval(timer))

const formattedNow = computed(() => formattedDateTimeWithSeconds(now.value))

const onlineLabel = computed(() =>
  isAuthed.value
    ? tr('userInline.status.online', 'Connecté')
    : tr('userInline.status.offline', 'Hors ligne')
)

const accountType = computed(() => {
  const u = props.user
  return String(u?.account_type || u?.accountType || '').toLowerCase().trim()
})

/**
 * ✅ TITRE (primaryName)
 * - Pro: organization_name
 * - Individual: first_name last_name
 * - Fallback: display_name → username → email
 */
const primaryName = computed(() => {
  const u = props.user
  if (!u) return ''

  if (accountType.value === 'pro') {
    const org = u.organization_name || u.organizationName
    if (org) return String(org)
  }

  if (accountType.value === 'individual') {
    const full = [u.first_name, u.last_name].filter(Boolean).join(' ').trim()
    if (full) return full
  }

  const dn = u.display_name || u.displayName
  if (dn) return String(dn)

  if (u.username) return String(u.username)
  if (u.email) return String(u.email)

  return tr('userInline.fallbackUser', 'Utilisateur')
})

/**
 * ✅ SOUS-TITRE identité (secondaryName)
 * - Pro: display_name (si défini), sinon email
 * - Individual: display_name (si défini), sinon username/email
 * - On évite de répéter le titre
 */
const secondaryName = computed(() => {
  const u = props.user
  if (!u) return ''

  const dn = (u.display_name || u.displayName || '').toString().trim()
  const username = (u.username || '').toString().trim()
  const email = (u.email || '').toString().trim()

  if (accountType.value === 'pro') {
    // Pro: sous-titre = display_name si présent, sinon email
    const candidate = dn || email || username
    if (!candidate) return ''
    if (candidate === primaryName.value) return ''
    return candidate
  }

  // Individual: sous-titre = display_name si présent (souvent pseudo), sinon username/email
  const candidate = dn || username || email
  if (!candidate) return ''
  if (candidate === primaryName.value) return ''
  return candidate
})

const avatarUrl = computed(() => {
  const u = props.user
  return u?.avatar_url || u?.avatarUrl || null
})

const initials = computed(() => {
  const u = props.user
  if (!u) return ''
  const base = primaryName.value || (u.email || 'U')
  const parts = String(base).trim().split(/\s+/).slice(0, 2)
  return parts.map(p => p[0]?.toUpperCase()).join('') || 'U'
})

/**
 * Roles (source = user.roles, fallback = user.role)
 */
const roles = computed(() => {
  const u = props.user
  if (!u) return []
  if (Array.isArray(u.roles)) return u.roles.filter(Boolean)
  if (u.role) return [String(u.role)]
  if (u.primary_role) return [String(u.primary_role)]
  return []
})

const primaryRole = computed(() => {
  const r = roles.value.map(x => String(x).toLowerCase())
  if (r.includes('admin')) return 'admin'
  if (r.includes('editor')) return 'editor'
  return r[0] || 'user'
})

const roleLabel = computed(() => {
  const r = primaryRole.value
  if (r === 'admin') return tr('userInline.role.admin', 'Admin')
  if (r === 'editor') return tr('userInline.role.editor', 'Éditeur')
  return tr('userInline.role.standard', 'Compte standard')
})

const roleIcon = computed(() => {
  const r = primaryRole.value
  if (r === 'admin') return 'mdi:shield-crown-outline'
  if (r === 'editor') return 'mdi:pencil-outline'
  return 'mdi:account-circle-outline'
})

const accountTypeLabel = computed(() => {
  if (accountType.value === 'pro') return tr('userInline.accountType.pro', 'Compte Pro')
  if (accountType.value === 'individual') return tr('userInline.accountType.individual', 'Particulier')
  return ''
})
</script>

<style scoped>
.user-inline-card {
  font-size: 0.95rem;
  background: rgb(var(--surface2));
  border-radius: 0.75rem;
  border: 1px solid rgb(var(--border));
  padding: 0.6rem 0.75rem;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: rgb(var(--text));
}

.user-inline-main { display:flex; align-items:center; gap:0.6rem; }

.status-dot { display:inline-flex; align-items:center; justify-content:center; min-width:0.9rem; }
.status-indicator { width:0.55rem; height:0.55rem; border-radius:999px; background:#9ca3af; box-shadow:0 0 0 1px rgba(148,163,184,0.4); }
.status-indicator--online { background:#22c55e; box-shadow:0 0 0 1px rgba(34,197,94,0.5); }

.user-inline-avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgb(var(--border));
  background: rgb(var(--surface));
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}
.user-inline-avatar__img { width: 100%; height: 100%; object-fit: cover; }
.user-inline-avatar__fallback { font-weight: 800; font-size: 0.8rem; color: rgb(var(--muted)); }

.user-inline-text { display:flex; flex-direction:column; gap:0.15rem; flex:1; min-width:0; }
.user-inline-primary { margin:0; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

.user-inline-secondary { margin:0; font-size:0.82rem; color: rgb(var(--muted)); }
.user-inline-badges { display:flex; flex-wrap:wrap; gap:0.35rem; align-items:center; }

.badge--soft {
  background: rgb(var(--surface));
}

.user-inline-actions { display:flex; align-items:center; gap:0.35rem; flex-wrap:wrap; }
.user-inline-btn { padding-inline:0.55rem; font-size:0.8rem; display:inline-flex; align-items:center; gap:0.35rem; }

.user-inline-meta { display:flex; justify-content:flex-start; margin-top:0.1rem; }
.user-inline-date { font-size:0.78rem; color: rgb(var(--muted)); display:inline-flex; align-items:center; gap:0.3rem; }

@media (max-width: 640px) {
  .user-inline-main { flex-direction:column; align-items:flex-start; gap:0.5rem; }
  .user-inline-actions { width:100%; }
}
.user-inline-secondary__line{
  display:flex;
  flex-wrap:wrap;
  gap:0.35rem;
  align-items:center;
}
.user-inline-subname{
  font-weight:600;
  color: rgb(var(--text));
}

</style>
