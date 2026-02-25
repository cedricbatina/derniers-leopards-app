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

  const cols = await getTableColumns('timeline_events')
  const titleCol = pickColumn(cols, ['title', 'name', 'label', 'event'])
  if (!titleCol) throw createError({ statusCode: 500, statusMessage: 'timeline_events missing title column' })

  const body = await readBody(event)

  const title = String(body?.title || '').trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'title is required' })

  const slugCol = cols.has('slug') ? 'slug' : null
  const descCol = pickColumn(cols, ['description', 'summary', 'note'])
  const dateStartCol = pickColumn(cols, ['date_start', 'start_date', 'in_story_date_start', 'event_date', 'date'])
  const dateEndCol = pickColumn(cols, ['date_end', 'end_date', 'in_story_date_end'])
  const locCol = cols.has('location_id') ? 'location_id' : null

  const insertCols = []
  const insertVals = []

  if (cols.has('project_id')) {
    insertCols.push('project_id')
    insertVals.push(project.id)
  }

  insertCols.push(titleCol)
  insertVals.push(title)

  let slug = null
  if (slugCol) {
    slug = toSlug(body?.slug || title) || `event-${Date.now()}`
    insertCols.push(slugCol)
    insertVals.push(slug)
  }

  if (descCol) {
    insertCols.push(descCol)
    insertVals.push(body?.description !== undefined ? String(body.description || '').trim() : null)
  }

  if (dateStartCol) {
    insertCols.push(dateStartCol)
    insertVals.push(body?.date_start ? String(body.date_start).trim() : null)
  }

  if (dateEndCol) {
    insertCols.push(dateEndCol)
    insertVals.push(body?.date_end ? String(body.date_end).trim() : null)
  }

  if (locCol) {
    insertCols.push(locCol)
    insertVals.push(body?.location_id ? Number(body.location_id) : null)
  }

  const placeholders = insertCols.map(() => '?').join(', ')

  let res
  try {
    res = await dbQuery(
      `INSERT INTO timeline_events (${insertCols.join(', ')}) VALUES (${placeholders})`,
      insertVals
    )
  } catch (err) {
    if (String(err?.code) === 'ER_DUP_ENTRY') {
      throw createError({ statusCode: 409, statusMessage: 'Timeline event slug already exists' })
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
    SELECT * FROM timeline_events
    ${whereSql}
    LIMIT 1
    `,
    params
  )

  return { event: rows?.[0] || null }
})
