import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'
import { getTableColumns } from '../../../../utils/schema.js'

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
  const params = []

  const idVal = Number(eventIdRaw)
  if (hasId && Number.isFinite(idVal) && idVal > 0) {
    where = 'id=?'
    params.push(idVal)
  } else if (slugCol) {
    where = `${slugCol}=?`
    params.push(eventIdRaw)
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Invalid event identifier' })
  }

  if (cols.has('project_id')) {
    where += ' AND project_id=?'
    params.push(project.id)
  }

  const rows = await dbQuery(
    `
    SELECT * FROM timeline_events
    WHERE ${where}
    LIMIT 1
    `,
    params
  )

  if (!rows?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { event: rows[0] }
})
