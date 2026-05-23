import { Search, RotateCcw } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useDebounce } from '../../hooks/useDebounce';
import { useState, useEffect } from 'react';
import countries from 'i18n-iso-countries';
import english from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(english);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ];

  const genderOptions = [
    { label: 'All Genders', value: '' },
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' },
    { label: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY' },
  ];

  const employmentTypeOptions = [
    { label: 'All Types', value: '' },
    { label: 'Full Time', value: 'FULL_TIME' },
    { label: 'Part Time', value: 'PART_TIME' },
    { label: 'Contractor', value: 'CONTRACTOR' },
    { label: 'Intern', value: 'INTERN' },
  ];

  const departmentOptions = [
    { label: 'All Departments', value: '' },
    ...departments.map(d => ({ label: d.name, value: d.id }))
  ];

  const jobTitleOptions = [
    { label: 'All Job Titles', value: '' },
    ...jobTitles.map(jt => ({ label: jt.name, value: jt.id }))
  ];

  // Country options dynamically generated
  const countryCodes = Object.keys(countries.getNames('en') || {});
  const countryOptions = [
    { label: 'All Countries', value: '' },
    ...countryCodes.map(code => ({ label: countries.getName(code, 'en'), value: countries.getName(code, 'en') }))
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
            value={filters.is_active || 'all'}
            onChange={(e) => onFilterChange('is_active', e.target.value)}
          />
        </div>

        <div className="filter-item">
          <Select
            options={departmentOptions}
            value={filters.departmentId || ''}
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
            value={filters.jobTitleId || ''}
            onChange={(e) => onFilterChange('jobTitleId', e.target.value)}
          />
        </div>

        <div className="filter-item">
          <Select
            options={countryOptions}
            value={filters.country || ''}
            onChange={(e) => onFilterChange('country', e.target.value)}
          />
        </div>

        <div className="filter-item">
          <Select
            options={genderOptions}
            value={filters.gender || ''}
            onChange={(e) => onFilterChange('gender', e.target.value)}
          />
        </div>

        <div className="filter-item">
          <Select
            options={employmentTypeOptions}
            value={filters.employment_type || ''}
            onChange={(e) => onFilterChange('employment_type', e.target.value)}
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
