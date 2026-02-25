import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'
import { getTableColumns } from '../../../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const termIdRaw = String(event.context.params.termId || '').trim()
  if (!projectSlug || !termIdRaw) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const cols = await getTableColumns('glossary_terms')
  const hasId = cols.has('id')
  const slugCol = cols.has('slug') ? 'slug' : null

  let where = ''
  const params = []
  const idVal = Number(termIdRaw)
  if (hasId && Number.isFinite(idVal) && idVal > 0) {
    where = 'id=?'
    params.push(idVal)
  } else if (slugCol) {
    where = `${slugCol}=?`
    params.push(termIdRaw)
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Invalid term identifier' })
  }

  if (cols.has('project_id')) {
    where += ' AND project_id=?'
    params.push(project.id)
  }

  const res = await dbQuery(
    `DELETE FROM glossary_terms WHERE ${where}`,
    params
  )

  if (!res?.affectedRows) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { ok: true }
})
