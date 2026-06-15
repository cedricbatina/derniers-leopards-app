import { d as defineEventHandler, e as createError, z as getProjectByOwnerSlug, a as dbQuery } from '../../../../nitro/nitro.mjs';
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
  const rows = await dbQuery(
    `
    SELECT id, project_id, chapter_no
    FROM chapters
    WHERE project_id=?
    ORDER BY chapter_no ASC, id ASC
    LIMIT 2000
    `,
    [project.id]
  );
  return { project: { slug: project.slug, id: project.id }, chapters: rows };
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
