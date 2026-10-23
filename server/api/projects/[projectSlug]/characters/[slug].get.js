// server/api/projects/[projectSlug]/characters/[slug].get.js
import { dbQuery } from '../../../../utils/db.js'
import { getProjectForNarrativeApi, canManageProject } from '../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const characterSlug = String(event.context.params.slug || '').trim()

  if (!projectSlug || !characterSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid parameters' })
  }

  const project = await getProjectForNarrativeApi(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const { trashed } = getQuery(event)
  const allowTrashed = canManageProject(project, user) && String(trashed || '') === '1' ? 1 : 0

  const characterRows = await dbQuery(
    `
    SELECT 
      id, project_id, slug, name, description,
      created_at, updated_at, deleted_at
    FROM characters
    WHERE project_id = ? AND slug = ?
      AND (? = 1 OR deleted_at IS NULL)
    LIMIT 1
    `,
    [project.id, characterSlug, allowTrashed]
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
