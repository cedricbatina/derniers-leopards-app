import { dbQuery } from '../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = Number(user?.id || user?.sub)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const sceneSlug = String(event.context.params.sceneSlug || '').trim()
  if (!projectSlug || !sceneSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid params' })
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

  const { trashed } = getQuery(event)
  const allowTrashed = String(trashed || '') === '1' ? 1 : 0

  // Récupère la scène avec le personnage POV
  const sceneRows = await dbQuery(
    `
    SELECT 
      s.*,
      c.name as pov_character_name,
      c.surname as pov_character_surname,
      c.avatar_url as pov_character_avatar,
      c.slug as pov_character_slug
    FROM scenes s
    LEFT JOIN characters c ON s.pov_character_id = c.id
    WHERE s.project_id=?
      AND s.slug=?
      AND (? = 1 OR s.deleted_at IS NULL)
    LIMIT 1
    `,
    [project.id, sceneSlug, allowTrashed]
  )

  if (!sceneRows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const scene = sceneRows[0]

  // Récupère tous les personnages de la scène
  const sceneCharacters = await dbQuery(
    `
    SELECT 
      c.id, c.slug, c.name, c.surname, c.avatar_url, c.role,
      sc.role as scene_role
    FROM scene_characters sc
    JOIN characters c ON sc.character_id = c.id
    WHERE sc.scene_id = ? AND c.deleted_at IS NULL
    ORDER BY c.name ASC, c.surname ASC
    `,
    [scene.id]
  )

  // Récupère toutes les scènes du projet pour la navigation
  const allScenes = await dbQuery(
    `
    SELECT id, slug, scene_no, title
    FROM scenes
    WHERE project_id = ? AND deleted_at IS NULL
    ORDER BY scene_no ASC
    `,
    [project.id]
  )

  return { 
    project: {
      id: project.id,
      slug: project.slug,
      title: project.title,
      owner_id: project.owner_id
    },
    scene,
    characters: sceneCharacters,
    allScenes
  }
})
