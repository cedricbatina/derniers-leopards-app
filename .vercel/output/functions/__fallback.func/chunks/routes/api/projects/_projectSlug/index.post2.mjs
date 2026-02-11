import { d as defineEventHandler, e as createError, z as getProjectByOwnerSlug, r as readBody, a as dbQuery } from '../../../../nitro/nitro.mjs';
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
  const projectSlug = String(event.context.params.projectSlug || "").trim();
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: "Invalid projectSlug" });
  const project = await getProjectByOwnerSlug(user.id, projectSlug);
  if (!project) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  const body = await readBody(event);
  const name = String((body == null ? void 0 : body.name) || "").trim();
  if (!name) throw createError({ statusCode: 400, statusMessage: "name is required" });
  const slug = toSlug((body == null ? void 0 : body.slug) || name) || `character-${Date.now()}`;
  const description = (body == null ? void 0 : body.description) ? String(body.description).trim() : null;
  try {
    await dbQuery(
      `
      INSERT INTO characters (project_id, slug, name, description)
      VALUES (?, ?, ?, ?)
      `,
      [project.id, slug, name, description]
    );
  } catch (err) {
    if (String(err == null ? void 0 : err.code) === "ER_DUP_ENTRY") {
      throw createError({ statusCode: 409, statusMessage: "Character slug already exists in this project" });
    }
    throw err;
  }
  const rows = await dbQuery(
    `SELECT id, project_id, slug, name, description, created_at, updated_at
     FROM characters
     WHERE project_id=? AND slug=?
     LIMIT 1`,
    [project.id, slug]
  );
  return { character: rows[0] || null };
});

export { index_post as default };
//# sourceMappingURL=index.post2.mjs.map
