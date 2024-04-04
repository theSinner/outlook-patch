import { ReactNode } from 'react'
import { MessageRule } from '@microsoft/microsoft-graph-types'
import { ItemStatusKind } from '../../../../components/item-status/types'

export interface Props {
  rule: MessageRule
  customContent?: ReactNode
  status?: ItemStatusKind
}
