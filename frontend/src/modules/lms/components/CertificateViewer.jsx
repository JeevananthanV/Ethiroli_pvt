import React, { useState, useEffect, useCallback } from 'react'
import certificateApi from '../../../../services/api/certificateApi'

export default function CertificateViewer({ certificateId }) {
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    fetchCertificate()
  }, [certificateId, fetchCertificate])

  const fetchCertificate = useCallback(async () => {
    try {
      const data = await certificateApi.getById(certificateId)
      setCertificate(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [certificateId])

  const handleDownload = async () => {
    try {
      const blob = await certificateApi.download(certificateId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `certificate-${certificateId}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to download certificate: ' + error.message)
    }
  }

  const handleShare = async () => {
    setSharing(true)
    try {
      const data = await certificateApi.share(certificateId)
      navigator.clipboard.writeText(data.shareUrl || window.location.href)
      alert('Share link copied to clipboard!')
    } catch (error) {
      alert('Failed to share certificate: ' + error.message)
    } finally {
      setSharing(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading certificate...</div>
  }

  if (error) {
    return <div className="emptyState textDanger">Error: {error}</div>
  }

  if (!certificate) {
    return <div className="emptyState">Certificate not found</div>
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">Certificate</h3>
        <span className={`statusTag ${certificate.valid ? 'active' : 'pending'}`}>
          {certificate.valid ? 'Valid' : 'Pending'}
        </span>
      </div>
      <div className="cardBody">
        <div className="mb4">
          <h2 className="textXl fontSemibold textPrimary mb2">{certificate.title}</h2>
          <p className="textSecondary">Awarded to: <strong>{certificate.recipientName}</strong></p>
          <p className="textMuted">Completed: {new Date(certificate.issuedAt).toLocaleDateString()}</p>
        </div>

        <div className="card mb4" style={{ background: 'var(--admin-bg-light)', border: '2px dashed var(--admin-border)' }}>
          <div className="cardBody textCenter">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
            <h3 className="fontSemibold textPrimary">{certificate.title}</h3>
            <p className="textSecondary">This certifies that</p>
            <p className="textXl fontSemibold textPrimary my4">{certificate.recipientName}</p>
            <p className="textSecondary">has successfully completed</p>
            <p className="textPrimary fontSemibold mt2">{certificate.courseName}</p>
            <p className="textMuted textSm mt3">Issued on {new Date(certificate.issuedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {certificate.verificationCode && (
          <p className="textMuted textSm mb4">
            Verification Code: <code>{certificate.verificationCode}</code>
          </p>
        )}

        <div className="flex gap3">
          <button className="btn primary" onClick={handleDownload}>
            Download PDF
          </button>
          <button className="btn secondary" onClick={handleShare} disabled={sharing}>
            {sharing ? 'Sharing...' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  )
}
