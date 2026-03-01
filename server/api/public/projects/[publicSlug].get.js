import { dbQuery } from '../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const publicSlug = String(event.context.params.publicSlug || '').trim()
  if (!publicSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid publicSlug' })
  }

  const rows = await dbQuery(
    `
    SELECT
      public_slug,
      title, title_en, title_pt,
      logline,
      pitch,
      cover_url,
      published_at,
      parent_id, type
    FROM projects
    WHERE deleted_at IS NULL
      AND status='active'
      AND visibility IN ('public','unlisted')
      AND public_slug=?
    LIMIT 1
    `,
    [publicSlug]
  )

  if (!rows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  return { project: rows[0] }
})
