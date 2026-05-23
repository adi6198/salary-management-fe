import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmployee } from '../api/employees.api';
import { getDepartments } from '../api/departments.api';
import { getJobTitles } from '../api/jobTitles.api';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import Breadcrumb from '../components/ui/Breadcrumb';
import EmployeeForm from '../components/employee/EmployeeForm';
import Spinner from '../components/ui/Spinner';

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: departmentsResponse, loading: depsLoading } = useFetch(getDepartments);
  const { data: jobTitlesResponse, loading: titlesLoading } = useFetch(getJobTitles);

  const breadcrumbs = [
    { label: 'Employees', path: '/employees' },
    { label: 'Add Employee', path: '/employees/add' }
  ];

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await createEmployee(data);
      console.log('response', response);
      if (response.success || response.data) {
        showToast('success', 'Employee created successfully.');
        navigate('/employees');
      } else {
        showToast('error', 'Failed to create employee. Please try again.');
      }
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to create employee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (depsLoading || titlesLoading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  const departments = departmentsResponse?.data || departmentsResponse || [];
  const jobTitles = jobTitlesResponse?.data || jobTitlesResponse || [];

  return (
    <div className="page-container">
      <Breadcrumb items={breadcrumbs} />
      
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Employee</h1>
          <p className="page-description">Create a new employee profile in the system</p>
        </div>
      </div>

      <EmployeeForm
        mode="create"
        departments={departments}
        jobTitles={jobTitles}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddEmployeePage;
