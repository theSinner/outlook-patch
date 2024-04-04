import { useContext, useEffect, useState } from 'react'

import { Upload, message, Button } from 'antd'
import { MessageRule } from '@microsoft/microsoft-graph-types'
import { InboxOutlined } from '@ant-design/icons'
import { Props } from './types'

import { AppContext } from '../../../../contexts/app/context'
import { ItemStatusKind } from '../../../../components/item-status/types'
import { SettingsResource } from '../../../../network'
import { RuleItem } from '../rule-item'
import { parseFile } from './utils'

import './component.scss'

const { Dragger } = Upload

export default function UploadForm({ onClose, currentRules }: Props) {
  const { client } = useContext(AppContext)
  const [rules, setRules] = useState<MessageRule[]>()
  const [currentRulesMap, setCurrentRulesMap] = useState<
    Record<string, MessageRule>
  >({})
  const [statusMap, setStatusMap] = useState<Record<number, ItemStatusKind>>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const newMap: Record<string, MessageRule> = {}
    if (currentRules) {
      currentRules.forEach((rule) => {
        if (rule.displayName) {
          newMap[rule.displayName.toLowerCase()] = rule
        }
      })
    }
    setCurrentRulesMap(newMap)
  }, [currentRules])

  const setItemStatus = (index: number, status: ItemStatusKind) => {
    setStatusMap((prevData) => ({ ...prevData, [index]: status }))
  }

  const submitData = () => {
    if (isLoading || !client) {
      return
    }
    setIsLoading(true)
    const promises: Promise<void>[] = []
    rules?.forEach((item, index) => {
      setItemStatus(index, 'loading')
      const itemKey = item.displayName?.toLowerCase() ?? ''
      let promise
      if (!currentRulesMap.hasOwnProperty(itemKey)) {
        promise = SettingsResource.createRule(client, item)
        promises.push(promise)
      } else {
        promise = SettingsResource.updateRule(
          client,
          currentRulesMap[itemKey].id!,
          item
        )
        promises.push(promise)
      }
      promise
        .then(() => {
          setItemStatus(index, 'success')
        })
        .catch(() => {
          setItemStatus(index, 'error')
        })
    })
    Promise.all(promises)
      .then(() => {
        onClose(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  return (
    <div id="upload-message-rule-modal">
      <Dragger
        fileList={[]}
        customRequest={({ file }) => {
          parseFile(file as Blob)
            .then(setRules)
            .catch((erroMessage) => {
              message.error(erroMessage)
            })
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>
      <div className="list-wrapper">
        {rules?.map((rule, index) => (
          <RuleItem key={index} rule={rule} status={statusMap?.[index]} />
        ))}
      </div>
      <div className="footer-wrapper">
        <Button
          loading={isLoading}
          type="primary"
          disabled={!rules?.length}
          onClick={submitData}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
