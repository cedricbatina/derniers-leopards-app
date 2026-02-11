import { d as defineEventHandler, e as createError, z as getProjectByOwnerSlug, x as getQuery, a as dbQuery } from '../../../../../nitro/nitro.mjs';
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

const _characterSlug__get = defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const projectSlug = String(event.context.params.projectSlug || "").trim();
  const characterSlug = String(event.context.params.characterSlug || "").trim();
  if (!projectSlug || !characterSlug) throw createError({ statusCode: 400, statusMessage: "Invalid params" });
  const project = await getProjectByOwnerSlug(user.id, projectSlug);
  if (!project) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  const { trashed } = getQuery(event);
  const allowTrashed = String(trashed || "") === "1" ? 1 : 0;
  const rows = await dbQuery(
    `
     SELECT id, project_id, slug, name, description, created_at, updated_at, deleted_at
     FROM characters
     WHERE project_id=? AND slug=? AND (? = 1 OR deleted_at IS NULL)
     LIMIT 1
     `,
    [project.id, characterSlug, allowTrashed]
  );
  if (!(rows == null ? void 0 : rows.length)) throw createError({ statusCode: 404, statusMessage: "Not found" });
  return { character: rows[0] };
});

export { _characterSlug__get as default };
//# sourceMappingURL=_characterSlug_.get.mjs.map
