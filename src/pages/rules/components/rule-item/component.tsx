import { BarsOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { Props } from './types'

import './component.scss'
import { ItemStatus } from '../../../../components'

const { Text } = Typography

export default function RuleItem({ rule, customContent, status }: Props) {
  return (
    <div className="message-rule-item">
      <div className="drag-icon">
        <BarsOutlined />
      </div>
      <div className="name-wrapper">
        <Text className="name">{rule.displayName}</Text>
      </div>
      {customContent}
      <ItemStatus kind={status} />
    </div>
  )
}
