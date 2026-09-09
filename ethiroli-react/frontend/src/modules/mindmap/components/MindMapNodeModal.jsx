import React, { useState } from 'react';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Input from '../../../common/components/Input/Input.jsx';

export default function MindMapNodeModal({ isOpen, onClose, node, onSave }) {
  const [text, setText] = useState(node?.text || '');

  const save = (e) => {
    e.preventDefault();
    onSave({ ...node, text });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Node">
      <form onSubmit={save} className="form">
        <div className="formGroup">
          <label className="label">Text</label>
          <Input value={text} onChange={(e) => setText(e.target.value)} required />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">Save</button>
        </div>
      </form>
    </Modal>
  );
}
