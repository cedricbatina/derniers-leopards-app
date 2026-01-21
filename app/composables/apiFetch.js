export function apiFetch(url, opts = {}) {
  return $fetch(url, {
    ...opts,
    credentials: 'include', // IMPORTANT: cookies auth
  })
}
