import React, { useState, useEffect } from 'react';
import { getSubscriptions, getSubscriptionPlans, generateInvoiceFromSubscription } from '../../services/api/subscriptionApi';
import { getClients } from '../../services/api/clientApi';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const InvoiceFromSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [clients, setClients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const [preview, setPreview] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [subsData, clientsData, plansData] = await Promise.all([
        getSubscriptions(),
        getClients(),
        getSubscriptionPlans()
      ]);
      setSubscriptions(subsData.subscriptions || subsData || []);
      setClients(clientsData.clients || clientsData || []);
      setPlans(plansData.plans || plansData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedSubscription) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await generateInvoiceFromSubscription(selectedSubscription);
      setPreview(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const getPlanName = (planId) => {
    const plan = plans.find(p => p.id === planId);
    return plan?.name || 'Unknown Plan';
  };

  if (loading) return <div className="loading">Loading subscriptions...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadData}>Retry</button></div>;

  return (
    <AdminPage
      title="Invoice from Subscription"
      subtitle="Generate invoices automatically from subscriptions"
      loading={loading}
      error={error}
      onRetry={loadData}
    >
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Select Subscription</h3>
        </div>
        <div className="cardBody">
          <div className="formGroup">
            <label className="label">Subscription</label>
            <select
              className="select"
              value={selectedSubscription}
              onChange={(e) => setSelectedSubscription(e.target.value)}
            >
              <option value="">Select a subscription</option>
              {subscriptions.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {getClientName(sub.clientId)} - {getPlanName(sub.planId)} - {sub.status}
                </option>
              ))}
            </select>
          </div>
          <div className="pageActions" style={{ marginTop: '16px' }}>
            <Button onClick={handleGenerate} disabled={!selectedSubscription || generating}>
              {generating ? 'Generating...' : 'Generate Invoice'}
            </Button>
          </div>
        </div>
      </div>

      {preview && (
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Invoice Preview</h3>
          </div>
          <div className="cardBody">
            <div className="formGroup">
              <label className="label">Invoice Number</label>
              <p className="textSecondary">{preview.invoiceNumber || preview.id}</p>
            </div>
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Client</label>
              <p className="textSecondary">{preview.clientName || getClientName(preview.clientId)}</p>
            </div>
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Amount</label>
              <p className="textSecondary">{preview.amount ? `$${preview.amount.toFixed(2)}` : '$0.00'}</p>
            </div>
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Due Date</label>
              <p className="textSecondary">{preview.dueDate ? new Date(preview.dueDate).toLocaleDateString() : '-'}</p>
            </div>
            {preview.lineItems && preview.lineItems.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <label className="label">Line Items</label>
                <div className="overflowAuto">
                  <table className="table" style={{ marginTop: '8px' }}>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.lineItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="textSecondary">{item.description}</td>
                          <td className="textSecondary">{item.quantity || 1}</td>
                          <td className="textSecondary">{item.unitPrice ? `$${item.unitPrice.toFixed(2)}` : '$0.00'}</td>
                          <td className="textSecondary">{item.total ? `$${item.total.toFixed(2)}` : '$0.00'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminPage>
  );
};

export default InvoiceFromSubscription;
