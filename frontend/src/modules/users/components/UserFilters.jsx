import React, { useState, useEffect } from 'react';
import { getUserFilters } from '../../services/api/userApi';
import Input from '../../common/components/Input/Input.jsx';

const UserFilters = ({ filters, onFilterChange }) => {
  const [availableFilters, setAvailableFilters] = useState(null);
  const [localFilters, setLocalFilters] = useState(filters || {
    search: '',
    role: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    let isMounted = true;
    const fetchFilters = async () => {
      try {
        const data = await getUserFilters();
        if (isMounted) {
          setAvailableFilters(data);
        }
      } catch (err) {
        console.error('Failed to load filters:', err);
      }
    };
    fetchFilters();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleClear = () => {
    const cleared = {
      search: '',
      role: '',
      status: '',
      dateFrom: '',
      dateTo: '',
    };
    setLocalFilters(cleared);
    if (onFilterChange) onFilterChange(cleared);
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div className="cardHeader">
        <h3 className="cardTitle">Filters</h3>
        <button className="btn btnSm secondary" onClick={handleClear}>Clear</button>
      </div>
      <div className="cardBody">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Input
            label="Search"
            value={localFilters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search users..."
          />
          <div className="formGroup">
            <label className="label">Role</label>
            <select
              className="select"
              value={localFilters.role}
              onChange={(e) => handleChange('role', e.target.value)}
            >
              <option value="">All Roles</option>
              {availableFilters?.roles?.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Status</label>
            <select
              className="select"
              value={localFilters.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <Input
            label="Date From"
            type="date"
            value={localFilters.dateFrom}
            onChange={(e) => handleChange('dateFrom', e.target.value)}
          />
          <Input
            label="Date To"
            type="date"
            value={localFilters.dateTo}
            onChange={(e) => handleChange('dateTo', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
