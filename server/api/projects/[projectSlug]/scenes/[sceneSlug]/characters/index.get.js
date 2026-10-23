import { dbQuery } from '../../../../../../utils/db.js'
import { getProjectForNarrativeApi } from '../../../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const sceneSlug = String(event.context.params.sceneSlug || '').trim()
  if (!projectSlug || !sceneSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const project = await getProjectForNarrativeApi(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const scenes = await dbQuery(
    'SELECT id, pov_character_id FROM scenes WHERE project_id=? AND slug=? AND deleted_at IS NULL LIMIT 1',
    [project.id, sceneSlug]
  )
  const scene = scenes[0]
  if (!scene) throw createError({ statusCode: 404, statusMessage: 'Scene not found' })

  const characters = await dbQuery(
    `SELECT c.id, c.slug, c.name, c.description, c.avatar_url, c.role,
            sc.role AS scene_role, sc.notes AS scene_notes,
            CASE WHEN c.id = ? THEN 1 ELSE 0 END AS is_pov
       FROM scene_characters sc
       JOIN characters c ON c.id=sc.character_id
      WHERE sc.scene_id=? AND c.project_id=? AND c.deleted_at IS NULL
      ORDER BY is_pov DESC, c.name ASC`,
    [scene.pov_character_id, scene.id, project.id]
  )

  const available = await dbQuery(
    `SELECT c.id, c.slug, c.name, c.description, c.avatar_url, c.role,
            CASE WHEN c.id = ? THEN 1 ELSE 0 END AS is_pov
       FROM characters c
      WHERE c.project_id=? AND c.deleted_at IS NULL
        AND NOT EXISTS (
          SELECT 1 FROM scene_characters sc
           WHERE sc.scene_id=? AND sc.character_id=c.id
        )
      ORDER BY is_pov DESC, c.name ASC`,
    [scene.pov_character_id, project.id, scene.id]
  )

  return { project: { id: project.id, slug: project.slug }, scene: { id: scene.id, slug: sceneSlug, pov_character_id: scene.pov_character_id }, characters, available }
})
