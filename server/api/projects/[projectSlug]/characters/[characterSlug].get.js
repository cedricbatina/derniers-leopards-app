import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const characterSlug = String(event.context.params.characterSlug || '').trim()
  if (!projectSlug || !characterSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const { trashed } = getQuery(event)
  const allowTrashed = String(trashed || '') === '1' ? 1 : 0

  const rows = await dbQuery(
    `
     SELECT id, project_id, slug, name, description, created_at, updated_at, deleted_at
     FROM characters
     WHERE project_id=? AND slug=? AND (? = 1 OR deleted_at IS NULL)
     LIMIT 1
     `,
    [project.id, characterSlug, allowTrashed]
  )

  if (!rows?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { character: rows[0] }
})
