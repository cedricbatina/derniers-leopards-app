import { d as defineEventHandler, x as getQuery, e as createError, g as getHeader, y as sendRedirect, s as sha256Hex, a as dbQuery } from '../../../nitro/nitro.mjs';
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

const verifyEmail_get = defineEventHandler(async (event) => {
  const { token } = getQuery(event);
  const raw = String(token || "").trim();
  if (!raw) {
    throw createError({ statusCode: 400, message: "Token manquant." });
  }
  const accept = String(getHeader(event, "accept") || "");
  if (accept.includes("text/html")) {
    return sendRedirect(event, `/verify-email?token=${encodeURIComponent(raw)}`, 302);
  }
  const tokenHash = sha256Hex(raw);
  await dbQuery("START TRANSACTION");
  try {
    const rows = await dbQuery(
      `SELECT id, user_id, used_at, expires_at
       FROM auth_tokens
       WHERE token_type = 'verify_email'
         AND token_hash = ?
       LIMIT 1`,
      [tokenHash]
    );
    const t = rows[0];
    if (!t) {
      throw createError({ statusCode: 400, message: "Token invalide." });
    }
    if (t.used_at) {
      throw createError({ statusCode: 400, message: "Token d\xE9j\xE0 utilis\xE9." });
    }
    const stillValid = await dbQuery(
      `SELECT id
       FROM auth_tokens
       WHERE id = ?
         AND expires_at > NOW()
         AND used_at IS NULL
       LIMIT 1`,
      [t.id]
    );
    if (!stillValid.length) {
      throw createError({ statusCode: 400, message: "Token expir\xE9." });
    }
    await dbQuery(`UPDATE auth_tokens SET used_at = NOW() WHERE id = ?`, [t.id]);
    await dbQuery(
      `UPDATE users
       SET email_verified_at = COALESCE(email_verified_at, NOW()),
           status = 'active',
           updated_at = NOW()
       WHERE id = ?`,
      [t.user_id]
    );
    await dbQuery("COMMIT");
    return { ok: true };
  } catch (err) {
    await dbQuery("ROLLBACK");
    throw (err == null ? void 0 : err.statusCode) ? err : createError({ statusCode: 500, message: "Erreur serveur (verify-email)." });
  }
});

export { verifyEmail_get as default };
//# sourceMappingURL=verify-email.get.mjs.map
