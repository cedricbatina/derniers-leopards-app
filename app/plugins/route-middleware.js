import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtPlugin(() => {
  addRouteMiddleware('guest', async () => {
    const auth = useAuthStore()
    if (process.client && !auth.user?.id && !auth.isLoading) {
      await auth.fetchMe().catch(() => {})
    }
    if (auth.user?.id) {
      const localePath = useLocalePath()
      return navigateTo(localePath('/workspace'))
    }
  })

  addRouteMiddleware('auth', async (to) => {
    const auth = useAuthStore()
    if (process.client && !auth.user?.id && !auth.isLoading) {
      await auth.fetchMe().catch(() => {})
    }
    if (auth.user?.id) return

    const localePath = useLocalePath()
    return navigateTo({ path: localePath('/login'), query: { redirect: to.fullPath || '/' } })
  })
})
