import { d as defineEventHandler, e as createError, a as dbQuery } from '../../../nitro/nitro.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const slug = String(event.context.params.slug || "").trim();
  if (!slug) throw createError({ statusCode: 400, statusMessage: "Invalid slug" });
  const rows = await dbQuery(
    `
    SELECT id, owner_id, slug, title, title_en, title_pt, logline, pitch, status, created_at, updated_at
    FROM projects
    WHERE owner_id=? AND slug=?
    LIMIT 1
    `,
    [user.id, slug]
  );
  if (!(rows == null ? void 0 : rows.length)) throw createError({ statusCode: 404, statusMessage: "Not found" });
  return { project: rows[0] };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
