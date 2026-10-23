/**
 * UPSERT personnages (canon). Partagé : API admin + scripts/seed CLI.
 */
export function canonCharactersUpsertSql(restoreDeleted) {
  const restoreLine = restoreDeleted ? 'deleted_at = NULL,' : ''
  return `INSERT INTO characters (project_id, slug, name, description)
VALUES (?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  ${restoreLine}
  updated_at = NOW()`
}
