// server/api/projects/[projectSlug]/scenes/index.get.js
import { dbQuery } from '../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = Number(user?.id || user?.sub)
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })

  // Récupère le projet
  const projectRows = await dbQuery(
    'SELECT id, slug, title FROM projects WHERE owner_id = ? AND slug = ? AND deleted_at IS NULL LIMIT 1',
    [userId, projectSlug]
  )
  const project = projectRows[0]
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const { q, chapter_id, trashed } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null
  const chapterId = chapter_id ? Number(chapter_id) : null
  const trashedFlag = String(trashed || '') === '1' ? 1 : 0

  // Récupère les scènes avec les personnages POV
  const rows = await dbQuery(
    `
    SELECT 
      s.id, s.project_id, s.slug, s.chapter_id, s.scene_no, s.title,
      s.pov_character_id, s.location_id, s.timeline_event_id,
      s.objective, s.time_of_day, s.summary,
      s.content, s.conflict, s.turning_point, s.outcome, s.hook,
      s.indesign_style,
      s.created_at, s.updated_at, s.deleted_at,
      c.name as pov_character_name,
      c.surname as pov_character_surname,
      c.avatar_url as pov_character_avatar,
      (SELECT COUNT(*) FROM scene_characters WHERE scene_id = s.id) as character_count
    FROM scenes s
    LEFT JOIN characters c ON s.pov_character_id = c.id
    WHERE s.project_id = ?
      AND (? IS NULL OR s.chapter_id = ?)
      AND (
        (? = 1 AND s.deleted_at IS NOT NULL) OR
        (? = 0 AND s.deleted_at IS NULL)
      )
      AND (
        ? IS NULL
        OR s.title LIKE CONCAT('%', ?, '%')
        OR s.slug LIKE CONCAT('%', ?, '%')
        OR s.summary LIKE CONCAT('%', ?, '%')
      )
    ORDER BY s.scene_no ASC, s.id ASC
    LIMIT 500
    `,
    [
      project.id,
      chapterId,
      chapterId,
      trashedFlag,
      trashedFlag,
      query,
      query,
      query,
      query,
    ]
  )

  return { project: { slug: project.slug, id: project.id, title: project.title }, scenes: rows }
})
