import React from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import SubscriptionManager from '../../../modules/pms/components/SubscriptionManager.jsx';

export default function PMSubscriptions() {
  return (
    <AdminPage
      title="Subscriptions"
      subtitle="Manage recurring client subscriptions and billing cycles"
    >
      <SubscriptionManager />
    </AdminPage>
  );
}
