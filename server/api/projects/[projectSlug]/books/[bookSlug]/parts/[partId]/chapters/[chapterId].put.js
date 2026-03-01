import { dbQuery } from '../../../../../../../../utils/db.js'
import { getProjectByAccess } from '../../../../../../../../utils/projects.js'
import { getBookByProjectIdSlug } from '../../../../../../../../utils/books.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  const partId = Number(event.context.params.partId)
  const chapterId = Number(event.context.params.chapterId)
  if (!projectSlug || !bookSlug || !Number.isFinite(partId) || partId <= 0 || !Number.isFinite(chapterId) || chapterId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid params' })
  }

  const project = await getProjectByAccess(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const book = await getBookByProjectIdSlug(project.id, bookSlug)
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const partRows = await dbQuery(
    `SELECT id FROM parts WHERE id=? AND book_id=? LIMIT 1`,
    [partId, book.id]
  )
  if (!partRows?.length) throw createError({ statusCode: 404, statusMessage: 'Part not found' })

  const rows0 = await dbQuery(
    `SELECT id, slug FROM chapters WHERE id=? AND part_id=? LIMIT 1`,
    [chapterId, partId]
  )
  if (!rows0?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  const body = await readBody(event)
  if (body?.slug !== undefined) {
    throw createError({ statusCode: 400, statusMessage: 'slug is immutable' })
  }

  const allowed = [
    'chapter_no',
    'title',
    'summary',
    'pov_character_id',
    'location_id',
    'in_story_date_start',
    'in_story_date_end',
    'objective',
    'cliffhanger',
    'word_target',
    'indesign_master',
  ]
  const hasAny = allowed.some((k) => body?.[k] !== undefined)
  if (!hasAny) throw createError({ statusCode: 400, statusMessage: 'No fields to update' })

  const sets = []
  const params = []

  if (body.chapter_no !== undefined) {
    const chapterNo = Number(body.chapter_no)
    if (!Number.isFinite(chapterNo) || chapterNo <= 0) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid chapter_no' })
    }
    sets.push('chapter_no=?')
    params.push(chapterNo)
  }

  if (body.title !== undefined) {
    const title = String(body.title || '').trim()
    if (!title) throw createError({ statusCode: 400, statusMessage: 'title cannot be empty' })
    sets.push('title=?')
    params.push(title)
  }

  if (body.summary !== undefined) { sets.push('summary=?'); params.push(body.summary ? String(body.summary).trim() : null) }
  if (body.pov_character_id !== undefined) { sets.push('pov_character_id=?'); params.push(body.pov_character_id ? Number(body.pov_character_id) : null) }
  if (body.location_id !== undefined) { sets.push('location_id=?'); params.push(body.location_id ? Number(body.location_id) : null) }
  if (body.in_story_date_start !== undefined) { sets.push('in_story_date_start=?'); params.push(body.in_story_date_start ? String(body.in_story_date_start).trim() : null) }
  if (body.in_story_date_end !== undefined) { sets.push('in_story_date_end=?'); params.push(body.in_story_date_end ? String(body.in_story_date_end).trim() : null) }
  if (body.objective !== undefined) { sets.push('objective=?'); params.push(body.objective ? String(body.objective).trim() : null) }
  if (body.cliffhanger !== undefined) { sets.push('cliffhanger=?'); params.push(body.cliffhanger ? String(body.cliffhanger).trim() : null) }
  if (body.word_target !== undefined) {
    const wt = Number(body.word_target)
    sets.push('word_target=?')
    params.push(Number.isFinite(wt) && wt > 0 ? wt : null)
  }
  if (body.indesign_master !== undefined) { sets.push('indesign_master=?'); params.push(body.indesign_master ? String(body.indesign_master).trim() : null) }

  await dbQuery(
    `UPDATE chapters SET ${sets.join(', ')} WHERE id=? AND part_id=?`,
    [...params, chapterId, partId]
  )

  const rows = await dbQuery(
    `SELECT * FROM chapters WHERE id=? AND part_id=? LIMIT 1`,
    [chapterId, partId]
  )

  return { chapter: rows?.[0] || null }
})
