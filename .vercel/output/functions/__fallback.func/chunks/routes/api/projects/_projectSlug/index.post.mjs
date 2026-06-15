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
async function syncNarrators({ projectId, bookId, narratorIds }) {
  if (narratorIds === null) return;
  await dbQuery(`DELETE FROM book_narrators WHERE book_id=?`, [bookId]);
  if (!narratorIds.length) return;
  const placeholders = narratorIds.map(() => "?").join(",");
  const rows = await dbQuery(
    `SELECT id FROM characters WHERE project_id=? AND id IN (${placeholders})`,
    [projectId, ...narratorIds]
  );
  const found = new Set((rows || []).map((r) => Number(r.id)));
  for (const id of narratorIds) {
    if (!found.has(Number(id))) {
      throw createError({ statusCode: 400, statusMessage: "Invalid narrator_character_ids" });
    }
  }
  const values = narratorIds.map(() => "(?, ?)").join(",");
  const params = [];
  for (const id of narratorIds) {
    params.push(bookId, id);
  }
  await dbQuery(
    `INSERT INTO book_narrators (book_id, character_id) VALUES ${values}`,
    params
  );
}
const index_post = defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const projectSlug = String(event.context.params.projectSlug || "").trim();
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: "Invalid projectSlug" });
  const project = await getProjectByOwnerSlug(user.id, projectSlug);
  if (!project) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  const body = await readBody(event);
  const title = String((body == null ? void 0 : body.title) || "").trim();
  if (!title) throw createError({ statusCode: 400, statusMessage: "title is required" });
  const slug = toSlug((body == null ? void 0 : body.slug) || title) || `book-${Date.now()}`;
  const subtitle = (body == null ? void 0 : body.subtitle) !== void 0 ? String(body.subtitle || "").trim() : null;
  const subtitleEn = (body == null ? void 0 : body.subtitle_en) !== void 0 ? String(body.subtitle_en || "").trim() : null;
  const subtitlePt = (body == null ? void 0 : body.subtitle_pt) !== void 0 ? String(body.subtitle_pt || "").trim() : null;
  const summary = (body == null ? void 0 : body.summary) !== void 0 ? String(body.summary || "").trim() : null;
  const narratorIdsRaw = Array.isArray(body == null ? void 0 : body.narrator_character_ids) ? body.narrator_character_ids : null;
  const narratorIds = narratorIdsRaw ? [...new Set(narratorIdsRaw.map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0))] : null;
  try {
    await dbQuery(
      `
      INSERT INTO books (project_id, slug, title, subtitle, subtitle_en, subtitle_pt, summary)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        project.id,
        slug,
        title,
        subtitle || null,
        subtitleEn || null,
        subtitlePt || null,
        summary || null
      ]
    );
  } catch (err) {
    if (String(err == null ? void 0 : err.code) === "ER_DUP_ENTRY") {
      throw createError({ statusCode: 409, statusMessage: "Book slug already exists in this project" });
    }
    throw err;
  }
  const rows = await dbQuery(
    `
    SELECT id, project_id, slug, title, subtitle, subtitle_en, subtitle_pt, summary, created_at, updated_at, deleted_at
    FROM books
    WHERE project_id=? AND slug=?
    LIMIT 1
    `,
    [project.id, slug]
  );
  const book = (rows == null ? void 0 : rows[0]) || null;
  if (!book) throw createError({ statusCode: 500, statusMessage: "Insert failed" });
  await syncNarrators({ projectId: project.id, bookId: book.id, narratorIds });
  const narrators = await dbQuery(
    `
    SELECT c.id, c.slug, c.name
    FROM book_narrators bn
    JOIN characters c ON c.id = bn.character_id
    WHERE bn.book_id=?
    ORDER BY c.name ASC, c.id ASC
    `,
    [book.id]
  );
  return { book, narrators };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
