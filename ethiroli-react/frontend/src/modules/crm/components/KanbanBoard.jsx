import React, { useEffect, useState } from 'react';
import KanbanColumn from './KanbanColumn.jsx';
import LeadModal from './LeadModal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Input from '../../../common/components/Input/Input.jsx';
import { getLeads, updateLeadStatus, createLead } from '../../../services/api/leadApi.js';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.js';
import { fetchLeadsStart, fetchLeadsSuccess, fetchLeadsFailure, updateLeadItem, addLead } from '../../../store/slices/leadsSlice.js';

const COLUMNS = ['NEW', 'CONTACTED', 'DEMO', 'COUNSELLING', 'ADMISSION', 'PAYMENT', 'LOST'];

export default function KanbanBoard() {
  const dispatch = useAppDispatch();
  const { items: leads, loading } = useAppSelector((state) => state.leads);
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadSource, setNewLeadSource] = useState('WEBSITE');

  const loadLeads = async () => {
    dispatch(fetchLeadsStart());
    try {
      const data = await getLeads();
      dispatch(fetchLeadsSuccess(data));
    } catch (err) {
      dispatch(fetchLeadsFailure(err.message));
    }
  };

  useEffect(() => {
    loadLeads();
  }, [dispatch]);

  const handleLeadDrop = async (leadId, targetStatus) => {
    try {
      await updateLeadStatus(leadId, targetStatus);
      dispatch(updateLeadItem({ id: leadId, status: targetStatus }));
    } catch (err) {
      console.error('Failed to drop lead:', err);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;

    try {
      const data = await createLead({
        name: newLeadName,
        email: newLeadEmail || null,
        phone: newLeadPhone || null,
        source: newLeadSource
      });
      
      loadLeads();
      setCreateOpen(false);
      setNewLeadName('');
      setNewLeadEmail('');
      setNewLeadPhone('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="boardContainer">
      <div className="boardHeader">
        <h2>Lead CRM Pipeline</h2>
        <Button onClick={() => setCreateOpen(true)} variant="primary">
          + Add Lead
        </Button>
      </div>

      {loading ? (
        <div className="loading">Loading CRM board...</div>
      ) : (
        <div className="columnsContainer">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col}
              status={col}
              leads={leads.filter((lead) => lead.status === col)}
              onLeadClick={setSelectedLead}
              onLeadDrop={handleLeadDrop}
            />
          ))}
        </div>
      )}

      {/* View Lead Details Modal */}
      {selectedLead && (
        <LeadModal
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          lead={selectedLead}
          onLeadUpdate={loadLeads}
        />
      )}

      {/* Create Lead Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add New Lead">
        <form onSubmit={handleCreateLead} className="form">
          <Input 
            label="Name" 
            value={newLeadName} 
            onChange={(e) => setNewLeadName(e.target.value)} 
            required 
          />
          <Input 
            label="Email" 
            type="email" 
            value={newLeadEmail} 
            onChange={(e) => setNewLeadEmail(e.target.value)} 
          />
          <Input 
            label="Phone" 
            value={newLeadPhone} 
            onChange={(e) => setNewLeadPhone(e.target.value)} 
          />
          <div className="inputGroup">
            <label className="label">Source</label>
            <select 
              className="select"
              value={newLeadSource} 
              onChange={(e) => setNewLeadSource(e.target.value)}
            >
              <option value="WEBSITE">Website</option>
              <option value="REFERRAL">Referral</option>
              <option value="SOCIAL_MEDIA">Social Media</option>
              <option value="WALK_IN">Walk-in</option>
              <option value="PHONE">Phone</option>
              <option value="INDEED">Indeed</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <Button type="submit" variant="primary" className="btnFull">Create Lead</Button>
        </form>
      </Modal>
    </div>
  );
}