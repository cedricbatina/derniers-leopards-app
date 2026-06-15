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

const _bookSlug__get = defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!(user == null ? void 0 : user.id)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const projectSlug = String(event.context.params.projectSlug || "").trim();
  const bookSlug = String(event.context.params.bookSlug || "").trim();
  if (!projectSlug || !bookSlug) throw createError({ statusCode: 400, statusMessage: "Invalid params" });
  const project = await getProjectByOwnerSlug(user.id, projectSlug);
  if (!project) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  const { trashed } = getQuery(event);
  const allowTrashed = String(trashed || "") === "1";
  const rows = await dbQuery(
    `
    SELECT id, project_id, slug, title, subtitle, subtitle_en, subtitle_pt, summary, created_at, updated_at, deleted_at
    FROM books
    WHERE project_id=? AND slug=?
      AND (${allowTrashed ? "1=1" : "deleted_at IS NULL"})
    LIMIT 1
    `,
    [project.id, bookSlug]
  );
  if (!(rows == null ? void 0 : rows.length)) throw createError({ statusCode: 404, statusMessage: "Not found" });
  const book = rows[0];
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

export { _bookSlug__get as default };
//# sourceMappingURL=_bookSlug_.get.mjs.map
