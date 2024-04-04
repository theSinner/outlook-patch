import { MessageRule } from '@microsoft/microsoft-graph-types'

export interface Props {
  onClose: (hasChange?: boolean) => void
  currentRules?: MessageRule[]
}
