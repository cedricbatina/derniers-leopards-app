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

  const body = await readBody(event)
  if (body?.slug !== undefined) {
    throw createError({ statusCode: 400, statusMessage: 'slug is immutable' })
  }

  const rows0 = await dbQuery(
    `SELECT id FROM characters WHERE project_id=? AND slug=? LIMIT 1`,
    [project.id, characterSlug]
  )
  if (!rows0?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  const characterId = rows0[0].id

  const allowed = ['name', 'description']
  const hasAny = allowed.some((k) => body?.[k] !== undefined)
  if (!hasAny) throw createError({ statusCode: 400, statusMessage: 'No fields to update' })

  const sets = []
  const params = []

  if (body.name !== undefined) {
    const name = String(body.name || '').trim()
    if (!name) throw createError({ statusCode: 400, statusMessage: 'name cannot be empty' })
    sets.push('name=?'); params.push(name)
  }

  if (body.description !== undefined) {
    sets.push('description=?')
    params.push(body.description ? String(body.description).trim() : null)
  }

  await dbQuery(
    `UPDATE characters SET ${sets.join(', ')} WHERE id=? AND project_id=?`,
    [...params, characterId, project.id]
  )

  const rows = await dbQuery(
    `SELECT id, project_id, slug, name, description, created_at, updated_at
     FROM characters
     WHERE id=? AND project_id=? LIMIT 1`,
    [characterId, project.id]
  )

  return { character: rows[0] }
})
