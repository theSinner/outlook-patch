import { MessageRule } from '@microsoft/microsoft-graph-types'
import { MailFolderExport } from '../../../../contexts/mail/types'

export interface Props {
  onClose: (hasChange?: boolean) => void
  currentRules?: MessageRule[]
}

export interface UploadedData {
  messageRules: MessageRule[]
  folders: MailFolderExport[]
  categories: string[]
}
