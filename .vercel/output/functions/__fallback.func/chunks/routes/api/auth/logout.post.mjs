import { d as defineEventHandler, k as readRefreshCookie, s as sha256Hex, a as dbQuery, l as clearAuthCookies } from '../../../nitro/nitro.mjs';
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

const logout_post = defineEventHandler(async (event) => {
  const refreshToken = readRefreshCookie(event);
  if (refreshToken) {
    const hash = sha256Hex(refreshToken);
    await dbQuery(
      `UPDATE user_sessions
       SET revoked_at = NOW()
       WHERE refresh_token_hash = ?
         AND revoked_at IS NULL`,
      [hash]
    );
  }
  clearAuthCookies(event);
  return { ok: true };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
