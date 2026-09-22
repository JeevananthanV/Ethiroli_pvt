import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function FinanceSettings() {
  const [settings, setSettings] = useState({
    company_name: 'Ethiroli Technologies Private Limited',
    gstin: '33AAACE1234F1Z5',
    pan: 'AAACE1234F',
    base_currency: 'INR',
    fiscal_year_start: '04-01',
    bank_name: 'HDFC Bank Ltd',
    bank_account: '91820491820194',
    bank_ifsc: 'HDFC0001824',
    bank_branch: 'Anna Salai, Chennai',
    invoice_prefix: 'ETH/2026/',
    default_gst_rate: 18.0,
    tds_vendor_rate: 2.0,
    tds_prof_rate: 10.0
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Financial company settings updated successfully.');
  };

  return (
    <AdminPage
      title="Financial Configuration & Settings"
      subtitle="Configure corporate tax credentials, bank payout details, GST rates, and invoice prefix sequences"
    >
      <div className="row g-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Company Tax & Banking Credentials</h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label className="form-label">Legal Entity Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.company_name}
                    onChange={e => setSettings({ ...settings, company_name: e.target.value })}
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Corporate GSTIN</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.gstin}
                      onChange={e => setSettings({ ...settings, gstin: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Company PAN</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.pan}
                      onChange={e => setSettings({ ...settings, pan: e.target.value })}
                    />
                  </div>
                </div>

                <h6 className="fw-bold mt-4 mb-3 text-dark">Invoice Footer Banking Information</h6>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Primary Bank Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.bank_name}
                      onChange={e => setSettings({ ...settings, bank_name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Account Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.bank_account}
                      onChange={e => setSettings({ ...settings, bank_account: e.target.value })}
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">IFSC Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.bank_ifsc}
                      onChange={e => setSettings({ ...settings, bank_ifsc: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Branch Details</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.bank_branch}
                      onChange={e => setSettings({ ...settings, bank_branch: e.target.value })}
                    />
                  </div>
                </div>

                <h6 className="fw-bold mt-4 mb-3 text-dark">Invoice Numbering & Tax Rates</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label">Invoice Prefix</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.invoice_prefix}
                      onChange={e => setSettings({ ...settings, invoice_prefix: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Default GST Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={settings.default_gst_rate}
                      onChange={e => setSettings({ ...settings, default_gst_rate: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Base Currency</label>
                    <select
                      className="form-select"
                      value={settings.base_currency}
                      onChange={e => setSettings({ ...settings, base_currency: e.target.value })}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Financial Settings
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <h6 className="fw-bold mb-3 text-dark">Security & Encryption Policy</h6>
            <p className="text-muted small">
              All banking credentials, account numbers, IFSC codes, PAN, and GST identifiers are protected with <strong>AES-256-GCM field-level encryption</strong> at rest.
            </p>
            <hr />
            <h6 className="fw-bold mb-2 text-dark">Tax Rate Reference (FY 2026-27)</h6>
            <ul className="list-unstyled text-muted small mb-0">
              <li className="mb-2">&bull; <strong>CGST + SGST</strong>: 9% + 9% (Intra-state)</li>
              <li className="mb-2">&bull; <strong>IGST</strong>: 18% (Inter-state & Exports)</li>
              <li className="mb-2">&bull; <strong>TDS 194C</strong>: 1% (Indiv) / 2% (Co)</li>
              <li className="mb-2">&bull; <strong>TDS 194J</strong>: 10% (Professional/Tech fees)</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
