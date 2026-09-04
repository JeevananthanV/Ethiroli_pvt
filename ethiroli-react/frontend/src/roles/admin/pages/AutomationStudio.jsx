import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import WorkflowCanvas from '../../../modules/automation/components/WorkflowCanvas.jsx';

export default function AdminAutomationStudio() {
  return (
    <AdminPage title="Automation Studio" subtitle="Design, configure, and monitor automated workflows">
      <WorkflowCanvas />
    </AdminPage>
  );
}
