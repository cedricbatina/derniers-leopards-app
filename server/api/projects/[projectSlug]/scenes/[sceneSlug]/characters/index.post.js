import { dbQuery } from '../../../../../../utils/db.js'
import { getProjectForNarrativeApi } from '../../../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const sceneSlug = String(event.context.params.sceneSlug || '').trim()
  const project = await getProjectForNarrativeApi(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const body = await readBody(event)
  const characterSlug = String(body?.character_slug || '').trim()
  if (!sceneSlug || !characterSlug) throw createError({ statusCode: 400, statusMessage: 'sceneSlug and character_slug are required' })

  const scenes = await dbQuery('SELECT id FROM scenes WHERE project_id=? AND slug=? AND deleted_at IS NULL LIMIT 1', [project.id, sceneSlug])
  const chars = await dbQuery('SELECT id, slug, name FROM characters WHERE project_id=? AND slug=? AND deleted_at IS NULL LIMIT 1', [project.id, characterSlug])
  if (!scenes[0]) throw createError({ statusCode: 404, statusMessage: 'Scene not found' })
  if (!chars[0]) throw createError({ statusCode: 404, statusMessage: 'Character not found' })

  const role = body?.role == null ? null : String(body.role).trim() || null
  const notes = body?.notes == null ? null : String(body.notes).trim() || null
  try {
    await dbQuery('INSERT INTO scene_characters (scene_id, character_id, role, notes) VALUES (?, ?, ?, ?)', [scenes[0].id, chars[0].id, role, notes])
  } catch (err) {
    if (String(err?.code) === 'ER_DUP_ENTRY') throw createError({ statusCode: 409, statusMessage: 'Character already linked to scene' })
    throw err
  }
  return { ok: true, character: chars[0] }
})
