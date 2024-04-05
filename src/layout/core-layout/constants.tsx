import {
  SettingOutlined,
  CalendarOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems'

export const MENU_URL_MAP: Record<string, string> = {
  'mail-settings-rules': '/settings/mail/rules',
}

export const MENU_ITEMS: ItemType<MenuItemType>[] = [
  {
    key: 'mail',
    icon: <MailOutlined />,
    disabled: true,
    label: 'Mail',
  },
  {
    key: 'calendar',
    icon: <CalendarOutlined />,
    label: 'Calendar',
    disabled: true,
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
    children: [
      {
        key: 'mail-settings',
        label: 'Mail',
        children: [
          {
            key: 'mail-settings-rules',
            label: 'Rules',
          },
        ],
      },
    ],
  },
]
