// server/api/projects/[projectSlug]/characters/[slug].put.js
import { dbQuery } from '../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = Number(user?.id || user?.sub)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const characterSlug = String(event.context.params.slug || '').trim()
  
  if (!projectSlug || !characterSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid parameters' })
  }

  // Récupère le projet
  const projectRows = await dbQuery(
    'SELECT id FROM projects WHERE owner_id = ? AND slug = ? AND deleted_at IS NULL LIMIT 1',
    [userId, projectSlug]
  )
  
  if (!projectRows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }
  
  const project = projectRows[0]

  // Vérifie que le personnage existe
  const characterRows = await dbQuery(
    'SELECT id FROM characters WHERE project_id = ? AND slug = ? AND deleted_at IS NULL LIMIT 1',
    [project.id, characterSlug]
  )

  if (!characterRows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Character not found' })
  }

  const character = characterRows[0]
  const body = await readBody(event)

  // Build update query dynamically
  const updates = []
  const params = []

  if (body.name !== undefined && String(body.name).trim()) {
    updates.push('name = ?')
    params.push(String(body.name).trim())
  }

  if (body.description !== undefined) {
    updates.push('description = ?')
    params.push(body.description ? String(body.description).trim() : null)
  }

  if (!updates.length) {
    return { message: 'No fields to update' }
  }

  updates.push('updated_at = NOW()')
  params.push(character.id)

  await dbQuery(
    `UPDATE characters SET ${updates.join(', ')} WHERE id = ?`,
    params
  )

  return { message: 'Character updated' }
})
