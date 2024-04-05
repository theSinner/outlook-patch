import { MessageRule } from '@microsoft/microsoft-graph-types'
import {
  MailContextData,
  MailFolderExtended,
  MailFolderExport,
} from '../../contexts/mail/types'
import { mergeWith, isArray } from 'lodash'
import { HIERARCHY_SPLITTER } from '../../constants'
import { getNameID } from '../../utils'

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

export function getFoldersHierarchy(
  nameIDs: string[],
  mailFoldersNameMap: Record<string, string>,
  mailFoldersIDMap: Record<string, MailFolderExtended>
): MailFolderExport {
  if (nameIDs.length === 1) {
    const folder = mailFoldersIDMap[mailFoldersNameMap[nameIDs[0]]]
    return {
      id: folder.nameID,
      displayName: folder.displayName!,
    }
  } else {
    const folder = mailFoldersIDMap[mailFoldersNameMap[getNameID(nameIDs)]]
    const parent = getFoldersHierarchy(
      nameIDs.slice(0, 1),
      mailFoldersNameMap,
      mailFoldersIDMap
    )
    parent.children = [
      {
        id: folder.nameID,
        displayName: folder.displayName!,
      },
    ]
    return parent
  }
}

function mergeCustomizer(objValue: unknown, srcValue: unknown) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue)
  }
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
    const hierarchies = []
    for (const id of folderIds) {
      hierarchies.push(
        getFoldersHierarchy(
          mailContext.mailFoldersIDMap[id].nameID.split(HIERARCHY_SPLITTER),
          mailContext.mailFoldersNameMap,
          mailContext.mailFoldersIDMap
        )
      )
    }
    mergeWith(foldersHierarchy, ...hierarchies, mergeCustomizer)
  }
  exportJSON({
    messageRules: rules,
    folders: foldersHierarchy,
    categories,
  })
}

export function exportJSON(data: Record<string, unknown>) {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`
  const link = document.createElement('a')
  link.href = jsonString
  link.download = 'message-rules.json'

  link.click()
}
