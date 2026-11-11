import { createError } from 'h3'
import { dbQuery } from './db.js'

function userIdOf(user) {
  const uid = Number(user?.id ?? user?.sub)
  return Number.isFinite(uid) && uid > 0 ? uid : null
}

export function isAdminUser(user) {
  return String(user?.role || '') === 'admin'
}

export function canManageBook(book, user) {
  if (!book || !user) return false
  const uid = userIdOf(user)
  if (!uid) return false
  return uid === Number(book.owner_id) || isAdminUser(user)
}

export function canManageProject(project, user) {
  if (!project || !user) return false
  const uid = userIdOf(user)
  if (!uid) return false
  return uid === Number(project.owner_id) || isAdminUser(user)
}

async function isProjectMember(projectId, userId) {
  if (!projectId || !userId) return false
  try {
    const rows = await dbQuery(
      `SELECT 1 AS ok
         FROM project_members
        WHERE project_id = ?
          AND user_id = ?
          AND deleted_at IS NULL
        LIMIT 1`,
      [projectId, userId],
    )
    return Boolean(rows?.[0])
  } catch {
    return false
  }
}

export async function canReadProject(project, user) {
  if (canManageProject(project, user)) return true
  const uid = userIdOf(user)
  if (!project || !uid) return false
  return isProjectMember(project.id, uid)
}

async function loadProjectBySlug(projectSlug) {
  const rows = await dbQuery(
    `SELECT id, owner_id, slug, title, status, deleted_at
       FROM projects
      WHERE slug = ? AND deleted_at IS NULL
      LIMIT 1`,
    [projectSlug],
  )
  return rows[0] || null
}

function denyWriteIfViewer(isMember) {
  if (!isMember) return null
  throw createError({ statusCode: 403, statusMessage: 'Lecture seule' })
}

export async function getBookByAccess(user, bookSlug) {
  const rows = await dbQuery(
    `SELECT id, owner_id, slug, title, status, deleted_at FROM books WHERE slug=? AND deleted_at IS NULL LIMIT 1`,
    [bookSlug],
  )
  const book = rows[0] || null
  if (!book) return null
  if (book.status === 'published') return book
  if (user && (userIdOf(user) === Number(book.owner_id) || isAdminUser(user))) return book
  return null
}

export async function getBookForNarrativeApi(user, bookSlug) {
  if (!user) return null
  const rows = await dbQuery(
    `SELECT id, owner_id, slug, title, status, deleted_at FROM books WHERE slug=? AND deleted_at IS NULL LIMIT 1`,
    [bookSlug],
  )
  const book = rows[0] || null
  if (!book || !canManageBook(book, user)) return null
  return book
}

export async function getProjectByAccess(user, projectSlug, { write = false } = {}) {
  const project = await loadProjectBySlug(projectSlug)
  if (!project) return null

  if (write) {
    if (canManageProject(project, user)) return project
    return denyWriteIfViewer(user && (await isProjectMember(project.id, userIdOf(user))))
  }

  if (project.status === 'published') return project
  if (canManageProject(project, user)) return project
  if (user && (await isProjectMember(project.id, userIdOf(user)))) return project
  return null
}

export async function getProjectForNarrativeApi(user, projectSlug, { write = false } = {}) {
  if (!user) return null
  const project = await loadProjectBySlug(projectSlug)
  if (!project) return null

  if (write) {
    if (canManageProject(project, user)) return project
    return denyWriteIfViewer(await isProjectMember(project.id, userIdOf(user)))
  }

  if (canManageProject(project, user)) return project
  if (await isProjectMember(project.id, userIdOf(user))) return project
  return null
}
