import React, { useState } from 'react'

export default function GSTCalculator() {
  const [amount, setAmount] = useState('')
  const [gstRate, setGstRate] = useState('18')
  const [calculationType, setCalculationType] = useState('add')

  const numericAmount = parseFloat(amount) || 0
  const rate = parseFloat(gstRate) || 0

  let gstAmount = 0
  let totalAmount = 0

  if (calculationType === 'add') {
    gstAmount = (numericAmount * rate) / 100
    totalAmount = numericAmount + gstAmount
  } else {
    totalAmount = numericAmount
    gstAmount = (numericAmount * rate) / (100 + rate)
  }

  const baseAmount = calculationType === 'add' ? numericAmount : totalAmount - gstAmount

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">GST Calculator</h3>
      </div>
      <div className="cardBody">
        <div className="form">
          <div className="formGroup">
            <label className="label required">Calculation Type</label>
            <select className="select" value={calculationType} onChange={(e) => setCalculationType(e.target.value)}>
              <option value="add">Add GST to Amount</option>
              <option value="remove">Remove GST from Amount</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label required">{calculationType === 'add' ? 'Base Amount ($)' : 'Total Amount ($)'}</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div className="formGroup">
            <label className="label required">GST Rate (%)</label>
            <Input type="number" value={gstRate} onChange={(e) => setGstRate(e.target.value)} placeholder="18" />
          </div>
        </div>

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--admin-border)', paddingTop: '20px' }}>
          <div className="grid gridCols3">
            <div className="statCard">
              <div className="statLabel">{calculationType === 'add' ? 'Base Amount' : 'Net Amount'}</div>
              <div className="statValue">${baseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="statCard">
              <div className="statLabel">GST Amount</div>
              <div className="statValue textWarning">${gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="statCard">
              <div className="statLabel">{calculationType === 'add' ? 'Total Amount' : 'Gross Amount'}</div>
              <div className="statValue textSuccess">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px', background: 'var(--admin-bg-light)' }}>
            <div className="cardBody" style={{ padding: '16px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--admin-text-primary)' }}>Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="textSecondary">{calculationType === 'add' ? 'Base Amount' : 'Net Amount'}</span>
                  <span style={{ color: 'var(--admin-text-primary)' }}>${baseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="textSecondary">GST ({rate}%)</span>
                  <span style={{ color: 'var(--admin-warning)' }}>+${gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span style={{ color: 'var(--admin-text-primary)' }}>{calculationType === 'add' ? 'Total' : 'Gross Total'}</span>
                  <span style={{ color: 'var(--admin-text-primary)' }}>${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
