import { dbQuery } from '../../utils/db.js'

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function isValidSlug(s) {
  return typeof s === 'string' && s.length > 0 && s.length <= 191 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)
}

async function ensureUniquePublicSlug(candidate, projectId) {
  const base = candidate
  let slug = base
  let n = 1

  while (true) {
    const rows = await dbQuery(
      `SELECT id FROM projects WHERE public_slug=? AND id<>? LIMIT 1`,
      [slug, projectId]
    )
    if (!rows?.length) return slug
    n += 1
    slug = `${base}-${n}`
  }
}

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const slug = String(event.context.params.slug || '').trim()
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Invalid slug' })

  const body = await readBody(event)

  // slug figé
  if (body?.slug !== undefined) {
    throw createError({ statusCode: 400, statusMessage: 'slug is immutable' })
  }

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
    if (body.parent_id !== undefined) {
      sets.push('parent_id=?')
      params.push(body.parent_id)
    }
    if (body.type !== undefined) {
      sets.push('type=?')
      params.push(String(body.type).trim())
    }
  const hasAny = allowed.some((k) => body?.[k] !== undefined)
  if (!hasAny) throw createError({ statusCode: 400, statusMessage: 'No fields to update' })

  const rows0 = await dbQuery(
    `
    SELECT id, owner_id, slug, title, status, visibility, public_slug, published_at
    FROM projects
    WHERE owner_id=? AND slug=? AND deleted_at IS NULL
    LIMIT 1
    `,
    [user.id, slug]
  )
  if (!rows0?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  const project = rows0[0]
  const projectId = project.id

  // --- status ---
  const desiredStatus = body.status !== undefined ? String(body.status) : String(project.status)
  if (!['draft', 'active', 'archived'].includes(desiredStatus)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid status' })
  }

  // --- visibility ---
  let desiredVisibility = body.visibility !== undefined ? String(body.visibility) : String(project.visibility)
  if (!['private', 'unlisted', 'public'].includes(desiredVisibility)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid visibility' })
  }

  // Si archived => jamais public
  if (desiredStatus === 'archived') {
    desiredVisibility = 'private'
  }

  // --- public_slug / published_at rules ---
  let nextPublicSlug = project.public_slug || null
  let nextPublishedAt = project.published_at || null

  if (desiredVisibility === 'private') {
    nextPublicSlug = null
    nextPublishedAt = null
  } else {
    // public/unlisted
    const wants = body.public_slug !== undefined ? String(body.public_slug || '').trim() : null

    if (wants !== null) {
      // body.public_slug explicitly provided
      const candidate = slugify(wants)
      if (!candidate) {
        // empty => auto-generate
        nextPublicSlug = null
      } else if (!isValidSlug(candidate)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid public_slug format' })
      } else {
        nextPublicSlug = candidate
      }
    }

    if (!nextPublicSlug) {
      // default to project slug
      const base = slugify(project.slug || project.title || `project-${projectId}`) || `project-${projectId}`
      if (!isValidSlug(base)) {
        throw createError({ statusCode: 400, statusMessage: 'Cannot derive a valid public_slug' })
      }
      nextPublicSlug = base
    }

    // uniqueness
    nextPublicSlug = await ensureUniquePublicSlug(nextPublicSlug, projectId)

    // published_at: set on first publish only
    if (!nextPublishedAt) {
      nextPublishedAt = new Date()
    }
  }

  // --- build update ---
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
    const v = body.cover_url ? String(body.cover_url).trim() : ''
    sets.push('cover_url=?')
    params.push(v ? v.slice(0, 512) : null)
  }

  if (body.status !== undefined) {
    sets.push('status=?')
    params.push(desiredStatus)
  }

  // visibility/public_slug/published_at may change even if body.visibility/public_slug not provided
  // (ex: status archived forces private)
  sets.push('visibility=?')
  params.push(desiredVisibility)
  sets.push('public_slug=?')
  params.push(nextPublicSlug)
  sets.push('published_at=?')
  params.push(nextPublishedAt)

  await dbQuery(
    `UPDATE projects SET ${sets.join(', ')} WHERE id=? AND owner_id=?`,
    [...params, projectId, user.id]
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
    [projectId, user.id]
  )

  return { project: rows[0] }
})
