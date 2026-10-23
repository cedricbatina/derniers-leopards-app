/** Project slug URL-safe (lowercase hyphenated), aligned with public API usage. */
const PROJECT_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * @returns {{ ok: true, slug: string, message: '', errorCode: null }
 *   | { ok: false, slug: '', message: string, errorCode: 'PROJECT_SLUG_REQUIRED' | 'INVALID_PROJECT_SLUG' }}
 */
export function assertValidProjectSlugForCanon(slug) {
  const raw = String(slug || '').trim()
  if (!raw) {
    return {
      ok: false,
      slug: '',
      message: 'project_slug is required',
      errorCode: 'PROJECT_SLUG_REQUIRED',
    }
  }
  const s = raw.toLowerCase()
  if (s.length > 127 || !PROJECT_SLUG_RE.test(s)) {
    return {
      ok: false,
      slug: '',
      message: 'Invalid project_slug',
      errorCode: 'INVALID_PROJECT_SLUG',
    }
  }
  return { ok: true, slug: s, message: '', errorCode: null }
}
