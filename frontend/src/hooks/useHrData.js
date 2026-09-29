/**
 * useHrData - Unified data hook for HR portal
 * Ensures proper data flow: API → State → UI with consistent patterns
 * 
 * ALL HR pages should import and use this hook for:
 * - Consistent loading/error/empty states
 * - Standardized CRUD flow
 * - Reusable toast/error handling
 * - Proper data shape across the application
 */

/** @typedef {Object} HrDataState */
/** @property {any[]} data */
/** @property {boolean} loading */
/** @property {string | null} error */
/** @property {string} search */
/** @property {string} statusFilter */
/** @property {string} deptFilter */
/** @property {(value: string) => void} setSearch */
/** @property {(value: string) => void} setStatusFilter */
/** @property {(value: string) => void} setDeptFilter */
/** @property {() => Promise<void>} refresh */
/** @property {(id: string, data: any) => Promise<void>} create */
/** @property {(id: string, data: any) => Promise<void>} update */
/** @property {(id: string) => Promise<void>} delete */
/** @property {(id: string) => Promise<void>} toggleStatus */

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
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(fetchArgs);
      const list = Array.isArray(result) ? result : (result?.data || result?.list || []);
      setData(list);
      if (getSummaryFn) {
        try {
          const summary = await getSummaryFn();
        } catch (e) {}
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
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
    setSubmitting?.(true);
    try {
      await createFn(formData);
      await fetchData();
      setSubmitting?.(false);
      showToast?.(`Created successfully!`);
    } catch (err) {
      setError(err.message || 'Create failed');
      showToast?.(err.message || 'Create failed');
    } finally {
      setSubmitting?.(false);
    }
  }, [createFn, fetchData, showToast, setSubmitting]);

  const handleUpdate = useCallback(async (id, formData) => {
    if (!updateFn) {
      setError('Update operation not configured');
      return;
    }
    setSubmitting?.(true);
    try {
      await updateFn(id, formData);
      await fetchData();
      setSubmitting?.(false);
      showToast?.(`Updated successfully!`);
    } catch (err) {
      setError(err.message || 'Update failed');
      showToast?.(err.message || 'Update failed');
    } finally {
      setSubmitting?.(false);
    }
  }, [updateFn, fetchData, showToast, setSubmitting]);

  const handleDelete = useCallback(async (id) => {
    if (!deleteFn) {
      setError('Delete operation not configured');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setSubmitting?.(true);
    try {
      await deleteFn(id);
      await fetchData();
      setSubmitting?.(false);
      showToast?.('Deleted successfully!');
    } catch (err) {
      setError(err.message || 'Delete failed');
      showToast?.(err.message || 'Delete failed');
    } finally {
      setSubmitting?.(false);
    }
  }, [deleteFn, fetchData, showToast, setSubmitting]);

  const handleToggleStatus = useCallback(async (id) => {
    if (!updateFn) {
      setError('Toggle not configured');
      return;
    }
    const currentItem = data.find((d) => d.id === id);
    const newStatus = currentItem?.is_active === false ? true : false;
    setSubmitting?.(true);
    try {
      await updateFn(id, { is_active: newStatus });
      await fetchData();
      setSubmitting?.(false);
      showToast?.(`Status toggled to ${newStatus ? 'Active' : 'Inactive'}`);
    } catch (err) {
      setError(err.message || 'Toggle failed');
      showToast?.(err.message || 'Toggle failed');
    } finally {
      setSubmitting?.(false);
    }
  }, [data, updateFn, fetchData, showToast, setSubmitting]);

  const [summary, setSummary] = useState(null);
  const loadSummary = useCallback(async () => {
    if (getSummaryFn) {
      setLoading(true);
      try {
        const result = await getSummaryFn();
        setSummary(result);
      } catch (err) {
        setError(err.message || 'Failed to load summary');
      } finally {
        setLoading(false);
      }
    }
  }, [getSummaryFn]);

  return {
    data,
    loading,
    error,
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