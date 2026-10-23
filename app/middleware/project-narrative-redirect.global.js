// Redirige l’ancien chemin vitrine (/projects/.../characters|scenes) vers l’atelier (/studio/...).

function stripLocalePrefix(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p === '/en' || p.startsWith('/en/')) return p.slice(3) || '/'
  if (p === '/pt' || p.startsWith('/pt/')) return p.slice(3) || '/'
  return p
}

export default defineNuxtRouteMiddleware((to) => {
  const core = stripLocalePrefix(to.path)
  const nar = core.match(/^\/projects\/([^/]+)\/(characters|scenes)(\/.*)?$/)
  if (!nar) return

  const projectSlug = nar[1]
  const section = nar[2]
  let tail = nar[3] || ''

  if (section === 'scenes' && /\/edit\/?$/.test(tail)) {
    tail = tail.replace(/\/edit\/?$/, '') || ''
  }

  const tailNorm = tail.replace(/\/+$/, '')
  let destRaw = `/studio/projects/${projectSlug}/${section}`
  if (tailNorm) destRaw += tailNorm

  const localePath = useLocalePath()
  return navigateTo(
    {
      path: localePath(destRaw),
      query: { ...to.query },
    },
    { replace: true }
  )
})
