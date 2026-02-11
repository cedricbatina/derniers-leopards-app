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

const _sceneSlug__put = defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const projectSlug = String(event.context.params.projectSlug || "").trim();
  const sceneSlug = String(event.context.params.sceneSlug || "").trim();
  if (!projectSlug || !sceneSlug) throw createError({ statusCode: 400, statusMessage: "Invalid params" });
  const project = await getProjectByOwnerSlug(user.id, projectSlug);
  if (!project) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  const body = await readBody(event);
  if ((body == null ? void 0 : body.slug) !== void 0) {
    throw createError({ statusCode: 400, statusMessage: "slug is immutable" });
  }
  const rows0 = await dbQuery(
    `SELECT id, chapter_id FROM scenes
   WHERE project_id=? AND slug=? AND deleted_at IS NULL
   LIMIT 1`,
    [project.id, sceneSlug]
  );
  if (!(rows0 == null ? void 0 : rows0.length)) throw createError({ statusCode: 404, statusMessage: "Not found" });
  const sceneId = rows0[0].id;
  const allowed = [
    "title",
    "scene_no",
    "chapter_id",
    "pov_character_id",
    "location_id",
    "timeline_event_id",
    "objective",
    "time_of_day",
    "summary",
    "content",
    "conflict",
    "turning_point",
    "outcome",
    "hook",
    "indesign_style"
  ];
  const hasAny = allowed.some((k) => (body == null ? void 0 : body[k]) !== void 0);
  if (!hasAny) throw createError({ statusCode: 400, statusMessage: "No fields to update" });
  const sets = [];
  const params = [];
  if (body.chapter_id !== void 0) {
    const chapterId = Number(body.chapter_id);
    if (!Number.isFinite(chapterId) || chapterId <= 0) throw createError({ statusCode: 400, statusMessage: "Invalid chapter_id" });
    const chapRows = await dbQuery(`SELECT id, project_id FROM chapters WHERE id=? LIMIT 1`, [chapterId]);
    const chapter = chapRows[0];
    if (!chapter || Number(chapter.project_id) !== Number(project.id)) {
      throw createError({ statusCode: 400, statusMessage: "chapter_id does not belong to this project" });
    }
    sets.push("chapter_id=?");
    params.push(chapterId);
  }
  if (body.scene_no !== void 0) {
    const sceneNo = Number(body.scene_no);
    if (!Number.isFinite(sceneNo) || sceneNo <= 0) throw createError({ statusCode: 400, statusMessage: "Invalid scene_no" });
    sets.push("scene_no=?");
    params.push(sceneNo);
  }
  if (body.title !== void 0) {
    sets.push("title=?");
    params.push(body.title ? String(body.title).trim() : null);
  }
  if (body.pov_character_id !== void 0) {
    sets.push("pov_character_id=?");
    params.push(body.pov_character_id ? Number(body.pov_character_id) : null);
  }
  if (body.location_id !== void 0) {
    sets.push("location_id=?");
    params.push(body.location_id ? Number(body.location_id) : null);
  }
  if (body.timeline_event_id !== void 0) {
    sets.push("timeline_event_id=?");
    params.push(body.timeline_event_id ? Number(body.timeline_event_id) : null);
  }
  if (body.objective !== void 0) {
    sets.push("objective=?");
    params.push(body.objective ? String(body.objective).trim() : null);
  }
  if (body.time_of_day !== void 0) {
    sets.push("time_of_day=?");
    params.push(body.time_of_day ? String(body.time_of_day).trim() : null);
  }
  if (body.content !== void 0) {
    sets.push("content=?");
    params.push(body.content === null ? null : String(body.content || ""));
  }
  if (body.summary !== void 0) {
    sets.push("summary=?");
    params.push(String(body.summary || "").trim());
  }
  if (body.conflict !== void 0) {
    sets.push("conflict=?");
    params.push(body.conflict ? String(body.conflict).trim() : null);
  }
  if (body.turning_point !== void 0) {
    sets.push("turning_point=?");
    params.push(body.turning_point ? String(body.turning_point).trim() : null);
  }
  if (body.outcome !== void 0) {
    sets.push("outcome=?");
    params.push(body.outcome ? String(body.outcome).trim() : null);
  }
  if (body.hook !== void 0) {
    sets.push("hook=?");
    params.push(body.hook ? String(body.hook).trim() : null);
  }
  if (body.indesign_style !== void 0) {
    sets.push("indesign_style=?");
    params.push(body.indesign_style ? String(body.indesign_style).trim() : null);
  }
  await dbQuery(
    `UPDATE scenes SET ${sets.join(", ")} WHERE id=? AND project_id=?`,
    [...params, sceneId, project.id]
  );
  const rows = await dbQuery(
    `SELECT * FROM scenes
   WHERE id=? AND project_id=? AND deleted_at IS NULL
   LIMIT 1`,
    [sceneId, project.id]
  );
  return { scene: rows[0] };
});

export { _sceneSlug__put as default };
//# sourceMappingURL=_sceneSlug_.put.mjs.map
