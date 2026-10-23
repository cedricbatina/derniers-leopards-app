// Anciennes URL /access-denied → slug localisé canonique (configs i18n.pages).
export default defineNuxtRouteMiddleware((to) => {
  const p = to.path.replace(/\/+$/, '') || '/'
  if (p === '/access-denied') {
    return navigateTo(
      { path: '/acces-refuse', query: { ...to.query }, hash: to.hash },
      { replace: true },
    )
  }
  if (p === '/pt/access-denied') {
    return navigateTo(
      { path: '/pt/acesso-negado', query: { ...to.query }, hash: to.hash },
      { replace: true },
    )
  }
})
