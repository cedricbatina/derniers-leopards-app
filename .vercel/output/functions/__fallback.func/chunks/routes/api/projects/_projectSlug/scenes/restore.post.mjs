import { d as defineEventHandler, e as createError, r as readBody, z as getProjectByOwnerSlug, a as dbQuery } from '../../../../../nitro/nitro.mjs';
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

const restore_post = defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const projectSlug = String(event.context.params.projectSlug || "").trim();
  const body = await readBody(event).catch(() => ({}));
  const sceneSlug = String(
    event.context.params.sceneSlug || (body == null ? void 0 : body.sceneSlug) || (body == null ? void 0 : body.scene_slug) || (body == null ? void 0 : body.slug) || ""
  ).trim();
  if (!projectSlug || !sceneSlug) throw createError({ statusCode: 400, statusMessage: "Invalid params" });
  const project = await getProjectByOwnerSlug(user.id, projectSlug);
  if (!project) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  const res = await dbQuery(
    `
    UPDATE scenes
    SET deleted_at = NULL
    WHERE project_id=? AND slug=? AND deleted_at IS NOT NULL
    `,
    [project.id, sceneSlug]
  );
  if (!(res == null ? void 0 : res.affectedRows)) throw createError({ statusCode: 404, statusMessage: "Not found" });
  return { ok: true };
});

export { restore_post as default };
//# sourceMappingURL=restore.post.mjs.map
