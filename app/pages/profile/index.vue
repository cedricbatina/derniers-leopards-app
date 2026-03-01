<template>
  <section class="max-w-2xl mx-auto py-8 px-4 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold mb-2">{{ t('profile.title') }}</h1>
      <p class="text-muted">{{ t('profile.subtitle') }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="card">
      <div class="card-body space-y-4">
        <div class="h-4 bg-surface2 rounded animate-pulse"></div>
        <div class="h-4 bg-surface2 rounded animate-pulse w-3/4"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card border border-red-500/50 bg-red-500/10">
      <div class="card-body">
        <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
          <Icon name="mdi:alert-circle" />
          {{ error.data?.message || 'Failed to load profile' }}
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="user" class="space-y-6">
      <!-- Profile Picture & Basic Info -->
      <div class="card">
        <div class="card-body">
          <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div class="w-24 h-24 rounded-full bg-linear-to-br from-primary to-primary/50 flex items-center justify-center overflow-hidden">
                <img
                  v-if="user.avatar_url"
                  :src="user.avatar_url"
                  :alt="`${user.display_name} avatar`"
                  class="w-full h-full object-cover"
                />
                <Icon v-else name="mdi:account" class="w-12 h-12 text-white" />
              </div>
            </div>

            <!-- Basic Info Display -->
            <div class="flex-1 space-y-2">
              <div>
                <p class="text-xs text-muted uppercase tracking-widest">{{ t('profile.displayName') }}</p>
                <p class="text-xl font-bold">{{ user.display_name || user.username || 'Unnamed' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted uppercase tracking-widest">{{ t('profile.email') }}</p>
                <p class="text-sm">{{ user.email }}</p>
              </div>
              <div class="pt-2">
                <span v-if="user.email_verified_at" class="badge badge-success gap-1">
                  <Icon name="mdi:check-circle" class="w-4 h-4" />
                  {{ t('profile.verified') }}
                </span>
                <span v-else class="badge badge-warning gap-1">
                  <Icon name="mdi:alert-circle" class="w-4 h-4" />
                  {{ t('profile.unverified') }}
                </span>
              </div>
            </div>

            <!-- Edit Button -->
            <button
              @click="toggleEdit"
              :class="`btn ${isEditing ? 'btn-ghost' : 'btn-primary'}`"
            >
              <Icon :name="isEditing ? 'mdi:close' : 'mdi:pencil'" />
              {{ isEditing ? t('common.cancel') : t('common.edit') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <Transition name="fade">
        <div v-if="isEditing" class="card border border-primary/50 bg-primary/5">
          <div class="card-body space-y-4">
            <h3 class="font-bold text-lg flex items-center gap-2">
              <Icon name="mdi:pencil" />
              {{ t('profile.editProfile') }}
            </h3>

            <!-- Form Fields -->
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium mb-2">
                  {{ t('profile.displayName') }}
                </label>
                <input
                  v-model="editForm.display_name"
                  type="text"
                  class="input w-full"
                  placeholder="Your name"
                  :disabled="saving"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">
                  {{ t('profile.firstName') }}
                </label>
                <input
                  v-model="editForm.first_name"
                  type="text"
                  class="input w-full"
                  placeholder="First name"
                  :disabled="saving"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">
                  {{ t('profile.lastName') }}
                </label>
                <input
                  v-model="editForm.last_name"
                  type="text"
                  class="input w-full"
                  placeholder="Last name"
                  :disabled="saving"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-sm font-medium mb-2">
                  {{ t('profile.bio') }}
                </label>
                <textarea
                  v-model="editForm.bio"
                  class="input w-full resize-none h-24"
                  placeholder="Tell us about yourself..."
                  :disabled="saving"
                ></textarea>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-sm font-medium mb-2">
                  {{ t('profile.website') }}
                </label>
                <input
                  v-model="editForm.website"
                  type="url"
                  class="input w-full"
                  placeholder="https://example.com"
                  :disabled="saving"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">
                  {{ t('profile.locale') }}
                </label>
                <select v-model="editForm.locale" class="input w-full" :disabled="saving">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="pt">Português</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">
                  {{ t('profile.timezone') }}
                </label>
                <input
                  v-model="editForm.timezone"
                  type="text"
                  class="input w-full"
                  placeholder="Europe/Paris"
                  :disabled="saving"
                />
              </div>
            </div>

            <!-- Save Button -->
            <div class="flex justify-end gap-2 pt-4 border-t border-border">
              <button
                @click="toggleEdit"
                class="btn btn-ghost"
                :disabled="saving"
              >
                {{ t('common.cancel') }}
              </button>
              <button
                @click="saveProfile"
                class="btn btn-primary gap-2"
                :disabled="saving"
              >
                <Icon v-if="saving" name="mdi:loading" class="animate-spin" />
                {{ t('common.save') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Account Info -->
      <div class="card">
        <div class="card-body">
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
            <Icon name="mdi:information" />
            {{ t('profile.accountInfo') }}
          </h3>

          <div class="grid gap-4 text-sm">
            <div>
              <p class="text-muted">{{ t('profile.accountType') }}</p>
              <p class="font-medium capitalize">{{ user.account_type || 'Standard' }}</p>
            </div>
            <div>
              <p class="text-muted">{{ t('profile.role') }}</p>
              <p class="font-medium capitalize">{{ user.role || 'User' }}</p>
            </div>
            <div v-if="user.organization_name">
              <p class="text-muted">{{ t('profile.organization') }}</p>
              <p class="font-medium">{{ user.organization_name }}</p>
            </div>
            <div v-if="user.profession">
              <p class="text-muted">{{ t('profile.profession') }}</p>
              <p class="font-medium">{{ user.profession }}</p>
            </div>
            <div>
              <p class="text-muted">{{ t('profile.memberSince') }}</p>
              <p class="font-medium">{{ formatDate(user.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card border border-red-500/20 bg-red-500/5">
        <div class="card-body">
          <h3 class="font-bold text-lg text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <Icon name="mdi:alert-octagon" />
            {{ t('profile.dangerZone') }}
          </h3>

          <div class="space-y-3">
            <div>
              <p class="text-sm text-muted mb-2">{{ t('profile.softDeleteDesc') }}</p>
              <button
                @click="confirmSoftDelete"
                class="btn btn-ghost border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
              >
                <Icon name="mdi:lock" />
                {{ t('profile.softDelete') }}
              </button>
            </div>

            <div class="border-t border-border pt-3">
              <p class="text-sm text-muted mb-2">{{ t('profile.hardDeleteDesc') }}</p>
              <button
                @click="confirmHardDelete"
                class="btn btn-danger"
              >
                <Icon name="mdi:delete-forever" />
                {{ t('profile.hardDelete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No User State -->
    <div v-else class="card">
      <div class="card-body">
        <div class="text-center space-y-4">
          <Icon name="mdi:account-off" class="w-16 h-16 mx-auto text-muted opacity-50" />
          <p class="text-muted">{{ t('profile.noUser') }}</p>
          <NuxtLink to="/login" class="btn btn-primary">
            {{ t('common.login') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
definePageMeta({ middleware: ['auth'] })

const { t } = useI18n()
const { open: confirmOpen } = useConfirm()
const router = useRouter()

const { data, pending, refresh, error } = await useFetch(() => '/api/auth/me', {
  credentials: 'include',
})

const user = computed(() => data.value?.user)

const isEditing = ref(false)
const saving = ref(false)

const editForm = reactive({
  display_name: '',
  first_name: '',
  last_name: '',
  bio: '',
  website: '',
  locale: '',
  timezone: '',
})

watch(
  user,
  (newUser) => {
    if (!newUser) return
    editForm.display_name = newUser?.display_name || ''
    editForm.first_name = newUser?.first_name || ''
    editForm.last_name = newUser?.last_name || ''
    editForm.bio = newUser?.bio || ''
    editForm.website = newUser?.website || ''
    editForm.locale = newUser?.locale || 'en'
    editForm.timezone = newUser?.timezone || ''
  },
  { immediate: true }
)

const toggleEdit = () => {
  if (isEditing.value) {
    // Reset form when closing
    if (user.value) {
      editForm.display_name = user.value?.display_name || ''
      editForm.first_name = user.value?.first_name || ''
      editForm.last_name = user.value?.last_name || ''
      editForm.bio = user.value?.bio || ''
      editForm.website = user.value?.website || ''
      editForm.locale = user.value?.locale || 'en'
      editForm.timezone = user.value?.timezone || ''
    }
  }
  isEditing.value = !isEditing.value
}

const saveProfile = async () => {
  saving.value = true
  try {
    await $fetch('/api/auth/profile', {
      method: 'PUT',
      credentials: 'include',
      body: editForm,
    })
    await refresh()
    isEditing.value = false
  } catch (err) {
    console.error('Failed to save profile:', err)
  } finally {
    saving.value = false
  }
}

const confirmSoftDelete = () => {
  confirmOpen({
    title: t('profile.confirmSoftDelete'),
    message: t('profile.softDeleteConfirmMsg'),
    icon: 'mdi:lock',
    danger: true,
    confirmLabel: t('common.deactivate'),
    cancelLabel: t('common.cancel'),
    onConfirm: async () => {
      await deleteAccount('soft')
    },
  })
}

const confirmHardDelete = () => {
  confirmOpen({
    title: t('profile.confirmHardDelete'),
    message: t('profile.hardDeleteConfirmMsg'),
    icon: 'mdi:alert-octagon',
    danger: true,
    confirmLabel: t('common.deleteForever'),
    cancelLabel: t('common.cancel'),
    onConfirm: async () => {
      await deleteAccount('hard')
    },
  })
}

const deleteAccount = async (mode) => {
  try {
    await $fetch('/api/auth/profile', {
      method: 'DELETE',
      credentials: 'include',
      body: { mode },
    })
    // Logout and redirect
    await $fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    await router.push('/')
  } catch (err) {
    console.error('Failed to delete account:', err)
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr))
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
