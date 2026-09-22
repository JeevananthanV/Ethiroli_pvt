import React, { useState, useEffect } from 'react';
import { getChurnDashboard, getChurnPredictions } from '../../services/api/predictiveApi';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

const ChurnDashboard = () => {
  const [data, setData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [riskChartData, setRiskChartData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardData, predictionsData] = await Promise.all([
        getChurnDashboard(),
        getChurnPredictions()
      ]);
      setData(dashboardData);
      setPredictions(predictionsData.predictions || predictionsData || []);

      if (dashboardData) {
        setChartData({
          labels: ['Low Risk', 'Medium Risk', 'High Risk'],
          datasets: [{
            label: 'Customers',
            data: [
              dashboardData.lowRisk || 0,
              dashboardData.mediumRisk || 0,
              dashboardData.highRisk || 0,
            ],
            backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
            borderRadius: 8,
          }]
        });
      }

      if (predictionsData) {
        const preds = predictionsData.predictions || predictionsData || [];
        const highRisk = preds.filter(p => (p.churnProbability || p.probability || 0) > 0.7).length;
        const mediumRisk = preds.filter(p => (p.churnProbability || p.probability || 0) > 0.4 && (p.churnProbability || p.probability || 0) <= 0.7).length;
        const lowRisk = preds.filter(p => (p.churnProbability || p.probability || 0) <= 0.4).length;
        setRiskChartData({
          labels: ['Low Risk', 'Medium Risk', 'High Risk'],
          datasets: [{
            data: [lowRisk, mediumRisk, highRisk],
            backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
            borderColor: ['#10b981', '#f59e0b', '#f43f5e'],
            borderWidth: 1,
          }]
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading churn dashboard...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadData}>Retry</button></div>;

  return (
    <AdminPage
      title="Churn Dashboard"
      subtitle="Monitor customer churn predictions and retention metrics"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={<button className="btn primary" onClick={loadData}>Refresh</button>}
    >
      <div className="dashboardGrid" style={{ marginBottom: '24px' }}>
        <div className="statCard">
          <p className="statLabel">Total Customers</p>
          <h3 className="statValue">{data?.totalCustomers || predictions.length || 0}</h3>
        </div>
        <div className="statCard">
          <p className="statLabel">At Risk</p>
          <h3 className="statValue textDanger">{data?.atRisk || predictions.filter(p => (p.churnProbability || p.probability || 0) > 0.7).length || 0}</h3>
        </div>
        <div className="statCard">
          <p className="statLabel">Retention Rate</p>
          <h3 className="statValue textSuccess">{data?.retentionRate ? `${data.retentionRate}%` : 'N/A'}</h3>
        </div>
        <div className="statCard">
          <p className="statLabel">Avg Churn Probability</p>
          <h3 className="statValue textWarning">{data?.avgChurnProbability ? `${(data.avgChurnProbability * 100).toFixed(1)}%` : 'N/A'}</h3>
        </div>
      </div>

      {chartData && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Risk Distribution</h3>
          </div>
          <div className="cardBody">
            <div style={{ height: '300px' }}>
              <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      )}

      {riskChartData && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Churn Risk Breakdown</h3>
          </div>
          <div className="cardBody">
            <div style={{ height: '300px', maxWidth: '400px', margin: '0 auto' }}>
              <Pie data={riskChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">At-Risk Customers</h3>
        </div>
        <div className="cardBody">
          {predictions.length === 0 ? (
            <div className="emptyState">
              <h3>No predictions found</h3>
              <p>No churn predictions available at this time.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Churn Probability</th>
                    <th>Risk Level</th>
                    <th>Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred) => {
                    const probability = pred.churnProbability || pred.probability || 0;
                    const riskLevel = probability > 0.7 ? 'High' : probability > 0.4 ? 'Medium' : 'Low';
                    const riskClass = probability > 0.7 ? 'error' : probability > 0.4 ? 'pending' : 'active';
                    return (
                      <tr key={pred.id || pred.customerId}>
                        <td className="textPrimary">{pred.customerName || pred.name || 'Unknown'}</td>
                        <td className="textSecondary">{(probability * 100).toFixed(1)}%</td>
                        <td>
                          <span className={`statusTag ${riskClass}`}>
                            {riskLevel}
                          </span>
                        </td>
                        <td className="textSecondary">{pred.recommendedAction || pred.action || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
};

export default ChurnDashboard;
