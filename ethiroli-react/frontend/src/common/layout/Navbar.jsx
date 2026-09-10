import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar({ role, onSearchClick }) {
  const { logout, user } = useAuth();
  const displayUser = user;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">Ethiroli Platform</span>
        <div className="d-flex align-items-center">
          {onSearchClick && (
            <button className="btn btn-outline-light btn-sm me-3" onClick={onSearchClick} title="Search">
              Search
            </button>
          )}
          {displayUser && (
            <>
              <span className="navbar-text me-3">
                {displayUser.full_name || displayUser.email} ({displayUser.role || role})
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}