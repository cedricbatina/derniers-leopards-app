import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  // auth-init.server/client.js remplit déjà auth.user.
  // Sécurité: si jamais pas encore prêt côté client, on tente une fois.
  if (process.client && !auth.user?.id && !auth.isLoading) {
    await auth.fetchMe().catch(() => {})
  }

  if (auth.user?.id) {
    const localePath = useLocalePath()
    return navigateTo(localePath('/workspace'))
  }
})
