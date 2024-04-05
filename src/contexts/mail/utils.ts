import { Client } from '@microsoft/microsoft-graph-client'
import { MailFolder } from '@microsoft/microsoft-graph-types'
import { SettingsResource } from '../../network'
import { MailFolderExtended } from './types'
import { getNameID } from '../../utils'

export async function getChildFolders(
  client: Client,
  parent: MailFolder,
  parentNames: string[]
): Promise<MailFolderExtended[]> {
  const allFolders: MailFolderExtended[] = []
  const folders = await SettingsResource.getChildFolders(client, parent.id!)
  for (const item of folders) {
    const hierarchy = [...parentNames, item.displayName!]
    const extendedFolder: MailFolderExtended = {
      ...item,
      id: item.id!,
      displayName: item.displayName!,
      nameID: getNameID(hierarchy),
    }
    allFolders.push(extendedFolder)
    if (item.childFolderCount && item.childFolderCount > 0) {
      const folders = await getChildFolders(client, item, hierarchy)
      allFolders.push(...folders)
    }
  }
  return allFolders
}

export async function getFolders(client: Client) {
  const allFolders: MailFolderExtended[] = []
  const mainFolders = await SettingsResource.getFolderList(client)
  for (const folder of mainFolders) {
    const extendedFolder: MailFolderExtended = {
      ...folder,
      id: folder.id!,
      displayName: folder.displayName!,
      nameID: getNameID([folder.displayName!]),
    }
    allFolders.push(extendedFolder)
    if (folder.childFolderCount && folder.childFolderCount > 0) {
      const folders = await getChildFolders(client, folder, [
        folder.displayName!,
      ])
      allFolders.push(...folders)
    }
  }

  const idMap: Record<string, MailFolderExtended> = {}
  const nameMap: Record<string, string> = {}
  for (const folder of allFolders) {
    idMap[folder.id!] = folder
    nameMap[folder.nameID] = folder.id!
  }
  return {
    idMap,
    nameMap,
    folders: allFolders,
  }
}
