import { d as defineEventHandler, m as readAccessCookie, o as verifyAccessToken, a as dbQuery, l as clearAuthCookies } from '../../../nitro/nitro.mjs';
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

const me_get = defineEventHandler(async (event) => {
  const token = readAccessCookie(event);
  if (!token) return { user: null };
  try {
    const payload = await verifyAccessToken(token);
    const userId = Number(payload == null ? void 0 : payload.sub);
    if (!userId) return { user: null };
    const rows = await dbQuery(
      `SELECT
         id, email,
         display_name, username,
         status, role,
         account_type, first_name, last_name, organization_name, profession,
         avatar_url, bio, website,
         email_verified_at, locale, timezone
       FROM users
       WHERE id = ? AND deleted_at IS NULL
       LIMIT 1`,
      [userId]
    );
    if (!rows.length) return { user: null };
    const u = rows[0];
    const roleRows = await dbQuery(
      `SELECT r.slug
       FROM user_roles ur
       JOIN roles r ON r.id = ur.role_id
       WHERE ur.user_id = ?
       ORDER BY ur.assigned_at ASC`,
      [userId]
    );
    let roles = roleRows.map((r) => r.slug).filter(Boolean);
    if (!roles.length && u.role) roles = [u.role];
    const primaryRole = roles.includes("admin") ? "admin" : roles.includes("editor") ? "editor" : roles[0] || "user";
    return {
      user: {
        id: u.id,
        email: u.email,
        display_name: u.display_name,
        username: u.username,
        status: u.status,
        email_verified_at: u.email_verified_at,
        account_type: u.account_type,
        first_name: u.first_name,
        last_name: u.last_name,
        organization_name: u.organization_name,
        profession: u.profession,
        avatar_url: u.avatar_url,
        bio: u.bio,
        website: u.website,
        locale: u.locale,
        timezone: u.timezone,
        // RBAC
        primary_role: primaryRole,
        // <- plus clair
        roles
      }
    };
  } catch {
    clearAuthCookies(event);
    return { user: null };
  }
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
