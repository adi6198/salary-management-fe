import { Search, RotateCcw } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useDebounce } from '../../hooks/useDebounce';
import { useState, useEffect } from 'react';
import '../../styles/employee-list.css';

const EmployeeFilters = ({
  filters,
  onFilterChange,
  onReset,
  departments,
  jobTitles,
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const debouncedSearch = useDebounce(localSearch, 500);

  // Sync debounced search with parent filters
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange('search', debouncedSearch);
    }
  }, [debouncedSearch, filters.search, onFilterChange]);

  // Sync prop changes back to local (e.g. on reset)
  useEffect(() => {
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ];

  const departmentOptions = [
    { label: 'All Departments', value: '' },
    ...departments.map(d => ({ label: d.name, value: d.id }))
  ];

  // Filter job titles based on selected department
  const filteredJobTitles = filters.departmentId 
    ? jobTitles.filter(jt => jt.departmentId === filters.departmentId)
    : jobTitles;

  const jobTitleOptions = [
    { label: 'All Job Titles', value: '' },
    ...filteredJobTitles.map(jt => ({ label: jt.title, value: jt.id }))
  ];

  return (
    <div className="filters-container">
      <div className="filters-grid">
        <div className="filter-item">
          <Input
            placeholder="Search by name, email, code..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            icon={Search}
          />
        </div>
        
        <div className="filter-item">
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          />
        </div>

        <div className="filter-item">
          <Select
            options={departmentOptions}
            value={filters.departmentId}
            onChange={(e) => {
              onFilterChange('departmentId', e.target.value);
              // Reset job title when department changes
              onFilterChange('jobTitleId', '');
            }}
          />
        </div>

        <div className="filter-item">
          <Select
            options={jobTitleOptions}
            value={filters.jobTitleId}
            onChange={(e) => onFilterChange('jobTitleId', e.target.value)}
            disabled={filters.departmentId && filteredJobTitles.length === 0}
          />
        </div>

        <div className="filter-actions">
          <Button 
            variant="ghost" 
            onClick={onReset}
            className="reset-filters-btn"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFilters;
