// Accès à un livre par slug et droits utilisateur
export async function getBookByAccess(user, bookSlug) {
  // Cherche le livre par slug
  const rows = await dbQuery(
    `SELECT id, owner_id, slug, title, status, deleted_at FROM books WHERE slug=? AND deleted_at IS NULL LIMIT 1`,
    [bookSlug]
  )
  const book = rows[0] || null
  if (!book) return null

  // Si published, accessible à tous
  if (book.status === 'published') return book

  // Sinon, accessible uniquement à l'auteur ou à un admin
  if (user && (user.id === book.owner_id || user.role === 'admin')) return book

  // Sinon, interdit
  return null
}
import { dbQuery } from './db.js'


// Nouvelle fonction : accès par slug seul si published, sinon owner ou admin
export async function getProjectByAccess(user, projectSlug) {
  // Cherche le projet par slug
  const rows = await dbQuery(
    `SELECT id, owner_id, slug, title, status, deleted_at FROM projects WHERE slug=? AND deleted_at IS NULL LIMIT 1`,
    [projectSlug]
  )
  const project = rows[0] || null
  if (!project) return null

  // Si published, accessible à tous
  if (project.status === 'published') return project

  // Sinon, accessible uniquement à l'auteur ou à un admin
  if (user && (user.id === project.owner_id || user.role === 'admin')) return project

  // Sinon, interdit
  return null
}
