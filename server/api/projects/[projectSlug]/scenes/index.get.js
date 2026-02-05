// server/api/projects/[projectSlug]/scenes/index.get.js
import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })
  }

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  const { q, chapter_id, trashed } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null

  const chapterId = chapter_id ? Number(chapter_id) : null
  if (chapter_id && !Number.isFinite(chapterId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid chapter_id' })
  }

  const trashedFlag = String(trashed || '') === '1' ? 1 : 0

  const rows = await dbQuery(
    `
    SELECT
      s.id, s.project_id, s.slug, s.chapter_id, s.scene_no, s.title,
      s.pov_character_id, s.location_id, s.timeline_event_id,
      s.objective, s.time_of_day, s.summary, s.content, s.conflict, s.turning_point,
      s.outcome, s.hook, s.indesign_style,
      s.created_at, s.updated_at, s.deleted_at
    FROM scenes s
    JOIN chapters c ON c.id = s.chapter_id
    WHERE s.project_id = ?
      AND c.project_id = ?
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
    ORDER BY c.chapter_no ASC, s.scene_no ASC, s.id ASC
    LIMIT 500
    `,
    [
      project.id,
      project.id,
      chapterId,
      chapterId,
      trashedFlag,
      trashedFlag,
      query,
      query,
      query,
      query,
      query,
    ]
  )

  return { project: { slug: project.slug, id: project.id }, scenes: rows }
})
