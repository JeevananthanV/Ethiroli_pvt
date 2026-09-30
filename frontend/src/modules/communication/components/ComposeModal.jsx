import React, { useState, useEffect } from 'react';
import Modal from '../../common/components/Modal'
import Button from '../../common/components/Button'
import Input from '../../common/components/Input'
import { templateApi } from '../../services/api/templateApi'
import { communicationApi } from '../../services/api/communicationApi'

export default function ComposeModal({ isOpen, onClose, onSend }) {
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [channel, setChannel] = useState('email')
  const [recipients, setRecipients] = useState('')
  const [variables, setVariables] = useState({})
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (isOpen) {
      templateApi.getAll().then(setTemplates).catch(console.error)
    }
  }, [isOpen])

  const handleTemplateChange = (e) => {
    const template = templates.find((t) => t.id === e.target.value)
    setSelectedTemplate(template)
    const initialVars = {}
    template?.variables?.forEach((v) => {
      initialVars[v] = ''
    })
    setVariables(initialVars)
  }

  const handleSend = async () => {
    if (!selectedTemplate) return
    setSending(true)
    try {
      await communicationApi.send({
        templateId: selectedTemplate.id,
        channel,
        recipients: recipients.split(',').map((r) => r.trim()),
        variables,
      })
      onSend?.()
      onClose?.()
    } catch (err) {
      console.error('Failed to send message', err)
    } finally {
      setSending(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compose Message">
      <div className="form">
        <div className="formGroup">
          <label className="label required">Template</label>
          <select className="select" value={selectedTemplate?.id || ''} onChange={handleTemplateChange}>
            <option value="">Select Template</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div className="formGroup">
          <label className="label required">Channel</label>
          <select className="select" value={channel} onChange={(e) => setChannel(e.target.value)}>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="push">Push Notification</option>
            <option value="in_app">In-App</option>
          </select>
        </div>
        <div className="formGroup">
          <label className="label required">Recipients</label>
          <Input
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="user1@example.com, user2@example.com"
          />
        </div>
        {selectedTemplate?.variables?.map((v) => (
          <div className="formGroup" key={v}>
            <label className="label required">{v}</label>
            <Input
              value={variables[v] || ''}
              onChange={(e) => setVariables((prev) => ({ ...prev, [v]: e.target.value }))}
              placeholder={`Enter ${v}`}
            />
          </div>
        ))}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSend} disabled={sending || !selectedTemplate}>
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
