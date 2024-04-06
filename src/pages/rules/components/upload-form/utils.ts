import { MessageRule } from '@microsoft/microsoft-graph-types'
import { Client } from '@microsoft/microsoft-graph-client'
import {
  MailContextData,
  MailFolderExport,
} from '../../../../contexts/mail/types'
import { SettingsResource } from '../../../../network'
import { UploadedData } from './types'

export async function parseFile(file: Blob) {
  return new Promise<UploadedData>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        if (event.target?.result && typeof event.target.result === 'string') {
          const object = JSON.parse(event.target.result)
          if (object.hasOwnProperty('messageRules')) {
            resolve(object)
            return
          }
        }
        reject('Invalid file')
      } catch (error) {
        reject('Invalid file')
      }
    }
    reader.readAsText(file)
  })
}

export async function addCategories(
  client: Client,
  categories: string[],
  currentCategories: string[]
) {
  try {
    for (const category of categories) {
      if (!currentCategories.includes(category)) {
        await SettingsResource.createCategory(client, category)
      }
    }
  } catch (error) {
    throw new Error('Fail to add categories')
  }
}

export async function addFolders(
  client: Client,
  foldersHierarchy: MailFolderExport[],
  mailContextData: MailContextData,
  map: Record<string, string>,
  parentId?: string
) {
  if (!mailContextData.mailFoldersNameMap) {
    return
  }
  try {
    for (const folder of foldersHierarchy) {
      if (mailContextData.mailFoldersNameMap.hasOwnProperty(folder.id)) {
        map[folder.id] = mailContextData.mailFoldersNameMap[folder.id]
      } else {
        let folderData
        if (parentId) {
          folderData = await SettingsResource.createChildMailFolder(
            client,
            folder.displayName!,
            parentId
          )
        } else {
          folderData = await SettingsResource.createMailFolder(
            client,
            folder.displayName!
          )
        }
        map[folder.id] = folderData.id!
      }
      if (folder.children) {
        await addFolders(
          client,
          folder.children,
          mailContextData,
          map,
          map[folder.id]
        )
      }
    }
  } catch (error) {
    throw new Error('Fail to add folders')
  }
}

export async function handleUpsertRule(
  client: Client,
  currentRulesMap: Record<string, MessageRule>,
  rule: MessageRule,
  mailFolderMap: Record<string, string>
) {
  if (rule.actions) {
    for (const key in rule.actions) {
      if (Object.prototype.hasOwnProperty.call(rule.actions, key)) {
        switch (key) {
          case 'copyToFolder':
          case 'moveToFolder':
            if (mailFolderMap.hasOwnProperty(rule.actions[key]!)) {
              rule.actions[key] = mailFolderMap[rule.actions[key]!]
            } else {
              throw new Error('Folder not found')
            }
            break
        }
      }
    }
  }

  const itemKey = rule.displayName?.toLowerCase() ?? ''
  if (!currentRulesMap.hasOwnProperty(itemKey)) {
    await SettingsResource.createRule(client, rule)
  } else {
    await SettingsResource.updateRule(
      client,
      currentRulesMap[itemKey].id!,
      rule
    )
  }
}
