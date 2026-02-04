import { dbQuery } from '../../utils/db.js'


export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const slug = String(event.context.params.slug || '').trim()
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Invalid slug' })

  const body = await readBody(event)

  // slug figé
  if (body?.slug !== undefined) {
    throw createError({ statusCode: 400, statusMessage: 'slug is immutable' })
  }

  const allowed = ['title','title_en','title_pt','logline','pitch','status']
  const hasAny = allowed.some((k) => body?.[k] !== undefined)
  if (!hasAny) throw createError({ statusCode: 400, statusMessage: 'No fields to update' })

  const rows0 = await dbQuery(
    `SELECT id FROM projects WHERE owner_id=? AND slug=? LIMIT 1`,
    [user.id, slug]
  )
  if (!rows0?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  const projectId = rows0[0].id

  const sets = []
  const params = []

  if (body.title !== undefined) {
    const title = String(body.title || '').trim()
    if (!title) throw createError({ statusCode: 400, statusMessage: 'title cannot be empty' })
    sets.push('title=?'); params.push(title)
  }
  if (body.title_en !== undefined) { sets.push('title_en=?'); params.push(body.title_en ? String(body.title_en).trim() : null) }
  if (body.title_pt !== undefined) { sets.push('title_pt=?'); params.push(body.title_pt ? String(body.title_pt).trim() : null) }
  if (body.logline !== undefined)  { sets.push('logline=?');  params.push(body.logline ? String(body.logline).trim() : null) }
  if (body.pitch !== undefined)    { sets.push('pitch=?');    params.push(body.pitch ? String(body.pitch).trim() : null) }

  if (body.status !== undefined) {
    const status = body.status
    if (!['draft','active','archived'].includes(status)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid status' })
    }
    sets.push('status=?'); params.push(status)
  }

  await dbQuery(
    `UPDATE projects SET ${sets.join(', ')} WHERE id=? AND owner_id=?`,
    [...params, projectId, user.id]
  )

  const rows = await dbQuery(
    `
    SELECT id, owner_id, slug, title, title_en, title_pt, logline, pitch, status, created_at, updated_at
    FROM projects
    WHERE id=? AND owner_id=?
    LIMIT 1
    `,
    [projectId, user.id]
  )

  return { project: rows[0] }
})
