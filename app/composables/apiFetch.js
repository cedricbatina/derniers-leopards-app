export async function apiFetch(url, opts = {}) {
  const { _retried, ...options } = opts || {}

  try {
    return await $fetch(url, {
      ...options,
      credentials: 'include',
    })
  } catch (error) {
    const status = Number(error?.status || error?.statusCode || error?.response?.status || 0)
    const isRefreshCall = typeof url === 'string' && url.startsWith('/api/auth/refresh')
    if (status !== 401 || _retried || isRefreshCall) throw error

    await $fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })

    return await $fetch(url, {
      ...options,
      credentials: 'include',
    })
  }
}
