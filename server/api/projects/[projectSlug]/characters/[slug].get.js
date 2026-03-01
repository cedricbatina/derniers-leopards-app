// server/api/projects/[projectSlug]/characters/[slug].get.js
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
    'SELECT id, slug, title, owner_id FROM projects WHERE owner_id = ? AND slug = ? AND deleted_at IS NULL LIMIT 1',
    [userId, projectSlug]
  )
  
  if (!projectRows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }
  
  const project = projectRows[0]

  // Récupère le personnage
  const characterRows = await dbQuery(
    `
    SELECT 
      id, project_id, slug, name, description,
      created_at, updated_at, deleted_at
    FROM characters
    WHERE project_id = ? AND slug = ? AND deleted_at IS NULL
    LIMIT 1
    `,
    [project.id, characterSlug]
  )

  if (!characterRows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Character not found' })
  }

  const character = characterRows[0]

  // Récupère les scènes où le personnage apparaît
  const scenes = await dbQuery(
    `
    SELECT 
      s.id, s.slug, s.scene_no, s.title, s.chapter_id,
      sc.role as character_role,
      sc.notes as character_notes
    FROM scene_characters sc
    JOIN scenes s ON sc.scene_id = s.id
    WHERE sc.character_id = ? AND s.deleted_at IS NULL
    ORDER BY s.scene_no ASC
    LIMIT 100
    `,
    [character.id]
  )

  return { 
    project: { 
      id: project.id, 
      slug: project.slug, 
      title: project.title,
      owner_id: project.owner_id
    }, 
    character,
    scenes
  }
})
