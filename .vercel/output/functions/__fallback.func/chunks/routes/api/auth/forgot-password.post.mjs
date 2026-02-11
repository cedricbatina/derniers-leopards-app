import { d as defineEventHandler, r as readBody, n as normalizeEmail, a as dbQuery, b as randomTokenHex, s as sha256Hex, c as sendResetPasswordEmail } from '../../../nitro/nitro.mjs';
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

const forgotPassword_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const emailNorm = normalizeEmail(body == null ? void 0 : body.email);
  if (!emailNorm) return { ok: true };
  const users = await dbQuery(
    `SELECT id, email, email_verified_at, status
     FROM users
     WHERE email_normalized = ?
       AND deleted_at IS NULL
     LIMIT 1`,
    [emailNorm]
  );
  if (!users.length) return { ok: true };
  const user = users[0];
  if (user.status !== "active") return { ok: true };
  await dbQuery(
    `UPDATE auth_tokens
     SET used_at = NOW()
     WHERE user_id = ?
       AND token_type = 'reset_password'
       AND used_at IS NULL
       AND expires_at > NOW()`,
    [user.id]
  );
  const rawToken = randomTokenHex(32);
  const tokenHash = sha256Hex(rawToken);
  await dbQuery(
    `INSERT INTO auth_tokens (user_id, token_type, token_hash, expires_at)
     VALUES (?, 'reset_password', ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))`,
    [user.id, tokenHash]
  );
  await sendResetPasswordEmail({ email: user.email, token: rawToken });
  return { ok: true };
});

export { forgotPassword_post as default };
//# sourceMappingURL=forgot-password.post.mjs.map
