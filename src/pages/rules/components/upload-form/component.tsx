import { useContext, useEffect, useState } from 'react'

import { Upload, message, Button } from 'antd'
import { MessageRule } from '@microsoft/microsoft-graph-types'
import { InboxOutlined } from '@ant-design/icons'
import { Props, UploadedData } from './types'

import { AppContext } from '../../../../contexts/app/context'
import { ItemStatusKind } from '../../../../components/item-status/types'
import { RuleItem } from '../rule-item'
import { addCategories, addFolders, handleUpsertRule, parseFile } from './utils'

import './component.scss'
import { MailContext } from '../../../../contexts'

const { Dragger } = Upload

export default function UploadForm({ onClose, currentRules }: Props) {
  const { client } = useContext(AppContext)
  const mailContextData = useContext(MailContext)
  const [uploadedData, setUploadedData] = useState<UploadedData>()
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

  const submitData = async () => {
    if (isLoading || !client) {
      return
    }
    setIsLoading(true)
    const promises: Promise<void>[] = []
    const folderMap = {}
    if (uploadedData?.categories) {
      await addCategories(
        client,
        uploadedData?.categories,
        mailContextData.categories
      )
    }
    await addFolders(
      client,
      uploadedData?.folders ?? [],
      mailContextData,
      folderMap
    )
    uploadedData?.messageRules?.forEach((item, index) => {
      setItemStatus(index, 'loading')
      const promise = handleUpsertRule(client, currentRulesMap, item, folderMap)
      promise
        .then(() => {
          setItemStatus(index, 'success')
        })
        .catch(() => {
          setItemStatus(index, 'error')
        })
      promises.push(promise)
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
            .then(setUploadedData)
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
        {uploadedData?.messageRules?.map((rule, index) => (
          <RuleItem
            key={rule.displayName}
            rule={rule}
            status={statusMap?.[index]}
          />
        ))}
      </div>
      <div className="footer-wrapper">
        <Button
          loading={isLoading}
          type="primary"
          disabled={!uploadedData?.messageRules?.length}
          onClick={submitData}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
