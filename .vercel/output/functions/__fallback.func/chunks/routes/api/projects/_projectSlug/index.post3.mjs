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
  var _a;
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const projectSlug = String(event.context.params.projectSlug || "").trim();
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: "Invalid projectSlug" });
  const project = await getProjectByOwnerSlug(user.id, projectSlug);
  if (!project) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  const body = await readBody(event);
  const chapterId = Number(body == null ? void 0 : body.chapter_id);
  if (!Number.isFinite(chapterId) || chapterId <= 0) {
    throw createError({ statusCode: 400, statusMessage: "chapter_id is required" });
  }
  const chapRows = await dbQuery(
    `SELECT id, project_id FROM chapters WHERE id=? LIMIT 1`,
    [chapterId]
  );
  const chapter = chapRows[0];
  if (!chapter || Number(chapter.project_id) !== Number(project.id)) {
    throw createError({ statusCode: 400, statusMessage: "chapter_id does not belong to this project" });
  }
  let sceneNo = (body == null ? void 0 : body.scene_no) !== void 0 ? Number(body.scene_no) : null;
  if (sceneNo !== null && (!Number.isFinite(sceneNo) || sceneNo <= 0)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid scene_no" });
  }
  if (!sceneNo) {
    const maxRows = await dbQuery(
      `SELECT COALESCE(MAX(scene_no), 0) AS m FROM scenes WHERE chapter_id=?`,
      [chapterId]
    );
    sceneNo = Number(((_a = maxRows == null ? void 0 : maxRows[0]) == null ? void 0 : _a.m) || 0) + 1;
  }
  const title = (body == null ? void 0 : body.title) !== void 0 ? String(body.title || "").trim() : null;
  const slug = toSlug((body == null ? void 0 : body.slug) || title || `scene-${sceneNo}`) || `scene-${Date.now()}`;
  const povId = (body == null ? void 0 : body.pov_character_id) ? Number(body.pov_character_id) : null;
  const locId = (body == null ? void 0 : body.location_id) ? Number(body.location_id) : null;
  const tlId = (body == null ? void 0 : body.timeline_event_id) ? Number(body.timeline_event_id) : null;
  const content = (body == null ? void 0 : body.content) !== void 0 ? String(body.content || "") : null;
  const objective = (body == null ? void 0 : body.objective) ? String(body.objective).trim() : null;
  const timeOfDay = (body == null ? void 0 : body.time_of_day) ? String(body.time_of_day).trim() : null;
  const summary = (body == null ? void 0 : body.summary) !== void 0 ? String(body.summary || "").trim() : "";
  const conflict = (body == null ? void 0 : body.conflict) ? String(body.conflict).trim() : null;
  const turningPoint = (body == null ? void 0 : body.turning_point) ? String(body.turning_point).trim() : null;
  const outcome = (body == null ? void 0 : body.outcome) ? String(body.outcome).trim() : null;
  const hook = (body == null ? void 0 : body.hook) ? String(body.hook).trim() : null;
  const indesignStyle = (body == null ? void 0 : body.indesign_style) ? String(body.indesign_style).trim() : null;
  try {
    await dbQuery(
      `
      INSERT INTO scenes (
        project_id, slug, chapter_id, scene_no, title,
        pov_character_id, location_id, timeline_event_id,
        objective, time_of_day, summary, content, conflict, turning_point, outcome, hook,
        indesign_style
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

      `,
      [
        project.id,
        slug,
        chapterId,
        sceneNo,
        title,
        povId || null,
        locId || null,
        tlId || null,
        objective,
        timeOfDay,
        summary,
        content,
        conflict,
        turningPoint,
        outcome,
        hook,
        indesignStyle
      ]
    );
  } catch (err) {
    if (String(err == null ? void 0 : err.code) === "ER_DUP_ENTRY") {
      throw createError({ statusCode: 409, statusMessage: "Scene slug already exists" });
    }
    throw err;
  }
  const rows = await dbQuery(
    `
    SELECT * FROM scenes
    WHERE project_id=? AND slug=?
    LIMIT 1
    `,
    [project.id, slug]
  );
  return { scene: rows[0] || null };
});

export { index_post as default };
//# sourceMappingURL=index.post3.mjs.map
