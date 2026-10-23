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

  const { q, lang } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null
  const langQuery = (lang ? String(lang).trim() : '') || null

  const cols = await getTableColumns('glossary_terms')
  const termCol = pickColumn(cols, ['term', 'name', 'title'])
  if (!termCol) throw createError({ statusCode: 500, statusMessage: 'glossary_terms missing term column' })

  const defCol = pickColumn(cols, ['definition', 'description', 'meaning'])
  const langCol = pickColumn(cols, ['language', 'lang', 'locale'])

  const where = []
  const params = []

  if (cols.has('project_id')) {
    where.push('project_id=?')
    params.push(project.id)
  }

  if (langQuery && langCol) {
    where.push(`${langCol}=?`)
    params.push(langQuery)
  }

  if (query) {
    const likeParts = []
    likeParts.push(`${termCol} LIKE CONCAT('%', ?, '%')`)
    params.push(query)
    if (cols.has('slug')) {
      likeParts.push(`slug LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    if (defCol) {
      likeParts.push(`${defCol} LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    where.push(`(${likeParts.join(' OR ')})`)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const orderSql = `ORDER BY ${termCol} ASC`

  const rows = await dbQuery(
    `
    SELECT * FROM glossary_terms
    ${whereSql}
    ${orderSql}
    LIMIT 500
    `,
    params
  )

  return { terms: rows }
})
