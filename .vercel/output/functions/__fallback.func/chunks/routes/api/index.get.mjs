import { d as defineEventHandler, e as createError, x as getQuery, a as dbQuery } from '../../nitro/nitro.mjs';
import 'node:crypto';
import 'nodemailer';
import 'mysql2/promise';
import 'argon2';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'vue';
import 'vue-router';
import 'jose';
import '@iconify/utils';
import 'consola';
import 'node:url';
import 'ipx';

const index_get = defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const { q, trashed } = getQuery(event);
  const query = (q ? String(q).trim() : "") || null;
  const trashedFlag = String(trashed || "") === "1" ? 1 : 0;
  const rows = await dbQuery(
    `
    SELECT id, owner_id, slug, title, title_en, title_pt, logline, status, created_at, updated_at, deleted_at
    FROM projects
    WHERE owner_id = ?
      AND (
        (? = 1 AND deleted_at IS NOT NULL) OR
        (? = 0 AND deleted_at IS NULL)
      )
      AND (? IS NULL OR title LIKE CONCAT('%', ?, '%') OR slug LIKE CONCAT('%', ?, '%'))
    ORDER BY updated_at DESC, id DESC
    LIMIT 200
    `,
    [user.id, trashedFlag, trashedFlag, query, query, query]
  );
  return { projects: rows };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
