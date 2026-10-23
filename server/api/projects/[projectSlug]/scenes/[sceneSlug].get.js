import { dbQuery } from '../../../../utils/db.js'
import { tableHasColumn } from '../../../../utils/schema.js'
import { getProjectForNarrativeApi, canManageProject } from '../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const sceneSlug = String(event.context.params.sceneSlug || '').trim()
  if (!projectSlug || !sceneSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid params' })
  }

  const project = await getProjectForNarrativeApi(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const { trashed } = getQuery(event)
  const allowTrashed =
    canManageProject(project, user) && String(trashed || '') === '1' ? 1 : 0

  const hasCharSurname = await tableHasColumn('characters', 'surname')
  const povSurnameExpr = hasCharSurname ? 'c.surname' : 'NULL'

  // Récupère la scène avec le personnage POV
  const sceneRows = await dbQuery(
    `
    SELECT 
      s.id, s.project_id, s.slug, s.chapter_id, s.scene_no, s.title,
      s.pov_character_id, s.location_id, s.timeline_event_id,
      s.objective, s.time_of_day, s.summary,
      s.content, s.conflict, s.turning_point, s.outcome, s.hook,
      s.indesign_style,
      s.created_at, s.updated_at, s.deleted_at,
      c.name as pov_character_name,
      ${povSurnameExpr} as pov_character_surname,
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

  const surnameList = hasCharSurname ? 'c.surname' : 'NULL AS surname'
  const orderSurname = hasCharSurname ? ', c.surname ASC' : ''

  // Récupère tous les personnages de la scène
  const sceneCharacters = await dbQuery(
    `
    SELECT 
      c.id, c.slug, c.name, ${surnameList}, c.avatar_url, c.role,
      sc.role as scene_role
    FROM scene_characters sc
    JOIN characters c ON sc.character_id = c.id
    WHERE sc.scene_id = ? AND c.deleted_at IS NULL
    ORDER BY c.name ASC${orderSurname}
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
