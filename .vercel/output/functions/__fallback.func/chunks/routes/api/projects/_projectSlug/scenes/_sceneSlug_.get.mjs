import { d as defineEventHandler, e as createError, z as getProjectByOwnerSlug, a as dbQuery } from '../../../../../nitro/nitro.mjs';
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

const _sceneSlug__get = defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const projectSlug = String(event.context.params.projectSlug || "").trim();
  const sceneSlug = String(event.context.params.sceneSlug || "").trim();
  if (!projectSlug || !sceneSlug) throw createError({ statusCode: 400, statusMessage: "Invalid params" });
  const project = await getProjectByOwnerSlug(user.id, projectSlug);
  if (!project) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  const rows = await dbQuery(
    `
    SELECT s.*
    FROM scenes s
    JOIN chapters c ON c.id = s.chapter_id
    WHERE s.project_id=? AND s.slug=? AND s.deleted_at IS NULL

    LIMIT 1
    `,
    [project.id, sceneSlug, project.id]
  );
  if (!(rows == null ? void 0 : rows.length)) throw createError({ statusCode: 404, statusMessage: "Not found" });
  return { scene: rows[0] };
});

export { _sceneSlug__get as default };
//# sourceMappingURL=_sceneSlug_.get.mjs.map
