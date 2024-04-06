import { MailFolder } from '@microsoft/microsoft-graph-types'
import { ReactNode } from 'react'

export interface MailContextData {
  mailFolders?: MailFolderExtended[]
  mailFoldersIDMap?: Record<string, MailFolderExtended>
  mailFoldersNameMap?: Record<string, string>
  categories: string[]
}

export interface Props {
  children: ReactNode
}

export interface MailFolderExtended extends MailFolder {
  nameID: string
  id: string
  displayName: string
  children?: MailFolderExtended[]
}

export interface MailFolderExport {
  displayName: string
  id: string
  children?: MailFolderExport[]
}
