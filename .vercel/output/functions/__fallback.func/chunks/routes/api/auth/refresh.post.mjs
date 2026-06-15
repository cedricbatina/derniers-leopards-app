import { d as defineEventHandler, k as readRefreshCookie, e as createError, p as verifyRefreshToken, l as clearAuthCookies, a as dbQuery, s as sha256Hex, g as getHeader, f as signRefreshToken, i as signAccessToken, j as setAuthCookies } from '../../../nitro/nitro.mjs';
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

const refresh_post = defineEventHandler(async (event) => {
  var _a;
  const refreshToken = readRefreshCookie(event);
  if (!refreshToken) throw createError({ statusCode: 401, message: "No refresh token." });
  let payload;
  try {
    payload = await verifyRefreshToken(refreshToken);
  } catch {
    clearAuthCookies(event);
    throw createError({ statusCode: 401, message: "Invalid refresh token." });
  }
  const userId = Number(payload.sub);
  if (!userId) {
    clearAuthCookies(event);
    throw createError({ statusCode: 401, message: "Invalid token subject." });
  }
  const users = await dbQuery(
    `SELECT id, role, status, email_verified_at
     FROM users
     WHERE id = ?
       AND deleted_at IS NULL
     LIMIT 1`,
    [userId]
  );
  const u = users[0];
  if (!u || u.status !== "active" || !u.email_verified_at) {
    clearAuthCookies(event);
    throw createError({ statusCode: 401, message: "User not active." });
  }
  const refreshHash = sha256Hex(refreshToken);
  const sessions = await dbQuery(
    `SELECT id
     FROM user_sessions
     WHERE user_id = ?
       AND refresh_token_hash = ?
       AND revoked_at IS NULL
       AND expires_at > NOW()
     LIMIT 1`,
    [userId, refreshHash]
  );
  const current = sessions[0];
  if (!current) {
    clearAuthCookies(event);
    throw createError({ statusCode: 401, message: "Session expired or revoked." });
  }
  const userAgent = getHeader(event, "user-agent") || null;
  const ip = (getHeader(event, "x-forwarded-for") || "").split(",")[0].trim() || ((_a = event.node.req.socket) == null ? void 0 : _a.remoteAddress) || null;
  const newRefresh = await signRefreshToken({ userId });
  const insertRes = await dbQuery(
    `INSERT INTO user_sessions (user_id, refresh_token_hash, user_agent, ip, expires_at)
     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))`,
    [userId, sha256Hex(newRefresh), userAgent, ip]
  );
  const newSessionId = (insertRes == null ? void 0 : insertRes.insertId) || null;
  await dbQuery(
    `UPDATE user_sessions
     SET revoked_at = NOW(),
         replaced_by_session_id = ?
     WHERE id = ?`,
    [newSessionId, current.id]
  );
  const accessToken = await signAccessToken({ userId, role: u.role });
  setAuthCookies(event, { accessToken, refreshToken: newRefresh });
  return { ok: true };
});

export { refresh_post as default };
//# sourceMappingURL=refresh.post.mjs.map
