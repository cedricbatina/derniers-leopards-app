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

  if (body.surname !== undefined) {
    updates.push('surname = ?')
    params.push(body.surname ? String(body.surname).trim() : null)
  }

  if (body.age !== undefined) {
    updates.push('age = ?')
    params.push(body.age ? Number(body.age) : null)
  }

  if (body.birthdate !== undefined) {
    updates.push('birthdate = ?')
    params.push(body.birthdate || null)
  }

  if (body.birthplace !== undefined) {
    updates.push('birthplace = ?')
    params.push(body.birthplace || null)
  }

  if (body.role !== undefined) {
    updates.push('role = ?')
    params.push(body.role || null)
  }

  if (body.species !== undefined) {
    updates.push('species = ?')
    params.push(body.species || null)
  }

  if (body.gender !== undefined) {
    updates.push('gender = ?')
    params.push(body.gender || null)
  }

  if (body.description !== undefined) {
    updates.push('description = ?')
    params.push(body.description || null)
  }

  if (body.personality !== undefined) {
    updates.push('personality = ?')
    params.push(body.personality || null)
  }

  if (body.background !== undefined) {
    updates.push('background = ?')
    params.push(body.background || null)
  }

  if (body.motivations !== undefined) {
    updates.push('motivations = ?')
    params.push(body.motivations || null)
  }

  if (body.conflicts !== undefined) {
    updates.push('conflicts = ?')
    params.push(body.conflicts || null)
  }

  if (body.secrets !== undefined) {
    updates.push('secrets = ?')
    params.push(body.secrets || null)
  }

  if (body.avatar_url !== undefined) {
    updates.push('avatar_url = ?')
    params.push(body.avatar_url || null)
  }

  if (body.book_id !== undefined) {
    updates.push('book_id = ?')
    params.push(body.book_id ? Number(body.book_id) : null)
  }

  // Update fullname if name or surname changed
  if (body.name !== undefined || body.surname !== undefined) {
    const currentChar = await dbQuery(
      'SELECT name, surname FROM characters WHERE id = ?',
      [character.id]
    )
    const newName = body.name !== undefined ? String(body.name).trim() : currentChar[0].name
    const newSurname = body.surname !== undefined ? (body.surname ? String(body.surname).trim() : '') : (currentChar[0].surname || '')
    
    updates.push('fullname = ?')
    params.push(`${newName} ${newSurname}`.trim())
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
