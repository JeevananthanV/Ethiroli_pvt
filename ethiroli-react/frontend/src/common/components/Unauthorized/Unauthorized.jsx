import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { getRoleDefaultPath } from '../../common/utils/roleRouting';

function Unauthorized() {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-danger-subtle">
      <div className="text-center">
        <h1 className="display-1 text-danger">403</h1>
        <h2 className="text-danger">Access Denied</h2>
        <p className="lead">You do not have permission to access this resource.</p>
        <p className="text-muted">Your role: <strong>{user?.role || 'None'}</strong></p>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate(getRoleDefaultPath(user?.role) || '/')}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;