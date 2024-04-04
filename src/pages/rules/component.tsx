import { useContext, useEffect, useState } from 'react'
import {
  DragDropContext,
  Draggable,
  DropResult,
  OnDragEndResponder,
} from 'react-beautiful-dnd'
import { Typography, Button, Modal, message } from 'antd'
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { MessageRule } from '@microsoft/microsoft-graph-types'
import { AppContext } from '../../contexts/app/context'
import { SettingsResource } from '../../network'
import { StrictModeDroppable } from '../../components'
import { RuleItem, UploadForm } from './components'
import { exportRules, reorder } from './utils'

import './component.scss'

const { Title } = Typography

export default function Rules() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false)
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [rules, setRules] = useState<MessageRule[]>()
  const { client } = useContext(AppContext)

  const getData = () => {
    if (client) {
      SettingsResource.getRuleList(client).then(setRules)
    }
  }

  useEffect(() => {
    getData()
  }, [client])

  const updateOrderChanges = (rule: MessageRule, newSequence: number) => {
    if (!client) {
      return
    }
    SettingsResource.updateRule(client, rule.id!, {
      sequence: newSequence,
    })
  }

  const onDragEnd: OnDragEndResponder = (result: DropResult) => {
    if (!rules) {
      return
    }
    const destinationIndex = result.destination?.index || 0
    updateOrderChanges(rules[result.source.index], destinationIndex + 1)
    setRules((prev) => {
      if (!prev) return prev
      return reorder(prev, result.source.index, destinationIndex)
    })
  }

  const onCloseModal = (hasChange?: boolean) => {
    setIsUploadModalOpen(false)
    if (hasChange) {
      getData()
    }
  }

  const onExport = () => {
    if (isExporting || !client) {
      return
    }
    setIsExporting(true)
    SettingsResource.exportRules(client)
      .then((data) => {
        exportRules(data)
      })
      .catch(() => {
        message.error('Failed to export rules')
      })
      .finally(() => {
        setIsExporting(false)
      })
  }

  return (
    <div id="rule-list-page">
      <div className="header">
        <Title className="page-title" level={2}>
          Rules
        </Title>
        <div className="action-wrapper">
          <Button
            icon={<UploadOutlined />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload
          </Button>
          <Button
            icon={<DownloadOutlined />}
            loading={isExporting}
            disabled={!rules?.length}
            onClick={onExport}
          >
            Export
          </Button>
        </div>
      </div>
      <div className="content-wrapper">
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="droppable">
            {(provided) => (
              <div
                className="list-wrapper"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {rules?.map((rule, index) => (
                  <Draggable key={rule.id} draggableId={rule.id!} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <RuleItem rule={rule} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </div>
      {isUploadModalOpen && (
        <Modal
          open
          title="Upload message rules"
          onCancel={() => onCloseModal(false)}
          footer={<span />}
        >
          <UploadForm onClose={onCloseModal} currentRules={rules} />
        </Modal>
      )}
    </div>
  )
}
