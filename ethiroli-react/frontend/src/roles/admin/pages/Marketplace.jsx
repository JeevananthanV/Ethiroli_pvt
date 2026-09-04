import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import SalesDashboard from '../../../modules/marketplace/components/SalesDashboard.jsx';

export default function AdminMarketplace() {
  return (
    <AdminPage title="Marketplace" subtitle="Manage courses, products, and sales across the marketplace">
      <SalesDashboard />
    </AdminPage>
  );
}
