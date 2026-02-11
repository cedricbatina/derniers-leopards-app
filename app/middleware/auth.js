// app/middleware/auth.js
import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  if (process.client && !auth.user?.id && !auth.isLoading && typeof auth.fetchMe === 'function') {
    await auth.fetchMe().catch(() => {})
  }

  if (auth.user?.id) return

  const redirect = typeof to.fullPath === 'string' ? to.fullPath : '/'
  let loginPath = '/login'
  try {
    const localePath = useLocalePath()
    loginPath = localePath('/login')
  } catch {}

  return navigateTo({ path: loginPath, query: { redirect } })
})
