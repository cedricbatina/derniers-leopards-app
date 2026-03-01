import { dbQuery } from '../../utils/db.js'

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function isValidSlug(value) {
  return typeof value === 'string' && value.length > 0 && value.length <= 191 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

async function ensureUniquePublicSlug(candidate, projectId) {
  const base = candidate
  let slug = base
  let index = 1

  while (true) {
    const rows = await dbQuery(
      'SELECT id FROM projects WHERE public_slug=? AND id<>? LIMIT 1',
      [slug, projectId]
    )
    if (!rows?.length) return slug
    index += 1
    slug = `${base}-${index}`
  }
}

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = Number(user?.id || user?.sub)
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || event.context.params.slug || '').trim()
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })

  const body = await readBody(event)

  if (body?.slug !== undefined) {
    throw createError({ statusCode: 400, statusMessage: 'slug is immutable' })
  }

  const rows0 = await dbQuery(
    `
    SELECT id, owner_id, slug, title, status, visibility, public_slug, published_at
    FROM projects
    WHERE owner_id=? AND slug=? AND deleted_at IS NULL
    LIMIT 1
    `,
    [userId, projectSlug]
  )
  if (!rows0?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  const project = rows0[0]
  const projectId = project.id

  const allowed = [
    'title',
    'title_en',
    'title_pt',
    'logline',
    'pitch',
    'cover_url',
    'status',
    'visibility',
    'public_slug',
    'parent_id',
    'type',
  ]
  const hasAny = allowed.some((key) => body?.[key] !== undefined)
  if (!hasAny) throw createError({ statusCode: 400, statusMessage: 'No fields to update' })

  const desiredStatus = body.status !== undefined ? String(body.status) : String(project.status)
  if (!['draft', 'active', 'archived'].includes(desiredStatus)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid status' })
  }

  let desiredVisibility = body.visibility !== undefined ? String(body.visibility) : String(project.visibility)
  if (!['private', 'unlisted', 'public'].includes(desiredVisibility)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid visibility' })
  }

  if (desiredStatus === 'archived') desiredVisibility = 'private'

  let nextPublicSlug = project.public_slug || null
  let nextPublishedAt = project.published_at || null

  if (desiredVisibility === 'private') {
    nextPublicSlug = null
    nextPublishedAt = null
  } else {
    const wants = body.public_slug !== undefined ? String(body.public_slug || '').trim() : null

    if (wants !== null) {
      const candidate = slugify(wants)
      if (!candidate) {
        nextPublicSlug = null
      } else if (!isValidSlug(candidate)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid public_slug format' })
      } else {
        nextPublicSlug = candidate
      }
    }

    if (!nextPublicSlug) {
      const base = slugify(project.slug || project.title || `project-${projectId}`) || `project-${projectId}`
      if (!isValidSlug(base)) {
        throw createError({ statusCode: 400, statusMessage: 'Cannot derive a valid public_slug' })
      }
      nextPublicSlug = base
    }

    nextPublicSlug = await ensureUniquePublicSlug(nextPublicSlug, projectId)
    if (!nextPublishedAt) nextPublishedAt = new Date()
  }

  const sets = []
  const params = []

  if (body.title !== undefined) {
    const title = String(body.title || '').trim()
    if (!title) throw createError({ statusCode: 400, statusMessage: 'title cannot be empty' })
    sets.push('title=?')
    params.push(title)
  }
  if (body.title_en !== undefined) {
    sets.push('title_en=?')
    params.push(body.title_en ? String(body.title_en).trim() : null)
  }
  if (body.title_pt !== undefined) {
    sets.push('title_pt=?')
    params.push(body.title_pt ? String(body.title_pt).trim() : null)
  }
  if (body.logline !== undefined) {
    sets.push('logline=?')
    params.push(body.logline ? String(body.logline).trim() : null)
  }
  if (body.pitch !== undefined) {
    sets.push('pitch=?')
    params.push(body.pitch ? String(body.pitch).trim() : null)
  }
  if (body.cover_url !== undefined) {
    const value = body.cover_url ? String(body.cover_url).trim() : ''
    sets.push('cover_url=?')
    params.push(value ? value.slice(0, 512) : null)
  }
  if (body.status !== undefined) {
    sets.push('status=?')
    params.push(desiredStatus)
  }
  if (body.parent_id !== undefined) {
    sets.push('parent_id=?')
    params.push(body.parent_id === null || body.parent_id === '' ? null : Number(body.parent_id))
  }
  if (body.type !== undefined) {
    sets.push('type=?')
    params.push(body.type ? String(body.type).trim() : null)
  }

  sets.push('visibility=?')
  params.push(desiredVisibility)
  sets.push('public_slug=?')
  params.push(nextPublicSlug)
  sets.push('published_at=?')
  params.push(nextPublishedAt)

  await dbQuery(
    `UPDATE projects SET ${sets.join(', ')} WHERE id=? AND owner_id=?`,
    [...params, projectId, userId]
  )

  const rows = await dbQuery(
    `
    SELECT
      id, owner_id,
      slug, public_slug,
      title, title_en, title_pt,
      logline, pitch, cover_url,
      status, visibility,
      published_at,
      created_at, updated_at, deleted_at,
      parent_id, type
    FROM projects
    WHERE id=? AND owner_id=?
    LIMIT 1
    `,
    [projectId, userId]
  )

  return { project: rows[0] }
})
