// stores/auth.store.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // { id, email, ... , roles: [] }
    isLoading: false,
  }),

  getters: {
    // robuste: dépend d'un identifiant réel
    isAuthed: (s) => !!s.user?.id,

    roles: (s) => {
      const u = s.user
      if (!u) return []
      if (Array.isArray(u.roles)) return u.roles
      if (u.role) return [u.role] // fallback legacy
      return []
    },

    isAdmin() {
      return this.roles.includes('admin')
    },

    isEditor() {
      return this.roles.includes('editor')
    },
  },

  actions: {
    async fetchMe(options = {}) {
      this.isLoading = true
      try {
        const res = await $fetch('/api/auth/me', {
          credentials: 'include',
          ...options, // utile SSR: headers/cookies
        })
        this.user = res?.user ?? null
      } catch {
        this.user = null
      } finally {
        this.isLoading = false
      }
    },

    async register({ email, password }) {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: { email, password },
        credentials: 'include',
      })
    },

    async login({ email, password }) {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include',
      })
      await this.fetchMe()
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        })
      } finally {
        this.user = null
      }
    },

    async forgotPassword(email) {
      await $fetch('/api/auth/forgot-password', {
        method: 'POST',
        body: { email },
        credentials: 'include',
      })
    },

    async resetPassword({ token, password }) {
      await $fetch('/api/auth/reset-password', {
        method: 'POST',
        body: { token, password },
        credentials: 'include',
      })
    },
  },
})
