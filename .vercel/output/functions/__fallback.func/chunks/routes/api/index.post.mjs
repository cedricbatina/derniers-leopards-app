import { d as defineEventHandler, e as createError, r as readBody, a as dbQuery } from '../../nitro/nitro.mjs';
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

function toSlug(input) {
  return String(input || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
const index_post = defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const body = await readBody(event);
  const title = String((body == null ? void 0 : body.title) || "").trim();
  if (!title) throw createError({ statusCode: 400, statusMessage: "title is required" });
  const slug = toSlug((body == null ? void 0 : body.slug) || title) || `project-${Date.now()}`;
  const titleEn = (body == null ? void 0 : body.title_en) ? String(body.title_en).trim() : null;
  const titlePt = (body == null ? void 0 : body.title_pt) ? String(body.title_pt).trim() : null;
  const logline = (body == null ? void 0 : body.logline) ? String(body.logline).trim() : null;
  const pitch = (body == null ? void 0 : body.pitch) ? String(body.pitch).trim() : null;
  const status = ["draft", "active", "archived"].includes(body == null ? void 0 : body.status) ? body.status : "active";
  try {
    await dbQuery(
      `
      INSERT INTO projects (owner_id, slug, title, title_en, title_pt, logline, pitch, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [user.id, slug, title, titleEn, titlePt, logline, pitch, status]
    );
    const rows = await dbQuery(
      `
      SELECT id, owner_id, slug, title, title_en, title_pt, logline, pitch, status, created_at, updated_at
      FROM projects
      WHERE owner_id=? AND slug=?
      LIMIT 1
      `,
      [user.id, slug]
    );
    return { project: rows[0] || null };
  } catch (err) {
    if (String(err == null ? void 0 : err.code) === "ER_DUP_ENTRY") {
      throw createError({ statusCode: 409, statusMessage: "Slug already exists for this owner" });
    }
    throw err;
  }
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
