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

const _slug__delete = defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const slug = String(event.context.params.slug || "").trim();
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Invalid slug" });
  }
  const res = await dbQuery(
    `
    UPDATE projects
    SET deleted_at = NOW()
    WHERE owner_id=? AND slug=? AND deleted_at IS NULL
    `,
    [user.id, slug]
  );
  if (!(res == null ? void 0 : res.affectedRows)) throw createError({ statusCode: 404, statusMessage: "Not found" });
  return { ok: true };
});

export { _slug__delete as default };
//# sourceMappingURL=_slug_.delete.mjs.map
