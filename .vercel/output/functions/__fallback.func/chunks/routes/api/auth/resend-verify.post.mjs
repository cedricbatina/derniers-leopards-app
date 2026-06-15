import { d as defineEventHandler, r as readBody, n as normalizeEmail, a as dbQuery, u as randomToken, s as sha256Hex, w as detectLocaleFromEvent, t as sendVerifyEmail } from '../../../nitro/nitro.mjs';
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

const resendVerify_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const emailNorm = normalizeEmail(body == null ? void 0 : body.email);
  if (!emailNorm) return { ok: true };
  const rows = await dbQuery(
    `SELECT id, email, status, email_verified_at
     FROM users
     WHERE email_normalized=? LIMIT 1`,
    [emailNorm]
  );
  if (!rows.length) return { ok: true };
  const u = rows[0];
  if (u.status === "active" || u.email_verified_at) return { ok: true };
  await dbQuery(
    `UPDATE auth_tokens
     SET used_at=NOW()
     WHERE user_id=?
       AND token_type='verify_email'
       AND used_at IS NULL
       AND expires_at > NOW()`,
    [u.id]
  );
  const rawToken = randomToken(32);
  const tokenHash = sha256Hex(rawToken);
  await dbQuery(
    `INSERT INTO auth_tokens (user_id, token_type, token_hash, expires_at)
     VALUES (?, 'verify_email', ?, DATE_ADD(NOW(), INTERVAL 2 DAY))`,
    [u.id, tokenHash]
  );
  const locale = detectLocaleFromEvent(event);
  const mail = await sendVerifyEmail({ email: u.email || emailNorm, token: rawToken, locale });
  return { ok: true, mail: { ok: mail.ok, messageId: mail.messageId || null } };
});

export { resendVerify_post as default };
//# sourceMappingURL=resend-verify.post.mjs.map
