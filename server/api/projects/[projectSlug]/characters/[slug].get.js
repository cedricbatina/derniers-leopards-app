// server/api/projects/[projectSlug]/characters/[slug].get.js
import { dbQuery } from '~~/server/utils/db.js'
import { getProjectForNarrativeApi, canManageProject } from '~~/server/utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const characterSlug = String(event.context.params.slug || '').trim()

  if (!projectSlug || !characterSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid parameters' })
  }

  const project = await getProjectForNarrativeApi(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const { trashed } = getQuery(event)
  const allowTrashed = canManageProject(project, user) && String(trashed || '') === '1' ? 1 : 0

  const characterRows = await dbQuery(
    `
    SELECT 
      id, project_id, slug, name, description,
      created_at, updated_at, deleted_at
    FROM characters
    WHERE project_id = ? AND slug = ?
      AND (? = 1 OR deleted_at IS NULL)
    LIMIT 1
    `,
    [project.id, characterSlug, allowTrashed]
  )

  if (!characterRows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Character not found' })
  }

  const character = characterRows[0]

  // Le résumé reste la fiche lisible. Les tables riches sont jointes ici afin
  // que le Studio rende enfin les apports canoniques structurés.
  const [profiles, dossiers, aliases, kinships] = await Promise.all([
    dbQuery('SELECT one_liner, role_in_story, occupation, physical, voice, personality, strengths, flaws, goals_external, goals_internal, fears, secrets, signature_objects, arc_tome1, arc_tome2, arc_tome3 FROM character_profiles WHERE character_id = ? LIMIT 1', [character.id]),
    dbQuery('SELECT canon_status, logline, ages, origin, public_role, secret_role, desire, fear, mask, weapon, rupture, contradiction, voice, signature_lines, signature_objects, signature_places, allies, enemies, debts_secrets, arc_t1, arc_t2, arc_t3, notes FROM character_dossiers WHERE character_id = ? LIMIT 1', [character.id]),
    dbQuery('SELECT alias, alias_type, is_primary, note FROM character_aliases WHERE character_id = ? ORDER BY is_primary DESC, alias ASC', [character.id]),
    dbQuery(`SELECT k.relation, k.line, k.certainty, k.notes, other.slug, other.name
      FROM character_kinships_v2 k
      JOIN characters other ON other.id = CASE WHEN k.from_character_id = ? THEN k.to_character_id ELSE k.from_character_id END
      WHERE (k.from_character_id = ? OR k.to_character_id = ?) AND other.deleted_at IS NULL
      ORDER BY other.name ASC`, [character.id, character.id, character.id]),
  ])

  // Récupère les scènes où le personnage apparaît
  const scenes = await dbQuery(
    `
    SELECT 
      s.id, s.slug, s.scene_no, s.title, s.chapter_id,
      sc.role as character_role,
      sc.notes as character_notes
    FROM scene_characters sc
    JOIN scenes s ON sc.scene_id = s.id
    WHERE sc.character_id = ? AND s.deleted_at IS NULL
    ORDER BY s.scene_no ASC
    LIMIT 100
    `,
    [character.id]
  )

  const canManage = canManageProject(project, user)
  return {
    project: {
      id: project.id,
      slug: project.slug,
      title: project.title,
      owner_id: project.owner_id,
      can_manage: canManage,
    },
    character,
    canon: {
      profile: profiles[0] || null,
      dossier: dossiers[0] || null,
      aliases,
      kinships,
    },
    scenes,
    can_manage: canManage,
  }
})
