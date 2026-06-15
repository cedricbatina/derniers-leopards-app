import { d as defineEventHandler, r as readBody, n as normalizeEmail, q as hashPassword, b as randomTokenHex, s as sha256Hex, a as dbQuery, e as createError, t as sendVerifyEmail } from '../../../nitro/nitro.mjs';
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

function badRequest(statusMessage) {
  return createError({ statusCode: 400, statusMessage });
}
function pickString(v, max = 1e3) {
  if (v === void 0 || v === null) return null;
  const s = String(v).trim();
  if (!s) return null;
  return s.length > max ? s.slice(0, max) : s;
}
function pickEnum(v, allowed, fallback = null) {
  const s = pickString(v, 50);
  if (!s) return fallback;
  return allowed.includes(s) ? s : fallback;
}
function pickBool(v) {
  if (v === true || v === false) return v;
  if (v === 1 || v === 0) return Boolean(v);
  const s = pickString(v, 10);
  if (!s) return null;
  if (["1", "true", "yes", "on"].includes(s.toLowerCase())) return true;
  if (["0", "false", "no", "off"].includes(s.toLowerCase())) return false;
  return null;
}
const register_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const body = await readBody(event);
  const email = normalizeEmail(body == null ? void 0 : body.email);
  const password = String((body == null ? void 0 : body.password) || "");
  if (!email) throw badRequest("Email invalide.");
  if (password.length < 8) throw badRequest("Mot de passe trop court (8 caract\xE8res minimum).");
  const accountType = pickEnum((_a = body == null ? void 0 : body.accountType) != null ? _a : body == null ? void 0 : body.account_type, ["individual", "pro"], null);
  const firstName = pickString((_b = body == null ? void 0 : body.firstName) != null ? _b : body == null ? void 0 : body.first_name, 120);
  const lastName = pickString((_c = body == null ? void 0 : body.lastName) != null ? _c : body == null ? void 0 : body.last_name, 120);
  const displayName = pickString((_d = body == null ? void 0 : body.displayName) != null ? _d : body == null ? void 0 : body.display_name, 120);
  const username = pickString(body == null ? void 0 : body.username, 64);
  const organizationName = pickString((_e = body == null ? void 0 : body.organizationName) != null ? _e : body == null ? void 0 : body.organization_name, 180);
  const profession = pickString(body == null ? void 0 : body.profession, 120);
  const avatarUrl = pickString((_f = body == null ? void 0 : body.avatarUrl) != null ? _f : body == null ? void 0 : body.avatar_url, 512);
  const bio = pickString(body == null ? void 0 : body.bio, 2e4);
  const website = pickString(body == null ? void 0 : body.website, 255);
  const locale = pickString(body == null ? void 0 : body.locale, 10);
  const timezone = pickString(body == null ? void 0 : body.timezone, 64);
  const marketingOptIn = pickBool((_g = body == null ? void 0 : body.marketingOptIn) != null ? _g : body == null ? void 0 : body.marketing_opt_in);
  const termsAccepted = pickBool((_h = body == null ? void 0 : body.termsAccepted) != null ? _h : body == null ? void 0 : body.terms_accepted);
  const passwordHash = await hashPassword(password);
  const rawToken = randomTokenHex(32);
  const tokenHash = sha256Hex(rawToken);
  await dbQuery("START TRANSACTION");
  try {
    const roleRows = await dbQuery(`SELECT id FROM roles WHERE slug='user' LIMIT 1`);
    const userRoleId = (_i = roleRows[0]) == null ? void 0 : _i.id;
    if (!userRoleId) {
      throw createError({ statusCode: 500, statusMessage: 'Role "user" introuvable (table roles).' });
    }
    const existingRows = await dbQuery(
      `SELECT id, status, email_verified_at
       FROM users
       WHERE email_normalized = ?
         AND deleted_at IS NULL
       LIMIT 1`,
      [email]
    );
    let userId = null;
    if (existingRows.length) {
      const u = existingRows[0];
      if (u.status === "active" || u.email_verified_at) {
        throw createError({ statusCode: 409, statusMessage: "Email d\xE9j\xE0 utilis\xE9." });
      }
      await dbQuery(
        `UPDATE users
         SET
           password_hash = ?,
           account_type = COALESCE(?, account_type),

           first_name = COALESCE(?, first_name),
           last_name = COALESCE(?, last_name),
           display_name = COALESCE(?, display_name),
           username = COALESCE(?, username),

           organization_name = COALESCE(?, organization_name),
           profession = COALESCE(?, profession),

           avatar_url = COALESCE(?, avatar_url),
           bio = COALESCE(?, bio),
           website = COALESCE(?, website),

           locale = COALESCE(?, locale),
           timezone = COALESCE(?, timezone),

           marketing_opt_in = COALESCE(?, marketing_opt_in),

           terms_accepted_at = CASE
             WHEN ? = 1 AND terms_accepted_at IS NULL THEN NOW()
             ELSE terms_accepted_at
           END,

           updated_at = NOW()
         WHERE id = ?`,
        [
          passwordHash,
          accountType,
          firstName,
          lastName,
          displayName,
          username,
          organizationName,
          profession,
          avatarUrl,
          bio,
          website,
          locale,
          timezone,
          marketingOptIn,
          termsAccepted ? 1 : 0,
          u.id
        ]
      );
      userId = u.id;
    } else {
      await dbQuery(
        `INSERT INTO users (
          email, email_normalized, password_hash,
          status, role,

          account_type, first_name, last_name, display_name, username,
          organization_name, profession, avatar_url, bio, website,

          marketing_opt_in, terms_accepted_at,
          locale, timezone,

          created_at, updated_at
        ) VALUES (
          ?, ?, ?,
          'pending', 'user',

          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,

          ?, CASE WHEN ? = 1 THEN NOW() ELSE NULL END,
          ?, ?,

          NOW(), NOW()
        )`,
        [
          email,
          email,
          passwordHash,
          accountType || "individual",
          firstName,
          lastName,
          displayName,
          username,
          organizationName,
          profession,
          avatarUrl,
          bio,
          website,
          marketingOptIn != null ? marketingOptIn : 0,
          termsAccepted ? 1 : 0,
          locale,
          timezone
        ]
      );
      const idRows = await dbQuery(
        `SELECT id FROM users WHERE email_normalized = ? AND deleted_at IS NULL LIMIT 1`,
        [email]
      );
      userId = ((_j = idRows[0]) == null ? void 0 : _j.id) || null;
    }
    if (!userId) throw createError({ statusCode: 500, statusMessage: "User creation failed." });
    await dbQuery(
      `INSERT IGNORE INTO user_roles (user_id, role_id)
       VALUES (?, ?)`,
      [userId, userRoleId]
    );
    await dbQuery(
      `UPDATE auth_tokens
       SET used_at = NOW()
       WHERE user_id = ?
         AND token_type = 'verify_email'
         AND used_at IS NULL
         AND expires_at > NOW()`,
      [userId]
    );
    await dbQuery(
      `INSERT INTO auth_tokens (user_id, token_type, token_hash, expires_at, created_at)
       VALUES (?, 'verify_email', ?, DATE_ADD(NOW(), INTERVAL 2 DAY), NOW())`,
      [userId, tokenHash]
    );
    await dbQuery("COMMIT");
    await sendVerifyEmail({ email, token: rawToken });
    return { ok: true };
  } catch (err) {
    await dbQuery("ROLLBACK");
    if ((err == null ? void 0 : err.code) === "ER_DUP_ENTRY" || (err == null ? void 0 : err.errno) === 1062) {
      throw createError({ statusCode: 409, statusMessage: "Email d\xE9j\xE0 utilis\xE9." });
    }
    if (err == null ? void 0 : err.statusCode) throw err;
    throw createError({ statusCode: 500, statusMessage: "Erreur serveur (register)." });
  }
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
