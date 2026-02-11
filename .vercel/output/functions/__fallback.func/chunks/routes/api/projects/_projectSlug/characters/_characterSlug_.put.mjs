import { d as defineEventHandler, e as createError, z as getProjectByOwnerSlug, r as readBody, a as dbQuery } from '../../../../../nitro/nitro.mjs';
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

const _characterSlug__put = defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const projectSlug = String(event.context.params.projectSlug || "").trim();
  const characterSlug = String(event.context.params.characterSlug || "").trim();
  if (!projectSlug || !characterSlug) throw createError({ statusCode: 400, statusMessage: "Invalid params" });
  const project = await getProjectByOwnerSlug(user.id, projectSlug);
  if (!project) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  const body = await readBody(event);
  if ((body == null ? void 0 : body.slug) !== void 0) {
    throw createError({ statusCode: 400, statusMessage: "slug is immutable" });
  }
  const rows0 = await dbQuery(
    `SELECT id FROM characters WHERE project_id=? AND slug=? AND deleted_at IS NULL LIMIT 1`,
    [project.id, characterSlug]
  );
  if (!(rows0 == null ? void 0 : rows0.length)) throw createError({ statusCode: 404, statusMessage: "Not found" });
  const characterId = rows0[0].id;
  const allowed = ["name", "description"];
  const hasAny = allowed.some((k) => (body == null ? void 0 : body[k]) !== void 0);
  if (!hasAny) throw createError({ statusCode: 400, statusMessage: "No fields to update" });
  const sets = [];
  const params = [];
  if (body.name !== void 0) {
    const name = String(body.name || "").trim();
    if (!name) throw createError({ statusCode: 400, statusMessage: "name cannot be empty" });
    sets.push("name=?");
    params.push(name);
  }
  if (body.description !== void 0) {
    sets.push("description=?");
    params.push(body.description ? String(body.description).trim() : null);
  }
  await dbQuery(
    `UPDATE characters SET ${sets.join(", ")} WHERE id=? AND project_id=?`,
    [...params, characterId, project.id]
  );
  const rows = await dbQuery(
    `SELECT id, project_id, slug, name, description, created_at, updated_at
     FROM characters
     WHERE id=? AND project_id=? LIMIT 1`,
    [characterId, project.id]
  );
  return { character: rows[0] };
});

export { _characterSlug__put as default };
//# sourceMappingURL=_characterSlug_.put.mjs.map
