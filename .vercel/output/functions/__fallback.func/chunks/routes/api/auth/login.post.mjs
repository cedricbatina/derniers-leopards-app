import { d as defineEventHandler, r as readBody, n as normalizeEmail, e as createError, a as dbQuery, v as verifyPassword, g as getHeader, f as signRefreshToken, h as createSession, i as signAccessToken, j as setAuthCookies } from '../../../nitro/nitro.mjs';
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

function pickPrimaryRole(slugs = [], fallback = "user") {
  if (slugs.includes("admin")) return "admin";
  if (slugs.includes("editor")) return "editor";
  if (slugs.includes("user")) return "user";
  return fallback || "user";
}
const login_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const emailNorm = normalizeEmail(body == null ? void 0 : body.email);
  const password = String((body == null ? void 0 : body.password) || "");
  if (!emailNorm || !password) {
    throw createError({ statusCode: 400, message: "Email ou mot de passe invalide." });
  }
  const rows = await dbQuery(
    `SELECT id, email, password_hash, status, role, email_verified_at
     FROM users
     WHERE email_normalized = ?
       AND deleted_at IS NULL
     LIMIT 1`,
    [emailNorm]
  );
  const u = rows[0];
  if (!u) throw createError({ statusCode: 401, message: "Identifiants invalides." });
  if (u.status !== "active" || !u.email_verified_at) {
    throw createError({ statusCode: 403, message: "Compte non activ\xE9." });
  }
  const ok = await verifyPassword(u.password_hash, password);
  if (!ok) throw createError({ statusCode: 401, message: "Identifiants invalides." });
  const roleRows = await dbQuery(
    `SELECT r.slug
     FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [u.id]
  );
  const roles = roleRows.map((r) => r.slug).filter(Boolean);
  const mergedRoles = roles.length ? roles : u.role ? [u.role] : ["user"];
  const primaryRole = pickPrimaryRole(mergedRoles, u.role || "user");
  const userAgent = getHeader(event, "user-agent") || null;
  const ip = (getHeader(event, "x-forwarded-for") || "").split(",")[0].trim() || ((_a = event.node.req.socket) == null ? void 0 : _a.remoteAddress) || null;
  const refreshToken = await signRefreshToken({ userId: u.id });
  await createSession({ userId: u.id, refreshToken, userAgent, ip });
  const accessToken = await signAccessToken({ userId: u.id, role: primaryRole });
  setAuthCookies(event, { accessToken, refreshToken });
  await dbQuery(
    `UPDATE users
     SET last_login_at = NOW(),
         updated_at = NOW()
     WHERE id = ?`,
    [u.id]
  );
  return { ok: true };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
