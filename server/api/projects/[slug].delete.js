import { dbQuery } from '../../utils/db.js'


export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const slug = String(event.context.params.slug || '').trim()
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Invalid slug' })

  const res = await dbQuery(
    `DELETE FROM projects WHERE owner_id=? AND slug=?`,
    [user.id, slug]
  )

  if (!res?.affectedRows) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { ok: true }
})
