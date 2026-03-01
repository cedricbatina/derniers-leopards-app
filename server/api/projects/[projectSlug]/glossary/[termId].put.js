import { dbQuery } from '../../../../utils/db.js'
import { getProjectByAccess } from '../../../../utils/projects.js'
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
  const termIdRaw = String(event.context.params.termId || '').trim()
  if (!projectSlug || !termIdRaw) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const project = await getProjectByAccess(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const cols = await getTableColumns('glossary_terms')
  const hasId = cols.has('id')
  const slugCol = cols.has('slug') ? 'slug' : null

  let where = ''
  const whereParams = []
  const idVal = Number(termIdRaw)
  if (hasId && Number.isFinite(idVal) && idVal > 0) {
    where = 'id=?'
    whereParams.push(idVal)
  } else if (slugCol) {
    where = `${slugCol}=?`
    whereParams.push(termIdRaw)
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Invalid term identifier' })
  }
  if (cols.has('project_id')) {
    where += ' AND project_id=?'
    whereParams.push(project.id)
  }

  const body = await readBody(event)

  const termCol = pickColumn(cols, ['term', 'name', 'title'])
  const defCol = pickColumn(cols, ['definition', 'description', 'meaning'])
  const langCol = pickColumn(cols, ['language', 'lang', 'locale'])
  const usageCol = pickColumn(cols, ['usage_notes', 'usage_note', 'notes'])

  const sets = []
  const params = []

  if (body.term !== undefined && termCol) {
    const term = String(body.term || '').trim()
    if (!term) throw createError({ statusCode: 400, statusMessage: 'term cannot be empty' })
    sets.push(`${termCol}=?`)
    params.push(term)
  }

  if (body.slug !== undefined && slugCol) {
    const slug = toSlug(body.slug || '')
    if (slug) {
      sets.push(`${slugCol}=?`)
      params.push(slug)
    }
  }

  if (body.language !== undefined && langCol) {
    sets.push(`${langCol}=?`)
    params.push(body.language ? String(body.language).trim() : null)
  }

  if (body.definition !== undefined && defCol) {
    sets.push(`${defCol}=?`)
    params.push(body.definition ? String(body.definition).trim() : null)
  }

  if (body.usage_notes !== undefined && usageCol) {
    sets.push(`${usageCol}=?`)
    params.push(body.usage_notes ? String(body.usage_notes).trim() : null)
  }

  if (!sets.length) throw createError({ statusCode: 400, statusMessage: 'No fields to update' })

  await dbQuery(
    `UPDATE glossary_terms SET ${sets.join(', ')} WHERE ${where}`,
    [...params, ...whereParams]
  )

  const rows = await dbQuery(
    `SELECT * FROM glossary_terms WHERE ${where} LIMIT 1`,
    whereParams
  )

  return { term: rows?.[0] || null }
})
