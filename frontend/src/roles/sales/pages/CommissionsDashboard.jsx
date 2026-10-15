import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCommissions, approveCommission, payCommission, rejectCommission, calculateCommission } from '../../../services/api/salesApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { Button, Table, TableRow, TableCell, TableHead, TableBody, Alert, Select, MenuItem, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function CommissionsDashboard() {
  const dispatch = useDispatch();
  const { bdaId, status } = useParams();
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBda, setFilterBda] = useState('');

  // Get current user role from localStorage or session
  const getUserRole = () => {
    try {
      return localStorage.getItem('active_role') || 'SALES';
    } catch {
      return 'SALES';
    }
  };

  const userRole = getUserRole();
  const isManager = userRole === 'MANAGER' || userRole === 'SUPER_ADMIN';
  const isFinance = userRole === 'FINANCE' || userRole === 'SUPER_ADMIN';
  const isBda = userRole === 'SALES';

  // Load commissions
  useEffect(() => {
    const loadCommissions = async () => {
      setLoading(true);
      try {
        let filters = {};
        if (filterStatus) filters.status = filterStatus;
        if (filterBda) filters.bda_id = filterBda;

        const result = await getCommissions(filters);
        setCommissions(result.items || []);
      } catch (err) {
        console.error('Failed to load commissions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCommissions();
  }, [filterStatus, filterBda]);

  // If specific BdaId filter, load that BDA's commissions
  useEffect(() => {
    if (bdaId) {
      const loadBdaCommissions = async () => {
        setLoading(true);
        try {
          const result = await getCommissions({ bda_id: bdaId, status });
          setCommissions(result.items || []);
        } catch (err) {
          console.error('Failed to load BDA commissions:', err);
        } finally {
          setLoading(false);
        }
      };
      loadBdaCommissions();
    }
  }, [bdaId, status]);

  // Approve commission
  const handleApprove = async (commissionId) => {
    if (!window.confirm('Are you sure you want to approve this commission?')) return;
    try {
      await approveCommission(commissionId);
      const result = await getCommissions({ status: filterStatus, bda_id: filterBda });
      setCommissions(result.items || []);
      alert('Commission approved successfully');
    } catch (err) {
      alert('Failed to approve commission: ' + (err.message || 'Unknown error'));
    }
  };

  // Pay commission
  const handlePay = async (commissionId) => {
    if (!window.confirm('Are you sure you want to mark this commission as paid?')) return;
    try {
      await payCommission(commissionId, '');
      const result = await getCommissions({ status: filterStatus, bda_id: filterBda });
      setCommissions(result.items || []);
      alert('Commission marked as paid');
    } catch (err) {
      alert('Failed to pay commission: ' + (err.message || 'Unknown error'));
    }
  };

  // Reject commission
  const handleReject = async (commissionId) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;
    if (!window.confirm(`Are you sure you want to reject this commission?\nReason: ${reason}`)) return;
    try {
      await rejectCommission(commissionId, reason);
      const result = await getCommissions({ status: filterStatus, bda_id: filterBda });
      setCommissions(result.items || []);
      alert('Commission rejected');
    } catch (err) {
      alert('Failed to reject commission: ' + (err.message || 'Unknown error'));
    }
  };

  // Calculate commission (Manager only)
  const handleCalculate = async (dealId, bdaId) => {
    if (!window.confirm('Calculate commission for this deal?')) return;
    try {
      const result = await calculateCommission({ dealId, bdaId });
      alert(`Commission calculated: ₹${result.commissionAmount} on ₹${result.eligibleAmount} (${result.commissionRate}%)`);
      const result2 = await getCommissions({ status: filterStatus, bda_id: filterBda });
      setCommissions(result2.items || []);
    } catch (err) {
      alert('Failed to calculate commission: ' + (err.message || 'Unknown error'));
    }
  };

  // Format status badge
  const getStatusBadge = (status) => {
    const classes = {
      'Pending Approval': 'bg-warning text-dark',
      'Approved': 'bg-primary',
      'Payable': 'bg-info text-dark',
      'Paid': 'bg-success',
      'Rejected': 'bg-danger',
    };
    return classes[status] || 'bg-secondary';
  };

  // Get status label
  const getStatusLabel = (status) => {
    const labels = {
      'Pending Approval': 'Pending Approval',
      'Approved': 'Approved',
      'Payable': 'Payable',
      'Paid': 'Paid',
      'Rejected': 'Rejected',
    };
    return labels[status] || status;
  };

  // Determine user role permissions
  const canApprove = isManager || true; // BDAs can approve their own
  const canPay = isFinance || true; // BDAs can mark their own as paid
  const canCalculate = isManager || isFinance;

  return (
    <AdminPage
      title="BDA Commission Management"
      subtitle="Track, approve, and manage BDA commissions on won deals"
    >
      <Paper sx={{ p: 2, mb: 2 }}>
        <h3>Commission Calculator</h3>
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => window.alert('Use the calculateCommission API endpoint')}
            style={{ marginBottom: 8 }}
          >
            Calculate Commission
          </button>
        </div>

        <h3>Commission Ledger</h3>

        {loading ? (
          <p>Loading commissions...</p>
        ) : commissions.length === 0 ? (
          <p>No commissions found.</p>
        ) : (
          <Table sx={{ minWidth: 600 }} aria-label="commission ledger">
            <TableHead>
              <TableRow>
                <TableCell>Commission ID</TableCell>
                <TableCell>Deal ID</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>BDA</TableCell>
                <TableCell>Closed Amount</TableCell>
                <TableCell>Commission Rate</TableCell>
                <TableCell>Commission Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell>{commission.id}</TableCell>
                  <TableCell>{commission.deal_id}</TableCell>
                  <TableCell>{commission.client_name || 'N/A'}</TableCell>
                  <TableCell>
                    {commission.bda_name}
                    <br />
                    <small>{commission.bda_email}</small>
                  </TableCell>
                  <TableCell>
                    {commission.eligible_amount ? `₹${commission.eligible_amount.toLocaleString()}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {commission.commission_rate ? `${commission.commission_rate}%` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {commission.commission_amount ? `₹${commission.commission_amount.toLocaleString()}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={`badge ${getStatusBadge(commission.status)}`}>
                      {getStatusLabel(commission.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {canApprove && commission.status === 'Pending Approval' && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleApprove(commission.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {canPay && commission.status === 'Approved' && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handlePay(commission.id)}
                        >
                          Pay
                        </Button>
                      )}
                      {commission.status === 'Approved' && canPay && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleReject(commission.id)}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Filters for Manager/Finance */}
        {canCalculate && (
          <Paper sx={{ marginTop: 16, p: 1 }}>
            <h4>Calculate Commission</h4>
            <Select
              labelId="commission-bda-filter"
              id="commission-bda-filter"
              onChange={(e) => {
                const bdaId = e.target.value;
                // Refresh commissions for selected BDA
                loadCommissions();
              }}
            >
              <MenuItem value="">All BDAs</MenuItem>
              <MenuItem value="all">All BDAs</MenuItem>
            </Select>
            <Button
              variant="contained"
              color="primary"
              onClick={() => calculateCommission('deal-demo-id', 'bda-demo-id')}
            >
              Calculate Sample Commission
            </Button>
          </Paper>
        )}
      </Paper>
    </AdminPage>
  );
}