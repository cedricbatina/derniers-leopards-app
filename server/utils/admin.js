import { createError } from 'h3'
import { dbQuery } from './db.js'

/** Admin JWT `users.role` or `user_roles` / `roles` slug `admin`. */
export async function assertAdmin(event) {
  const user = event.context.user
  const uid = Number(user?.id ?? user?.sub)
  if (!Number.isFinite(uid)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: { code: 'AUTH_REQUIRED' },
    })
  }
  if (String(user?.role || '') === 'admin') return

  const rows = await dbQuery(
    `SELECT 1 AS ok
     FROM user_roles ur
     INNER JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = ?
       AND r.slug = 'admin'
     LIMIT 1`,
    [uid]
  )
  if (!rows?.length) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: admin role required',
      data: { code: 'ADMIN_REQUIRED' },
    })
  }
}
