import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployee, updateEmployee } from '../api/employees.api';
import { getDepartments } from '../api/departments.api';
import { getJobTitles } from '../api/jobTitles.api';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import Breadcrumb from '../components/ui/Breadcrumb';
import EmployeeForm from '../components/employee/EmployeeForm';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { UserX } from 'lucide-react';

const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: employeeData, loading: employeeLoading, error } = useFetch(
    useCallback(() => getEmployee(id), [id])
  );
  
  const { data: departmentsResponse, loading: depsLoading } = useFetch(getDepartments);
  const { data: jobTitlesResponse, loading: titlesLoading } = useFetch(getJobTitles);

  const employee = employeeData?.data || employeeData;

  const breadcrumbs = [
    { label: 'Employees', path: '/employees' },
    { label: employee ? employee.fullName : 'Loading...', path: `/employees/${id}` },
    { label: 'Edit', path: `/employees/${id}/edit` }
  ];

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Strip fields that should not be sent on update
      const { employeeCode, email, ...updatePayload } = data;
      
      const response = await updateEmployee(id, updatePayload);
      if (response.success || response.data) {
        showToast('success', 'Employee updated successfully.');
        navigate(`/employees/${id}`);
      } else {
        showToast('error', 'Failed to update employee. Please try again.');
      }
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to update employee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = employeeLoading || depsLoading || titlesLoading;

  if (isLoading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="page-container">
        <EmptyState 
          icon={UserX} 
          title="Employee Not Found" 
          description="The employee you are trying to edit does not exist or has been removed."
        />
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
          <h1 className="page-title">Edit Employee</h1>
          <p className="page-description">Update profile information for {employee.fullName}</p>
        </div>
      </div>

      <EmployeeForm
        mode="edit"
        initialData={employee}
        departments={departments}
        jobTitles={jobTitles}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EditEmployeePage;
