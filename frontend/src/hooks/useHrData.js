import { useState, useEffect, useCallback } from 'react';

/**
 * useHrData - Unified data hook for HR portal
 * Ensures proper data flow: API → State → UI with consistent patterns
 * 
 * ALL HR pages should import and use this hook for:
 * - Consistent loading/error/empty states
 * - Standardized CRUD flow
 * - Proper data shape across the application
 */

export const useHrData = (
  fetchFn,
  fetchArgs,
  createFn,
  updateFn,
  deleteFn,
  getSummaryFn
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [summary, setSummary] = useState(null);
  
  const fetchData = useCallback(async () => {
    if (!fetchFn || typeof fetchFn !== 'function') {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(fetchArgs);
      // Result can be an array or an object (like dashboard metrics)
      if (Array.isArray(result)) {
        setData(result);
      } else if (result && typeof result === 'object') {
        if (Array.isArray(result.data)) {
          setData(result.data);
        } else if (Array.isArray(result.list)) {
          setData(result.list);
        } else {
          setData(result);
        }
      } else {
        setData([]);
      }

      if (getSummaryFn && typeof getSummaryFn === 'function') {
        try {
          const sum = await getSummaryFn();
          setSummary(sum);
        } catch (_) {}
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchFn, fetchArgs, getSummaryFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const handleCreate = useCallback(async (formData) => {
    if (!createFn) {
      setError('Create operation not configured');
      return;
    }
    setSubmitting(true);
    try {
      await createFn(formData);
      await fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Create failed');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [createFn, fetchData]);

  const handleUpdate = useCallback(async (id, formData) => {
    if (!updateFn) {
      setError('Update operation not configured');
      return;
    }
    setSubmitting(true);
    try {
      await updateFn(id, formData);
      await fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Update failed');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [updateFn, fetchData]);

  const handleDelete = useCallback(async (id) => {
    if (!deleteFn) {
      setError('Delete operation not configured');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setSubmitting(true);
    try {
      await deleteFn(id);
      await fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Delete failed');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [deleteFn, fetchData]);

  const handleToggleStatus = useCallback(async (id) => {
    if (!updateFn) {
      setError('Toggle not configured');
      return;
    }
    const currentItem = Array.isArray(data) ? data.find((d) => d.id === id) : null;
    const newStatus = currentItem?.is_active === false ? true : false;
    setSubmitting(true);
    try {
      await updateFn(id, { is_active: newStatus });
      await fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Toggle failed');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [data, updateFn, fetchData]);

  const loadSummary = useCallback(async () => {
    if (getSummaryFn && typeof getSummaryFn === 'function') {
      setLoading(true);
      try {
        const result = await getSummaryFn();
        setSummary(result);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load summary');
      } finally {
        setLoading(false);
      }
    }
  }, [getSummaryFn]);

  return {
    data,
    loading,
    error,
    submitting,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    deptFilter,
    setDeptFilter,
    summary,
    fetchData,
    refresh,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleStatus,
    loadSummary,
  };
};

export default useHrData;