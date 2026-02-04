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

  const res = await dbQuery(
    `DELETE FROM characters WHERE project_id=? AND slug=?`,
    [project.id, characterSlug]
  )

  if (!res?.affectedRows) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { ok: true }
})
