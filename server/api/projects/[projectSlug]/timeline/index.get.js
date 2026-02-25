import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'
import { getTableColumns } from '../../../../utils/schema.js'

function pickColumn(cols, candidates) {
  return candidates.find((c) => cols.has(c)) || null
}

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const cols = await getTableColumns('timeline_events')
  const hasProjectId = cols.has('project_id')

  const { q } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null

  const where = []
  const params = []

  if (hasProjectId) {
    where.push('project_id=?')
    params.push(project.id)
  }

  if (query) {
    const likeParts = []
    const titleCol = pickColumn(cols, ['title', 'name', 'label', 'event'])
    const descCol = pickColumn(cols, ['description', 'summary', 'note'])
    if (titleCol) {
      likeParts.push(`${titleCol} LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    if (cols.has('slug')) {
      likeParts.push(`slug LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    if (descCol) {
      likeParts.push(`${descCol} LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    if (likeParts.length) where.push(`(${likeParts.join(' OR ')})`)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const dateCol = pickColumn(cols, ['date_start', 'start_date', 'in_story_date_start', 'event_date', 'date'])
  const orderSql = dateCol
    ? `ORDER BY ${dateCol} ASC${cols.has('id') ? ', id ASC' : ''}`
    : (cols.has('id') ? 'ORDER BY id DESC' : '')

  const rows = await dbQuery(
    `
    SELECT * FROM timeline_events
    ${whereSql}
    ${orderSql}
    LIMIT 500
    `,
    params
  )

  return { events: rows }
})
