import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import TaskBoard from '../../../modules/pms/components/TaskBoard.jsx';

export default function PMTasks() {
  return (
    <AdminPage
      title="Task Board"
      subtitle="Manage your team's workflow with drag-and-drop Kanban columns"
    >
      <TaskBoard />
    </AdminPage>
  );
}
