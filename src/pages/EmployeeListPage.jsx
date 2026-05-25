import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Edit2, Eye } from 'lucide-react';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { getEmployees, exportEmployeesCSV } from '../api/employees.api';
import { getDepartments } from '../api/departments.api';
import { getJobTitles } from '../api/jobTitles.api';
import { useFetch } from '../hooks/useFetch';
import { usePagination } from '../hooks/usePagination';
import { useEmployeeFilters } from '../hooks/useEmployeeFilters';
import { formatCurrency } from '../utils/formatCurrency';
import { downloadCSV } from '../utils/csvDownload';
import Button from '../components/ui/Button';
import DataTable from '../components/data/DataTable';
import Pagination from '../components/ui/Pagination';
import EmployeeFilters from '../components/employee/EmployeeFilters';
import { GENDER_LABELS, EMPLOYMENT_TYPE_LABELS } from '../utils/constants';
import { useToast } from '../hooks/useToast';
import '../styles/employee-list.css';

countries.registerLocale(enLocale);

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isExporting, setIsExporting] = useState(false);

  const { page, limit, setPage, setLimit } = usePagination(1, 10);
  const { filters, handleFilterChange, resetFilters } = useEmployeeFilters();

  const queryParams = useMemo(() => {
    let apiSortColumn = sortColumn;
    if (sortColumn === 'employeeCode') apiSortColumn = 'employee_code';
    else if (sortColumn === 'salaryUsd') apiSortColumn = 'salary_usd';
    else if (sortColumn === 'isActive') apiSortColumn = 'is_active';
    else if (sortColumn === 'createdAt') apiSortColumn = 'created_at';

    return {
      page,
      limit,
      sort: apiSortColumn,
      order: sortDirection,
      ...filters
    };
  }, [page, limit, sortColumn, sortDirection, filters]);

  const { data: employeesData, meta: employeesDataMeta, loading: employeesLoading } = useFetch(
    useCallback(() => getEmployees(queryParams), [queryParams]),
    true
  );

  const { data: departmentsData } = useFetch(getDepartments, true);
  const { data: jobTitlesData } = useFetch(getJobTitles, true);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await exportEmployeesCSV(queryParams);
      // Wait for Blob to be returned
      const blob = response.data || response;
      downloadCSV(blob, `employees_export_${new Date().getTime()}.csv`);
      showToast('success', 'Export completed successfully');
    } catch {
      showToast('error', 'Failed to export employees');
    } finally {
      setIsExporting(false);
    }
  };

  const columns = [
    {
      key: 'employeeCode',
      header: 'Code',
      sortable: true,
      width: '100px'
    },
    {
      key: 'name',
      header: 'Employee',
      sortable: true,
      render: (_, row) => (
        <div className="employee-cell">
          <div className="employee-info">
            <span className="employee-name">{row.isActive ? '🟢' : '🔴'}{row.fullName}</span>
            <span className="employee-email">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'department',
      header: 'Department',
      sortable: false,
      render: (_, row) => row.department?.name || '-'
    },
    {
      key: 'location',
      header: 'Location',
      sortable: false,
      render: (_, row) => {
        const countryName = row.country ? (countries.getName(row.country, 'en') || row.country) : '-';
        return row.city ? `${row.city}, ${row.state}, ${countryName}` : '-';
      }
    },
    {
      key: 'gender',
      header: 'Gender',
      sortable: false,
      render: (_, row) => GENDER_LABELS[row.gender]
    },
    {
      key: 'employmentType',
      header: 'Emp. Type',
      sortable: false,
      render: (_, row) => EMPLOYMENT_TYPE_LABELS[row.employmentType] || '-'
    },
    {
      key: 'jobTitle',
      header: 'Job Title',
      sortable: false,
      render: (_, row) => row.jobTitle?.name || '-'
    },
    {
      key: 'salaryUsd',
      header: 'Salary (USD)',
      sortable: true,
      align: 'right',
      render: (value) => formatCurrency(value, 'USD')
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      pinned: 'right',
      width: '120px',
      render: (_, row) => (
        <div className="action-buttons justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/employees/${row.id}`)}
            className="action-btn"
            title="View Details"
          >
            <Eye size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/employees/${row.id}/edit`)}
            className="action-btn"
            title="Edit Employee"
          >
            <Edit2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const items = employeesData && employeesData.length ? employeesData : [];
  const meta = employeesDataMeta || { total: 0, totalPages: 0 };
  const departments = departmentsData?.data || departmentsData || [];
  const jobTitles = jobTitlesData?.data || jobTitlesData || [];

  return (
    <div className="page-container employee-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-description">Manage your company's workforce and salary information</p>
        </div>
        <div className="page-actions">
          <Button 
            variant="primary" 
            onClick={() => navigate('/employees/add')}
          >
            <Plus size={18} className="mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <EmployeeFilters 
        filters={filters}
        onFilterChange={(k, v) => {
          handleFilterChange(k, v);
          setPage(1);
        }}
        onReset={() => {
          resetFilters();
          setPage(1);
        }}
        departments={departments}
        jobTitles={jobTitles}
      />

      <DataTable 
        columns={columns}
        data={items}
        isLoading={employeesLoading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyStateTitle="No employees found"
        emptyStateDesc="Try adjusting your filters or search term."
      />

      <Pagination 
        currentPage={page}
        totalPages={meta.totalPages}
        onPageChange={setPage}
        totalItems={meta.total}
        limit={limit}
        onLimitChange={setLimit}
      />
    </div>
  );
};

export default EmployeeListPage;
