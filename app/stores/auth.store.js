// stores/auth.store.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,       // objet retourné par /api/auth/me
    isLoading: false,
  }),

  getters: {
    isAuthed: (s) => !!s.user,
    roles: (s) => s.user?.roles || [],
    isAdmin: (s) => (s.user?.roles || []).includes('admin'),
    isEditor: (s) => (s.user?.roles || []).includes('editor'),
  },

  actions: {
    async fetchMe() {
      this.isLoading = true
      try {
        const res = await $fetch('/api/auth/me', { credentials: 'include' })
        this.user = res.user || null
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
      await $fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      this.user = null
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
