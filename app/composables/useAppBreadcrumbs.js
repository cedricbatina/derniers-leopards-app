import { computed } from 'vue'
import { useI18n, useLocalePath } from '#imports'

/**
 * Normalise le chemin sans préfixe de locale (fr = pas de préfixe).
 */
function stripLocalePrefix(path, locale) {
  if (!path) return '/'
  if (locale === 'fr') return path.split('?')[0] || '/'
  const pref = `/${locale}`
  if (path === pref || path === `${pref}/`) return '/'
  if (path.startsWith(`${pref}/`)) {
    const rest = path.slice(pref.length) || '/'
    return rest.split('?')[0] || '/'
  }
  return path.split('?')[0] || '/'
}

export function useAppBreadcrumbs() {
  const route = useRoute()
  const { t, locale, te } = useI18n()
  const localePath = useLocalePath()

  const items = computed(() => {
    const path = stripLocalePrefix(route.path, locale.value)
    const home = { to: localePath('/'), label: t('nav.home') }

    if (path.startsWith('/explore')) {
      const guide = { to: localePath('/explore'), label: t('nav.guide') }
      if (path === '/explore' || path === '/explore/') {
        return [home, { label: guide.label }]
      }
      const rest = path.replace(/^\/explore\/?/, '').replace(/\/$/, '')
      const segment = (rest.split('/')[0] || '').trim()
      if (!segment) {
        return [home, { label: guide.label }]
      }
      const key = `explore.breadcrumbs.segments.${segment}`
      const label = te(key) ? t(key) : segment
      return [home, guide, { label }]
    }

    if (path.startsWith('/studio')) {
      const studioRoot = { to: localePath('/studio'), label: t('studio.workspaceNav.dashboard') }
      if (path === '/studio' || path === '/studio/') {
        return [home, { label: studioRoot.label }]
      }
      if (path.startsWith('/studio/projects')) {
        const projects = { to: localePath('/studio/projects'), label: t('studio.breadcrumbs.projects') }
        const m = path.match(/^\/studio\/projects\/([^/]+)/)
        const slug = m?.[1]
        if (slug && slug !== '') {
          return [home, studioRoot, projects, { label: slug }]
        }
        return [home, studioRoot, { label: projects.label }]
      }
      if (path.startsWith('/studio/todos')) {
        return [home, studioRoot, { label: t('domain.todo.plural') }]
      }
      return [home, studioRoot, { label: t('breadcrumb.current') }]
    }

    return [home]
  })

  return { items }
}
