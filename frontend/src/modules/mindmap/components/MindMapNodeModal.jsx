import React, { useState } from 'react';
import Modal from '../../common/components/Modal/Modal.jsx';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const MindMapNodeModal = ({ node, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: node?.title || '',
    content: node?.content || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={node ? 'Edit Mind Map Node' : 'Add Mind Map Node'}>
      <form onSubmit={handleSubmit}>
        {error && <div className="emptyState" style={{ padding: '12px', marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="Enter node title"
        />
        <div className="formGroup" style={{ marginTop: '12px' }}>
          <label className="label">Content</label>
          <textarea
            className="textarea"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            placeholder="Enter node content"
          />
        </div>
        <div className="pageActions" style={{ marginTop: '16px' }}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default MindMapNodeModal;
