// server/api/projects/[projectSlug]/scenes/index.get.js
import { dbQuery } from '../../../../utils/db.js'
import { getProjectForNarrativeApi, canManageProject } from '../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })

  const project = await getProjectForNarrativeApi(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const { q, chapter_id, trashed } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null
  const chapterId = chapter_id ? Number(chapter_id) : null
  const trashedFlag =
    canManageProject(project, user) && String(trashed || '') === '1' ? 1 : 0

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
      ch.title as chapter_title,
      (SELECT COUNT(*) FROM scene_characters WHERE scene_id = s.id) as character_count
    FROM scenes s
    LEFT JOIN characters c ON s.pov_character_id = c.id
    LEFT JOIN chapters ch ON ch.id = s.chapter_id
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
