// server/api/projects/[projectSlug]/characters/[characterSlug]/restore.post.js
import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const characterSlug = String(event.context.params.characterSlug || '').trim()
  if (!projectSlug || !characterSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid params' })
  }

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  const res = await dbQuery(
    `
    UPDATE characters
    SET deleted_at = NULL
    WHERE project_id = ? AND slug = ? AND deleted_at IS NOT NULL
    `,
    [project.id, characterSlug]
  )

  if (!res?.affectedRows) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const rows = await dbQuery(
    `
    SELECT id, project_id, slug, name, description, created_at, updated_at, deleted_at
    FROM characters
    WHERE project_id = ? AND slug = ?
    LIMIT 1
    `,
    [project.id, characterSlug]
  )

  return { ok: true, character: rows[0] || null }
})
