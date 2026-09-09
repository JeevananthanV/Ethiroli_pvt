import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import ClientList from '../../../modules/pms/components/ClientList.jsx';

export default function PMClients() {
  return (
    <AdminPage
      title="Clients"
      subtitle="Manage your client records and subscription accounts"
    >
      <ClientList />
    </AdminPage>
  );
}
