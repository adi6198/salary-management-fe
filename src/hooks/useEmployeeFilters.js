import { useState, useCallback } from 'react';

export const useEmployeeFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    search: '',
    is_active: 'all', // 'true' for active, 'false' for inactive, '' for all
    departmentId: '',
    jobTitleId: '',
    ...initialFilters
  });

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      is_active: 'all',
      departmentId: '',
      jobTitleId: '',
      ...initialFilters
    });
  }, [initialFilters]);

  return {
    filters,
    handleFilterChange,
    resetFilters
  };
};
