import { useAuthStore } from '~/stores/auth.store'

export function useRouteGuards() {
  const auth = useAuthStore()

  const lp = () => {
    try { return useLocalePath() } catch { return (p) => p }
  }

  const ensureMe = async () => {
    if (!auth.user?.id && typeof auth.fetchMe === 'function') {
      await auth.fetchMe().catch(() => {})
    }
  }

  const guestOnly = async () => {
    await ensureMe()
    if (auth.user?.id) return navigateTo(lp()('/workspace'))
  }

  const authOnly = async (to) => {
    await ensureMe()
    if (!auth.user?.id) {
      return navigateTo({ path: lp()('/login'), query: { redirect: to.fullPath } })
    }
  }

  return { guestOnly, authOnly }
}
