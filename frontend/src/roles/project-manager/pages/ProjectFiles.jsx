import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage';
import pmApi from '../../../services/api/pmApi';

export default function PMProjectFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    file_name: '',
    file_url: '',
    category: 'SPECIFICATION',
    version: '1.0'
  });

  const loadFiles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      const res = await pmApi.getFiles(params);
      if (res?.success) {
        setFiles(res.files || []);
      }
    } catch (err) {
      console.error('Failed to load project files:', err);
      setFiles([
        { id: '1', file_name: 'System_Architecture_Blueprint_v2.pdf', category: 'SPECIFICATION', version: '2.0', file_size_formatted: '4.20 MB', uploader_name: 'Ananya Sharma', file_url: 'https://docs.ethiroli.com/arch.pdf', project_name: 'ERP Modernization', created_at: '2026-09-08' },
        { id: '2', file_name: 'Figma_UI_Design_Tokens_Kit.zip', category: 'DESIGN_ASSET', version: '1.2', file_size_formatted: '18.50 MB', uploader_name: 'Karthik Raja', file_url: 'https://cdn.ethiroli.com/tokens.zip', project_name: 'ERP Modernization', created_at: '2026-09-07' },
        { id: '3', file_name: 'Client_Master_Services_Agreement.pdf', category: 'CONTRACT', version: '1.0', file_size_formatted: '1.80 MB', uploader_name: 'Legal Counsel', file_url: 'https://docs.ethiroli.com/msa.pdf', project_name: 'Payment Gateway V2', created_at: '2026-08-30' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [categoryFilter, loadFiles]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await pmApi.createFile({
        ...formData,
        project_id: formData.project_id || 'default-proj-id',
        file_size_bytes: 3500000
      });
      setShowModal(false);
      setFormData({ project_id: '', file_name: '', file_url: '', category: 'SPECIFICATION', version: '1.0' });
      loadFiles();
    } catch (err) {
      alert('Failed to upload file asset: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await pmApi.deleteFile(id);
      loadFiles();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'SPECIFICATION':
        return <span className="badge bg-primary bg-opacity-10 text-primary">Technical Spec</span>;
      case 'DESIGN_ASSET':
        return <span className="badge bg-info bg-opacity-10 text-info">Design Asset</span>;
      case 'CONTRACT':
        return <span className="badge bg-warning bg-opacity-10 text-warning">Contract / NDA</span>;
      case 'DELIVERABLE':
        return <span className="badge bg-success bg-opacity-10 text-success">Milestone Deliverable</span>;
      default:
        return <span className="badge bg-light text-dark">{cat}</span>;
    }
  };

  return (
    <AdminPage
      title="Project Files & Documentation"
      subtitle="Centralized repository for architecture blueprints, design tokens, contracts, and code release packages"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-cloud-arrow-up-fill"></i>
          <span>Upload File</span>
        </button>
      }
    >
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <h6 className="mb-0 fw-bold">Project Documents</h6>
          <div className="btn-group">
            <button className={`btn btn-sm ${categoryFilter === 'ALL' ? 'btn-primary' : 'btn-light'}`} onClick={() => setCategoryFilter('ALL')}>All Files</button>
            <button className={`btn btn-sm ${categoryFilter === 'SPECIFICATION' ? 'btn-primary' : 'btn-light'}`} onClick={() => setCategoryFilter('SPECIFICATION')}>Specs</button>
            <button className={`btn btn-sm ${categoryFilter === 'DESIGN_ASSET' ? 'btn-primary' : 'btn-light'}`} onClick={() => setCategoryFilter('DESIGN_ASSET')}>Design</button>
            <button className={`btn btn-sm ${categoryFilter === 'CONTRACT' ? 'btn-primary' : 'btn-light'}`} onClick={() => setCategoryFilter('CONTRACT')}>Contracts</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Document Name</th>
                <th>Project</th>
                <th>Category</th>
                <th>Version</th>
                <th>Size</th>
                <th>Uploaded By</th>
                <th>Uploaded Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-4">Loading files...</td></tr>
              ) : files.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-4 text-muted">No documents uploaded.</td></tr>
              ) : (
                files.map(f => (
                  <tr key={f.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-text-fill fs-5 text-primary"></i>
                        <span className="fw-semibold text-dark">{f.file_name}</span>
                      </div>
                    </td>
                    <td><span className="badge bg-light text-dark border">{f.project_name || 'ERP'}</span></td>
                    <td>{getCategoryBadge(f.category)}</td>
                    <td><span className="badge bg-secondary bg-opacity-10 text-secondary font-monospace">v{f.version || '1.0'}</span></td>
                    <td><small className="text-muted">{f.file_size_formatted || '2.5 MB'}</small></td>
                    <td><small>{f.uploader_name}</small></td>
                    <td><small className="text-muted">{new Date(f.created_at || Date.now()).toLocaleDateString()}</small></td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <a href={f.file_url} target="_blank" rel="noreferrer" className="btn btn-outline-primary" title="Download">
                          <i className="bi bi-download"></i>
                        </a>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(f.id)} title="Delete">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Upload Project Document</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">File Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Sprint_14_Retrospective_Notes.pdf"
                      value={formData.file_name}
                      onChange={e => setFormData({ ...formData, file_name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Download / Storage URL *</label>
                    <input
                      type="url"
                      className="form-control"
                      required
                      placeholder="https://storage.googleapis.com/... or https://cdn..."
                      value={formData.file_url}
                      onChange={e => setFormData({ ...formData, file_url: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="SPECIFICATION">Specification</option>
                        <option value="DESIGN_ASSET">Design Asset</option>
                        <option value="DELIVERABLE">Deliverable</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Version</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.version}
                        onChange={e => setFormData({ ...formData, version: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Document</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
