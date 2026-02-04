import { dbQuery } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const slug = String(event.context.params.slug || '').trim()
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Invalid slug' })

  const rows = await dbQuery(
    `
    SELECT id, owner_id, slug, title, title_en, title_pt, logline, pitch, status, created_at, updated_at
    FROM projects
    WHERE owner_id=? AND slug=?
    LIMIT 1
    `,
    [user.id, slug]
  )

  if (!rows?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { project: rows[0] }
})
