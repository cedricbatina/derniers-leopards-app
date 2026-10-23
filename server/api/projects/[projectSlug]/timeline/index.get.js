import { dbQuery } from '../../../../utils/db.js'
import { getProjectByAccess } from '../../../../utils/projects.js'
import { getTableColumns } from '../../../../utils/schema.js'

function pickColumn(cols, candidates) {
  return candidates.find((c) => cols.has(c)) || null
}

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })

  const project = await getProjectByAccess(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const cols = await getTableColumns('timeline_events')
  const titleCol = pickColumn(cols, ['title', 'name', 'label', 'event'])
  if (!titleCol) throw createError({ statusCode: 500, statusMessage: 'timeline_events missing title column' })

  const { q } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null

  const where = []
  const params = []

  if (cols.has('project_id')) {
    where.push('project_id=?')
    params.push(project.id)
  }

  if (query) {
    const likeParts = []
    likeParts.push(`${titleCol} LIKE CONCAT('%', ?, '%')`)
    params.push(query)
    if (cols.has('slug')) {
      likeParts.push(`slug LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    const descCol = pickColumn(cols, ['description', 'summary', 'note'])
    if (descCol) {
      likeParts.push(`${descCol} LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    where.push(`(${likeParts.join(' OR ')})`)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const dateStartCol = pickColumn(cols, ['date_start', 'start_date', 'in_story_date_start', 'event_date', 'date'])
  const orderSql = dateStartCol ? `ORDER BY ${dateStartCol} ASC, id ASC` : cols.has('id') ? 'ORDER BY id ASC' : ''

  const rows = await dbQuery(
    `
    SELECT * FROM timeline_events
    ${whereSql}
    ${orderSql}
    LIMIT 500
    `,
    params
  )

  return { project: { slug: project.slug, id: project.id }, events: rows }
})
