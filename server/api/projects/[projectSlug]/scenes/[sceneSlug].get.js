import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const sceneSlug = String(event.context.params.sceneSlug || '').trim()
  if (!projectSlug || !sceneSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const rows = await dbQuery(
    `
    SELECT s.*
    FROM scenes s
    JOIN chapters c ON c.id = s.chapter_id
    WHERE s.project_id=? AND s.slug=? AND s.deleted_at IS NULL

    LIMIT 1
    `,
    [project.id, sceneSlug, project.id]
  )

  if (!rows?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { scene: rows[0] }
})
