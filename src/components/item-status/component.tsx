import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { Spin, theme } from 'antd'
import { Props } from './types'

export default function ItemStatus({ kind }: Props) {
  const {
    token: { colorSuccess, colorError },
  } = theme.useToken()

  switch (kind) {
    case 'loading':
      return (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      )
    case 'success':
      return <CheckCircleOutlined color={colorSuccess} />
    case 'error':
      return <CloseCircleOutlined color={colorError} />
    default:
      return <span />
  }
}
