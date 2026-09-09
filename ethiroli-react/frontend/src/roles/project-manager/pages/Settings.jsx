import React from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import CompanySettings from '../../../modules/pms/components/CompanySettings.jsx';

export default function PMSettings() {
  return (
    <AdminPage
      title="Company Settings"
      subtitle="Configure company profile, bank details, GST registry, and invoice branding"
    >
      <CompanySettings />
    </AdminPage>
  );
}
