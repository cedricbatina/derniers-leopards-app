import { dbQuery } from '../../../../../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../../../../../utils/projects.js'
import { getBookByProjectIdSlug } from '../../../../../../../../utils/books.js'

function toSlug(input) {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  const partId = Number(event.context.params.partId)
  if (!projectSlug || !bookSlug || !Number.isFinite(partId) || partId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid params' })
  }

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const book = await getBookByProjectIdSlug(project.id, bookSlug)
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const partRows = await dbQuery(
    `SELECT id FROM parts WHERE id=? AND book_id=? LIMIT 1`,
    [partId, book.id]
  )
  if (!partRows?.length) throw createError({ statusCode: 404, statusMessage: 'Part not found' })

  const body = await readBody(event)

  const title = String(body?.title || '').trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'title is required' })

  let chapterNo = body?.chapter_no !== undefined ? Number(body.chapter_no) : null
  if (chapterNo !== null && (!Number.isFinite(chapterNo) || chapterNo <= 0)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid chapter_no' })
  }
  if (!chapterNo) {
    const maxRows = await dbQuery(
      `SELECT COALESCE(MAX(chapter_no), 0) AS m FROM chapters WHERE part_id=?`,
      [partId]
    )
    chapterNo = Number(maxRows?.[0]?.m || 0) + 1
  }

  const slug = toSlug(body?.slug || title || `chapter-${chapterNo}`) || `chapter-${Date.now()}`
  const summary = body?.summary !== undefined ? String(body.summary || '').trim() : null
  const povId = body?.pov_character_id ? Number(body.pov_character_id) : null
  const locationId = body?.location_id ? Number(body.location_id) : null
  const objective = body?.objective !== undefined ? String(body.objective || '').trim() : null
  const cliffhanger = body?.cliffhanger !== undefined ? String(body.cliffhanger || '').trim() : null
  const wordTarget = body?.word_target !== undefined ? Number(body.word_target) : null
  const indesignMaster = body?.indesign_master !== undefined ? String(body.indesign_master || '').trim() : null
  const dateStart = body?.in_story_date_start ? String(body.in_story_date_start).trim() : null
  const dateEnd = body?.in_story_date_end ? String(body.in_story_date_end).trim() : null

  try {
    await dbQuery(
      `
      INSERT INTO chapters (
        part_id, slug, chapter_no, title,
        pov_character_id, location_id,
        in_story_date_start, in_story_date_end,
        objective, summary, cliffhanger, word_target, indesign_master
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        partId,
        slug,
        chapterNo,
        title,
        povId || null,
        locationId || null,
        dateStart || null,
        dateEnd || null,
        objective,
        summary,
        cliffhanger,
        Number.isFinite(wordTarget) && wordTarget > 0 ? wordTarget : null,
        indesignMaster,
      ]
    )
  } catch (err) {
    if (String(err?.code) === 'ER_DUP_ENTRY') {
      throw createError({ statusCode: 409, statusMessage: 'Chapter slug already exists in this part' })
    }
    throw err
  }

  const rows = await dbQuery(
    `
    SELECT id, part_id, slug, chapter_no, title, summary, created_at, updated_at
    FROM chapters
    WHERE part_id=? AND slug=?
    LIMIT 1
    `,
    [partId, slug]
  )

  return { chapter: rows?.[0] || null }
})
