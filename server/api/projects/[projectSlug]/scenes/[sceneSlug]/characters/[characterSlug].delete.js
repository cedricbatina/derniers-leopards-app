import { dbQuery } from '../../../../../../../utils/db.js'
import { getProjectForNarrativeApi } from '../../../../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const sceneSlug = String(event.context.params.sceneSlug || '').trim()
  const characterSlug = String(event.context.params.characterSlug || '').trim()
  const project = await getProjectForNarrativeApi(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const rows = await dbQuery(
    `SELECT sc.scene_id, sc.character_id
       FROM scene_characters sc
       JOIN scenes s ON s.id=sc.scene_id
       JOIN characters c ON c.id=sc.character_id
      WHERE s.project_id=? AND s.slug=? AND s.deleted_at IS NULL
        AND c.project_id=? AND c.slug=? AND c.deleted_at IS NULL LIMIT 1`,
    [project.id, sceneSlug, project.id, characterSlug]
  )
  if (!rows[0]) throw createError({ statusCode: 404, statusMessage: 'Scene character link not found' })
  await dbQuery('DELETE FROM scene_characters WHERE scene_id=? AND character_id=?', [rows[0].scene_id, rows[0].character_id])
  return { ok: true }
})
