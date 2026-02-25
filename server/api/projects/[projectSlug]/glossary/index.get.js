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

  const cols = await getTableColumns('glossary_terms')
  const hasProjectId = cols.has('project_id')
  const termCol = pickColumn(cols, ['term', 'name', 'title'])
  const defCol = pickColumn(cols, ['definition', 'description', 'meaning'])
  const langCol = pickColumn(cols, ['language', 'lang', 'locale'])

  const { q, lang } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null
  const langQuery = (lang ? String(lang).trim() : '') || null

  const where = []
  const params = []

  if (hasProjectId) {
    where.push('project_id=?')
    params.push(project.id)
  }

  if (langQuery && langCol) {
    where.push(`${langCol}=?`)
    params.push(langQuery)
  }

  if (query) {
    const likeParts = []
    if (termCol) {
      likeParts.push(`${termCol} LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    if (cols.has('slug')) {
      likeParts.push(`slug LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    if (defCol) {
      likeParts.push(`${defCol} LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    if (likeParts.length) where.push(`(${likeParts.join(' OR ')})`)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const orderSql = termCol ? `ORDER BY ${termCol} ASC` : (cols.has('id') ? 'ORDER BY id DESC' : '')

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
