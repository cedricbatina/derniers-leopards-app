import { useAuthStore } from '~/stores/auth.store'
import { useRequestFetch } from '#imports'

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  const requestFetch = useRequestFetch()

  try {
    const res = await requestFetch('/api/auth/me')
    auth.user = res?.user || null
  } catch {
    auth.user = null
  }
})
