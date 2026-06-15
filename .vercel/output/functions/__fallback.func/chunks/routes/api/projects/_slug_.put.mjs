import { d as defineEventHandler, e as createError, r as readBody, a as dbQuery } from '../../../nitro/nitro.mjs';
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

const _slug__put = defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const slug = String(event.context.params.slug || "").trim();
  if (!slug) throw createError({ statusCode: 400, statusMessage: "Invalid slug" });
  const body = await readBody(event);
  if ((body == null ? void 0 : body.slug) !== void 0) {
    throw createError({ statusCode: 400, statusMessage: "slug is immutable" });
  }
  const allowed = ["title", "title_en", "title_pt", "logline", "pitch", "status"];
  const hasAny = allowed.some((k) => (body == null ? void 0 : body[k]) !== void 0);
  if (!hasAny) throw createError({ statusCode: 400, statusMessage: "No fields to update" });
  const rows0 = await dbQuery(
    `SELECT id FROM projects WHERE owner_id=? AND slug=? LIMIT 1`,
    [user.id, slug]
  );
  if (!(rows0 == null ? void 0 : rows0.length)) throw createError({ statusCode: 404, statusMessage: "Not found" });
  const projectId = rows0[0].id;
  const sets = [];
  const params = [];
  if (body.title !== void 0) {
    const title = String(body.title || "").trim();
    if (!title) throw createError({ statusCode: 400, statusMessage: "title cannot be empty" });
    sets.push("title=?");
    params.push(title);
  }
  if (body.title_en !== void 0) {
    sets.push("title_en=?");
    params.push(body.title_en ? String(body.title_en).trim() : null);
  }
  if (body.title_pt !== void 0) {
    sets.push("title_pt=?");
    params.push(body.title_pt ? String(body.title_pt).trim() : null);
  }
  if (body.logline !== void 0) {
    sets.push("logline=?");
    params.push(body.logline ? String(body.logline).trim() : null);
  }
  if (body.pitch !== void 0) {
    sets.push("pitch=?");
    params.push(body.pitch ? String(body.pitch).trim() : null);
  }
  if (body.status !== void 0) {
    const status = body.status;
    if (!["draft", "active", "archived"].includes(status)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid status" });
    }
    sets.push("status=?");
    params.push(status);
  }
  await dbQuery(
    `UPDATE projects SET ${sets.join(", ")} WHERE id=? AND owner_id=?`,
    [...params, projectId, user.id]
  );
  const rows = await dbQuery(
    `
    SELECT id, owner_id, slug, title, title_en, title_pt, logline, pitch, status, created_at, updated_at
    FROM projects
    WHERE id=? AND owner_id=?
    LIMIT 1
    `,
    [projectId, user.id]
  );
  return { project: rows[0] };
});

export { _slug__put as default };
//# sourceMappingURL=_slug_.put.mjs.map
