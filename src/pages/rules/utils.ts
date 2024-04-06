import { MessageRule } from '@microsoft/microsoft-graph-types'
import {
  MailContextData,
  MailFolderExtended,
  MailFolderExport,
} from '../../contexts/mail/types'
import { HIERARCHY_SPLITTER } from '../../constants'

export function exportJSON(data: Record<string, unknown>) {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`
  const link = document.createElement('a')
  link.href = jsonString
  link.download = 'message-rules.json'

  link.click()
}

export function reorder<T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function buildHierarchy(
  nameIDs: string[],
  map: Record<string, unknown>,
  index: number = 0
): Record<string, unknown> {
  const id = nameIDs.slice(0, index + 1).join(HIERARCHY_SPLITTER)
  if (!map[id]) {
    map[id] = {}
  }
  if (index === nameIDs.length - 1) {
    return map
  }
  return buildHierarchy(nameIDs, map[id] as Record<string, unknown>, index + 1)
}

// eslint-disable-block consistent-return
function buildMailFolderExport(
  map: Record<string, unknown>,
  mailFoldersNameMap: Record<string, string>,
  mailFoldersIDMap: Record<string, MailFolderExtended>
): MailFolderExport[] {
  const folders: MailFolderExport[] = []
  for (const id in map) {
    if (mailFoldersNameMap.hasOwnProperty(id)) {
      const folder: MailFolderExport = {
        displayName: mailFoldersIDMap[mailFoldersNameMap[id]].displayName,
        id,
      }
      if (
        map[id] &&
        Object.keys(map[id] as Record<string, unknown>).length > 0
      ) {
        folder.children = buildMailFolderExport(
          map[id] as Record<string, string>,
          mailFoldersNameMap,
          mailFoldersIDMap
        )
      }
      folders.push(folder)
    }
  }
  return folders
}

function getFoldersHierarchy(
  folderIds: string[],
  mailFoldersNameMap: Record<string, string>,
  mailFoldersIDMap: Record<string, MailFolderExtended>
): MailFolderExport[] {
  const map: Record<string, unknown> = {}
  for (const folderId of folderIds) {
    const nameIDs: string[] =
      mailFoldersIDMap[folderId].nameID.split(HIERARCHY_SPLITTER)
    buildHierarchy(nameIDs, map, 0)
  }
  return buildMailFolderExport(map, mailFoldersNameMap, mailFoldersIDMap) ?? []
}

export function exportRules(
  rules: MessageRule[],
  mailContext: MailContextData
) {
  const folderIds: string[] = []
  let categories: string[] = []
  let foldersHierarchy: MailFolderExport[] = []
  for (const rule of rules) {
    delete rule.id
    if (rule.actions) {
      for (const key in rule.actions) {
        if (Object.prototype.hasOwnProperty.call(rule.actions, key)) {
          switch (key) {
            case 'copyToFolder':
            case 'moveToFolder':
              if (!folderIds.includes(rule.actions[key]!)) {
                folderIds.push(rule.actions[key]!)
              }
              rule.actions[key] = mailContext.mailFoldersIDMap
                ? mailContext.mailFoldersIDMap[rule.actions[key]!].nameID
                : ''
              break
            case 'assignCategories':
              categories.push(...rule.actions[key]!)
          }
        }
      }
    }
  }
  categories = [...new Set(categories)]

  if (
    mailContext.mailFoldersIDMap &&
    mailContext.mailFoldersNameMap &&
    folderIds.length > 0
  ) {
    foldersHierarchy = getFoldersHierarchy(
      folderIds,
      mailContext.mailFoldersNameMap,
      mailContext.mailFoldersIDMap
    )
  }

  exportJSON({
    messageRules: rules,
    folders: foldersHierarchy,
    categories,
  })
}
