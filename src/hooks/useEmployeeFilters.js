import { useState, useCallback } from 'react';

export const useEmployeeFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'true', // 'true' for active, 'false' for inactive, '' for all
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
      status: 'true',
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
