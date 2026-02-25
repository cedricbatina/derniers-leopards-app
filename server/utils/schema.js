import { dbQuery } from './db.js'

const _tableColumns = new Map()

async function loadColumns(table) {
  const rows = await dbQuery(
    `
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
    `,
    [table]
  )
  const cols = new Set((rows || []).map((r) => String(r.COLUMN_NAME)))
  _tableColumns.set(table, cols)
  return cols
}

export async function getTableColumns(table) {
  if (_tableColumns.has(table)) return _tableColumns.get(table)
  return loadColumns(table)
}

export async function tableHasColumn(table, column) {
  const cols = await getTableColumns(table)
  return cols.has(column)
}
