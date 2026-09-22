import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import ForumThreadList from '../../../modules/lms/components/ForumThreadList.jsx';

export default function StudentForum() {
  return (
    <AdminPage
      title="Discussion Board"
      subtitle="Post questions, share answers, or find collaborators"
    >
      <div className="dashboard">
        <ForumThreadList />
      </div>
    </AdminPage>
  );
}