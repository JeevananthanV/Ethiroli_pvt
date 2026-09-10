import React, { useState } from 'react';

export default function UserFilters({ onFilterChange }) {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  const handleChange = () => {
    if (onFilterChange) {
      onFilterChange({ search, role });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
      <input
        className="input"
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); handleChange(); }}
        style={{ minWidth: '250px' }}
      />
      <select
        className="select"
        value={role}
        onChange={(e) => { setRole(e.target.value); handleChange(); }}
        style={{ minWidth: '150px' }}
      >
        <option value="">All Roles</option>
        <option value="SUPER_ADMIN">Super Admin</option>
        <option value="ADMIN">Admin</option>
        <option value="SALES">Sales</option>
        <option value="HR">HR</option>
        <option value="TUTOR">Tutor</option>
        <option value="EMPLOYEE">Employee</option>
        <option value="STUDENT">Student</option>
      </select>
    </div>
  );
}
