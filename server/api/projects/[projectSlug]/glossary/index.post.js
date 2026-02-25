import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'
import { getTableColumns } from '../../../../utils/schema.js'

function pickColumn(cols, candidates) {
  return candidates.find((c) => cols.has(c)) || null
}

function toSlug(input) {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const cols = await getTableColumns('glossary_terms')
  const termCol = pickColumn(cols, ['term', 'name', 'title'])
  if (!termCol) throw createError({ statusCode: 500, statusMessage: 'glossary_terms missing term column' })

  const slugCol = cols.has('slug') ? 'slug' : null
  const defCol = pickColumn(cols, ['definition', 'description', 'meaning'])
  const langCol = pickColumn(cols, ['language', 'lang', 'locale'])
  const usageCol = pickColumn(cols, ['usage_notes', 'usage_note', 'notes'])

  const body = await readBody(event)
  const term = String(body?.term || '').trim()
  if (!term) throw createError({ statusCode: 400, statusMessage: 'term is required' })

  const insertCols = []
  const insertVals = []

  if (cols.has('project_id')) {
    insertCols.push('project_id')
    insertVals.push(project.id)
  }

  insertCols.push(termCol)
  insertVals.push(term)

  let slug = null
  if (slugCol) {
    slug = toSlug(body?.slug || term) || `term-${Date.now()}`
    insertCols.push(slugCol)
    insertVals.push(slug)
  }

  if (langCol) {
    insertCols.push(langCol)
    insertVals.push(body?.language ? String(body.language).trim() : null)
  }

  if (defCol) {
    insertCols.push(defCol)
    insertVals.push(body?.definition ? String(body.definition).trim() : null)
  }

  if (usageCol) {
    insertCols.push(usageCol)
    insertVals.push(body?.usage_notes ? String(body.usage_notes).trim() : null)
  }

  const placeholders = insertCols.map(() => '?').join(', ')

  let res
  try {
    res = await dbQuery(
      `INSERT INTO glossary_terms (${insertCols.join(', ')}) VALUES (${placeholders})`,
      insertVals
    )
  } catch (err) {
    if (String(err?.code) === 'ER_DUP_ENTRY') {
      throw createError({ statusCode: 409, statusMessage: 'Glossary term already exists' })
    }
    throw err
  }

  const idCol = cols.has('id') ? 'id' : null
  let whereSql = ''
  const params = []

  if (idCol && res?.insertId) {
    whereSql = `WHERE ${idCol}=?`
    params.push(res.insertId)
  } else if (slugCol && slug) {
    whereSql = `WHERE ${slugCol}=?`
    params.push(slug)
    if (cols.has('project_id')) {
      whereSql += ' AND project_id=?'
      params.push(project.id)
    }
  }

  if (!whereSql) return { ok: true }

  const rows = await dbQuery(
    `
    SELECT * FROM glossary_terms
    ${whereSql}
    LIMIT 1
    `,
    params
  )

  return { term: rows?.[0] || null }
})
