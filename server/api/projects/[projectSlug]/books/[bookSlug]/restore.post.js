import { dbQuery } from '../../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  if (!projectSlug || !bookSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const res = await dbQuery(
    `
    UPDATE books
    SET deleted_at = NULL
    WHERE project_id=? AND slug=? AND deleted_at IS NOT NULL
    `,
    [project.id, bookSlug]
  )

  if (!res?.affectedRows) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  const rows = await dbQuery(
    `
    SELECT id, project_id, slug, title, subtitle, subtitle_en, subtitle_pt, summary, created_at, updated_at, deleted_at
    FROM books
    WHERE project_id=? AND slug=?
    LIMIT 1
    `,
    [project.id, bookSlug]
  )

  return { ok: true, book: rows[0] || null }
})
