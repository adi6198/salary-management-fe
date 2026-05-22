import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Edit2, Eye } from 'lucide-react';
import { getEmployees, exportEmployeesCSV } from '../api/employees.api';
import { getDepartments } from '../api/departments.api';
import { getJobTitles } from '../api/jobTitles.api';
import { useFetch } from '../hooks/useFetch';
import { usePagination } from '../hooks/usePagination';
import { useEmployeeFilters } from '../hooks/useEmployeeFilters';
import { formatCurrency } from '../utils/formatCurrency';
import { downloadCSV } from '../utils/csvDownload';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import DataTable from '../components/data/DataTable';
import Pagination from '../components/ui/Pagination';
import EmployeeFilters from '../components/employee/EmployeeFilters';
import { useToast } from '../hooks/useToast';
import '../styles/employee-list.css';

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isExporting, setIsExporting] = useState(false);

  const { page, limit, setPage, setLimit } = usePagination(1, 10);
  const { filters, handleFilterChange, resetFilters } = useEmployeeFilters();

  const queryParams = useMemo(() => ({
    page,
    limit,
    sort: sortColumn,
    order: sortDirection,
    ...filters
  }), [page, limit, sortColumn, sortDirection, filters]);

  const { data: employeesData, loading: employeesLoading } = useFetch(
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
    } catch (error) {
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
          <div className="employee-avatar">
            {row.firstName.charAt(0)}{row.lastName.charAt(0)}
          </div>
          <div className="employee-info">
            <span className="employee-name">{row.firstName} {row.lastName}</span>
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
      key: 'jobTitle',
      header: 'Job Title',
      sortable: false,
      render: (_, row) => row.jobTitle?.title || '-'
    },
    {
      key: 'salaryUsd',
      header: 'Salary (USD)',
      sortable: true,
      align: 'right',
      render: (value) => formatCurrency(value, 'USD')
    },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      render: (isActive) => (
        <Badge variant={isActive ? 'success' : 'danger'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
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

  const items = employeesData?.data?.items || employeesData?.items || [];
  const meta = employeesData?.data?.meta || employeesData?.meta || { total: 0, totalPages: 0 };
  const departments = departmentsData?.data || departmentsData || [];
  const jobTitles = jobTitlesData?.data || jobTitlesData || [];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-description">Manage your company's workforce and salary information</p>
        </div>
        <div className="page-actions">
          <Button 
            variant="outline" 
            onClick={handleExport}
            isLoading={isExporting}
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </Button>
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
