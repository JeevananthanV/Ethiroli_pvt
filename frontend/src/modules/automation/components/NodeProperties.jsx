import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { automationApi } from '../../services/api/automationApi'

const NODE_FIELDS = {
  trigger: [
    { name: 'triggerType', label: 'Trigger Type', type: 'select', options: ['schedule', 'event', 'webhook'] },
    { name: 'cron', label: 'Cron Expression', type: 'text' },
    { name: 'enabled', label: 'Enabled', type: 'checkbox' },
  ],
  action: [
    { name: 'actionType', label: 'Action Type', type: 'select', options: ['send_email', 'create_record', 'update_record', 'call_api'] },
    { name: 'target', label: 'Target', type: 'text' },
    { name: 'payload', label: 'Payload', type: 'textarea' },
  ],
  condition: [
    { name: 'field', label: 'Field', type: 'text' },
    { name: 'operator', label: 'Operator', type: 'select', options: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than'] },
    { name: 'value', label: 'Value', type: 'text' },
  ],
  delay: [
    { name: 'duration', label: 'Duration (ms)', type: 'number' },
    { name: 'unit', label: 'Unit', type: 'select', options: ['seconds', 'minutes', 'hours', 'days'] },
  ],
  notification: [
    { name: 'channel', label: 'Channel', type: 'select', options: ['email', 'sms', 'push', 'in_app'] },
    { name: 'recipient', label: 'Recipient', type: 'text' },
    { name: 'message', label: 'Message', type: 'textarea' },
  ],
}

export default function NodeProperties({ node, onClose, onUpdate }) {
  const [config, setConfig] = useState(node?.config || {})
  const [label, setLabel] = useState(node?.label || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setConfig(node?.config || {})
    setLabel(node?.label || '')
  }, [node])

  if (!node) return null

  const fields = NODE_FIELDS[node.type] || []

  const handleSave = async () => {
    setSaving(true)
    try {
      await automationApi.update(node.id, {
        label,
        config: { ...node, label, config },
      })
      onUpdate?.({ ...node, label, config })
      onClose?.()
    } catch (err) {
      console.error('Failed to save node properties', err)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Modal isOpen={!!node} onClose={onClose} title={`${node.type} Node Properties`}>
      <div className="form">
        <div className="formGroup">
          <label className="label required">Node Label</label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter node label"
          />
        </div>
        {fields.map((field) => (
          <div className="formGroup" key={field.name}>
            <label className="label">{field.label}</label>
            {field.type === 'select' ? (
              <select
                className="select"
                value={config[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                className="inputField"
                value={config[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={`Enter ${field.label}`}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={config[field.name] || false}
                onChange={(e) => handleChange(field.name, e.target.checked)}
              />
            ) : (
              <Input
                type={field.type}
                value={config[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={`Enter ${field.label}`}
              />
            )}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
