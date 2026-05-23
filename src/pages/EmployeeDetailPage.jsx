import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, UserMinus, UserX, UserCheck } from 'lucide-react';
import countries from 'i18n-iso-countries';
import { getEmployee, deactivateEmployee, updateEmployee } from '../api/employees.api';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import DeactivationModal from '../components/employee/DeactivationModal';
import ActivationModal from '../components/employee/ActivationModal';
import AuditHistoryTab from '../components/employee/AuditHistoryTab';
import '../styles/employee-detail.css';

const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value || '-'}</span>
  </div>
);

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

  const { data: employeeData, loading, error, execute: refetch } = useFetch(
    useCallback(() => getEmployee(id), [id])
  );

  const employee = employeeData?.data || employeeData;

  const handleDeactivate = async (data) => {
    try {
      await deactivateEmployee(id, data);
      showToast('success', 'Employee deactivated successfully.');
      refetch(); // Refresh data to show inactive status
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to deactivate employee.');
      throw err;
    }
  };

  const handleActivate = async (data) => {
    try {
      // The update API is used here. We need to import updateEmployee
      // Wait, is there updateEmployee in employees.api.js?
      // I'll assume there is and import it at the top, but let's check it in the next step.
      await updateEmployee(id, data);
      showToast('success', 'Employee activated successfully.');
      refetch();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to activate employee.');
      throw err;
    }
  };

  if (loading) {
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
          description="The employee you are looking for does not exist or has been removed."
        />
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Employees', path: '/employees' },
    { label: `${employee.firstName} ${employee.lastName}`, path: `/employees/${id}` }
  ];

  const countryName = employee.country ? countries.getName(employee.country, 'en') : '-';

  const formatEmploymentType = (type) => {
    if (!type) return '-';
    return type.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  const detailsTabContent = (
    <div className="details-grid">
      <div className="details-column">
        <Card className="detail-card">
          <h3 className="detail-card-title">Personal Information</h3>
          <div className="detail-card-content">
            <DetailItem label="First Name" value={employee.firstName} />
            <DetailItem label="Last Name" value={employee.lastName} />
            <DetailItem label="Email" value={employee.email} />
            <DetailItem label="Phone" value={employee.phone} />
            <DetailItem label="Gender" value={formatEmploymentType(employee.gender)} />
            <DetailItem label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
          </div>
        </Card>

        <Card className="detail-card">
          <h3 className="detail-card-title">Employment Details</h3>
          <div className="detail-card-content">
            <DetailItem label="Hire Date" value={formatDate(employee.hireDate)} />
            <DetailItem label="Department" value={employee.department?.name} />
            <DetailItem label="Job Title" value={employee.jobTitle?.name} />
            <DetailItem label="Employment Type" value={formatEmploymentType(employee.employmentType)} />
            <DetailItem label="Location" value={`${employee.city}, ${countryName}`} />
          </div>
        </Card>
      </div>

      <div className="details-column">
        <Card className="detail-card">
          <h3 className="detail-card-title">Compensation</h3>
          <div className="detail-card-content">
            <DetailItem label="Local Salary" value={formatCurrency(employee.salaryLocal, employee.country === 'GB' ? 'GBP' : employee.country === 'DE' ? 'EUR' : employee.country === 'IN' ? 'INR' : employee.country === 'JP' ? 'JPY' : 'USD')} />
            <DetailItem label="USD Equivalent" value={formatCurrency(employee.salaryUsd, 'USD')} />
          </div>
        </Card>

        {!employee.isActive && (
          <Card className="detail-card inactive-card">
            <h3 className="detail-card-title text-danger">Deactivation Details</h3>
            <div className="detail-card-content">
              <DetailItem label="Deactivated On" value={formatDate(employee.deactivatedOn)} />
              <DetailItem label="Reason" value={formatEmploymentType(employee.deactivationReason)} />
            </div>
          </Card>
        )}
      </div>
    </div>
  );

  const auditTabContent = <AuditHistoryTab employeeId={id} />;

  return (
    <div className="page-container">
      <Breadcrumb items={breadcrumbs} />

      <div className="detail-header">
        <div className="detail-header-left">
          <div className="detail-avatar-large">
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </div>
          <div>
            <div className="detail-title-row">
              <h1 className="detail-name">{employee.firstName} {employee.lastName}</h1>
              <Badge variant={employee.isActive ? 'success' : 'danger'}>
                {employee.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="detail-subtitle">
              <span className="font-mono text-muted">{employee.employeeCode}</span>
              <span className="separator">•</span>
              <span>{employee.jobTitle?.name || 'No Title'}</span>
              <span className="separator">•</span>
              <span>{employee.department?.name || 'No Department'}</span>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          {employee.isActive ? (
            <Button 
              variant="danger-outline" 
              onClick={() => setIsDeactivateModalOpen(true)}
            >
              <UserMinus size={16} />
              Deactivate
            </Button>
          ) : (
            <Button 
              variant="success-outline" 
              onClick={() => setIsActivateModalOpen(true)}
            >
              <UserCheck size={16} />
              Activate
            </Button>
          )}
          <Button 
            variant="primary" 
            onClick={() => navigate(`/employees/${id}/edit`)}
          >
            <Edit2 size={16} />
            Edit Profile
          </Button>
        </div>
      </div>

      <Tabs 
        tabs={[
          { label: 'Employee Details', content: detailsTabContent },
          { label: 'Audit History', content: auditTabContent }
        ]} 
      />

      {employee.isActive && (
        <DeactivationModal
          isOpen={isDeactivateModalOpen}
          onClose={() => setIsDeactivateModalOpen(false)}
          onConfirm={handleDeactivate}
          employeeName={`${employee.firstName} ${employee.lastName}`}
          employeeCode={employee.employeeCode}
        />
      )}

      {!employee.isActive && (
        <ActivationModal
          isOpen={isActivateModalOpen}
          onClose={() => setIsActivateModalOpen(false)}
          onConfirm={handleActivate}
          employeeName={`${employee.firstName} ${employee.lastName}`}
          employeeCode={employee.employeeCode}
        />
      )}
    </div>
  );
};

export default EmployeeDetailPage;
