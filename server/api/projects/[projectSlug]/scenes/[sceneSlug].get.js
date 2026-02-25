import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'
import { tableHasColumn } from '../../../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const sceneSlug = String(event.context.params.sceneSlug || '').trim()
  if (!projectSlug || !sceneSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid params' })
  }

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  const { trashed } = getQuery(event)
  const allowTrashed = String(trashed || '') === '1' ? 1 : 0

  const hasChapterProjectId = await tableHasColumn('chapters', 'project_id')

  const joinForProject = hasChapterProjectId
    ? ``
    : `
    JOIN parts p ON p.id = c.part_id
    JOIN books b ON b.id = p.book_id
  `

  const whereProject = hasChapterProjectId
    ? `AND c.project_id=?`
    : `AND b.project_id=?`

  const rows = await dbQuery(
    `
    SELECT s.*
    FROM scenes s
    JOIN chapters c ON c.id = s.chapter_id
    ${joinForProject}
    WHERE s.project_id=?
      ${whereProject}
      AND s.slug=?
      AND (? = 1 OR s.deleted_at IS NULL)
    LIMIT 1
    `,
    [project.id, project.id, sceneSlug, allowTrashed]
  )

  if (!rows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  return { scene: rows[0] }
})
