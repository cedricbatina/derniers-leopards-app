import { d as defineEventHandler, e as createError, z as getProjectByOwnerSlug, x as getQuery, a as dbQuery } from '../../../../nitro/nitro.mjs';
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
  if (!(user == null ? void 0 : user.id)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const projectSlug = String(event.context.params.projectSlug || "").trim();
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: "Invalid projectSlug" });
  const project = await getProjectByOwnerSlug(user.id, projectSlug);
  if (!project) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  const { q, trashed } = getQuery(event);
  const query = (q ? String(q).trim() : "") || null;
  const trashedFlag = String(trashed || "") === "1" ? 1 : 0;
  const rows = await dbQuery(
    `
    SELECT id, project_id, slug, name, description, created_at, updated_at, deleted_at
    FROM characters
    WHERE project_id = ?
      AND (
        (? = 1 AND deleted_at IS NOT NULL) OR
        (? = 0 AND deleted_at IS NULL)
      )
      AND (? IS NULL OR name LIKE CONCAT('%', ?, '%') OR slug LIKE CONCAT('%', ?, '%'))
    ORDER BY name ASC, id ASC
    LIMIT 500
    `,
    [project.id, trashedFlag, trashedFlag, query, query, query]
  );
  return { project: { slug: project.slug, id: project.id }, characters: rows };
});

export { index_get as default };
//# sourceMappingURL=index.get3.mjs.map
