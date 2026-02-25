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
  const eventIdRaw = String(event.context.params.eventId || '').trim()
  if (!projectSlug || !eventIdRaw) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const cols = await getTableColumns('timeline_events')
  const hasId = cols.has('id')
  const slugCol = cols.has('slug') ? 'slug' : null

  let where = ''
  const whereParams = []
  const idVal = Number(eventIdRaw)
  if (hasId && Number.isFinite(idVal) && idVal > 0) {
    where = 'id=?'
    whereParams.push(idVal)
  } else if (slugCol) {
    where = `${slugCol}=?`
    whereParams.push(eventIdRaw)
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Invalid event identifier' })
  }
  if (cols.has('project_id')) {
    where += ' AND project_id=?'
    whereParams.push(project.id)
  }

  const body = await readBody(event)

  const titleCol = pickColumn(cols, ['title', 'name', 'label', 'event'])
  const descCol = pickColumn(cols, ['description', 'summary', 'note'])
  const dateStartCol = pickColumn(cols, ['date_start', 'start_date', 'in_story_date_start', 'event_date', 'date'])
  const dateEndCol = pickColumn(cols, ['date_end', 'end_date', 'in_story_date_end'])
  const locCol = cols.has('location_id') ? 'location_id' : null

  const sets = []
  const params = []

  if (body.title !== undefined && titleCol) {
    const title = String(body.title || '').trim()
    if (!title) throw createError({ statusCode: 400, statusMessage: 'title cannot be empty' })
    sets.push(`${titleCol}=?`)
    params.push(title)
  }

  if (body.slug !== undefined && slugCol) {
    const slug = toSlug(body.slug || '')
    if (slug) {
      sets.push(`${slugCol}=?`)
      params.push(slug)
    }
  }

  if (body.description !== undefined && descCol) {
    sets.push(`${descCol}=?`)
    params.push(body.description ? String(body.description).trim() : null)
  }

  if (body.date_start !== undefined && dateStartCol) {
    sets.push(`${dateStartCol}=?`)
    params.push(body.date_start ? String(body.date_start).trim() : null)
  }

  if (body.date_end !== undefined && dateEndCol) {
    sets.push(`${dateEndCol}=?`)
    params.push(body.date_end ? String(body.date_end).trim() : null)
  }

  if (body.location_id !== undefined && locCol) {
    sets.push(`${locCol}=?`)
    params.push(body.location_id ? Number(body.location_id) : null)
  }

  if (!sets.length) throw createError({ statusCode: 400, statusMessage: 'No fields to update' })

  await dbQuery(
    `UPDATE timeline_events SET ${sets.join(', ')} WHERE ${where}`,
    [...params, ...whereParams]
  )

  const rows = await dbQuery(
    `
    SELECT * FROM timeline_events
    WHERE ${where}
    LIMIT 1
    `,
    whereParams
  )

  return { event: rows?.[0] || null }
})
