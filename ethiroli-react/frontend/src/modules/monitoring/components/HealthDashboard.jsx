import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getHealthDashboard, getServiceStatus, getSystemMetrics } from '../../services/api/monitoringApi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HealthDashboard = () => {
  const [data, setData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardData, servicesData, metricsData] = await Promise.all([
        getHealthDashboard(),
        getServiceStatus(),
        getSystemMetrics()
      ]);
      setData(dashboardData);
      setServices(servicesData.services || servicesData || []);
      setMetrics(metricsData);

      if (metricsData && metricsData.responseTimes) {
        setChartData({
          labels: metricsData.responseTimes.map(r => r.time || r.timestamp),
          datasets: [{
            label: 'Response Time (ms)',
            data: metricsData.responseTimes.map(r => r.value || r.responseTime),
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            tension: 0.4,
            fill: true,
          }]
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return 'pending';
    const lower = status.toLowerCase();
    if (lower === 'healthy' || lower === 'up' || lower === 'operational') return 'active';
    if (lower === 'degraded' || lower === 'warning') return 'pending';
    if (lower === 'down' || lower === 'unhealthy' || lower === 'critical') return 'error';
    return 'pending';
  };

  if (loading) return <div className="loading">Loading health dashboard...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadData}>Retry</button></div>;

  return (
    <AdminPage
      title="Health Dashboard"
      subtitle="System health and uptime monitoring"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={<button className="btn primary" onClick={loadData}>Refresh</button>}
    >
      <div className="dashboardGrid" style={{ marginBottom: '24px' }}>
        <div className="statCard">
          <p className="statLabel">Uptime</p>
          <h3 className="statValue textSuccess">{data?.uptime || metrics?.uptime || '99.9%'}</h3>
        </div>
        <div className="statCard">
          <p className="statLabel">Avg Response Time</p>
          <h3 className="statValue">{data?.avgResponseTime || metrics?.avgResponseTime || '45ms'}</h3>
        </div>
        <div className="statCard">
          <p className="statLabel">Active Services</p>
          <h3 className="statValue textSuccess">{services.filter(s => s.status?.toLowerCase() === 'healthy' || s.status?.toLowerCase() === 'up').length}</h3>
        </div>
        <div className="statCard">
          <p className="statLabel">Total Services</p>
          <h3 className="statValue">{services.length || 0}</h3>
        </div>
      </div>

      {chartData && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Response Time Trends</h3>
          </div>
          <div className="cardBody">
            <div style={{ height: '300px' }}>
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Service Status</h3>
        </div>
        <div className="cardBody">
          {services.length === 0 ? (
            <div className="emptyState">
              <h3>No services found</h3>
              <p>No service status information available.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Uptime</th>
                    <th>Last Check</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id || service.name}>
                      <td className="textPrimary">{service.name || service.service || 'Unknown'}</td>
                      <td>
                        <span className={`statusTag ${getStatusClass(service.status)}`}>
                          {service.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="textSecondary">{service.uptime || '-'}</td>
                      <td className="textSecondary">{service.lastCheck ? new Date(service.lastCheck).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
};

export default HealthDashboard;
