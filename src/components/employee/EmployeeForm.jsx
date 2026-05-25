import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import countryToCurrency from 'country-to-currency';
import { validators } from '../../utils/validators';
import Input from '../ui/Input';
import Select from '../ui/Select';
import DatePicker from '../ui/DatePicker';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Textarea from '../ui/Textarea';
import InfoBanner from '../ui/InfoBanner';
import '../../styles/employee-form.css';

countries.registerLocale(enLocale);

const EmployeeForm = ({ 
  mode = 'create', 
  initialData = {}, 
  departments = [], 
  jobTitles = [], 
  onSubmit, 
  isSubmitting 
}) => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isDirty, dirtyFields },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      hireDate: '',
      departmentId: '',
      jobTitleId: '',
      country: '',
      state: '',
      city: '',
      employmentType: '',
      salaryLocal: '',
      currency: '',
      salaryUsd: '',
      changeReason: '',
      ...initialData
    }
  });

  // Re-initialize form if initialData changes (e.g. data loaded after mount)
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      // If backend returns a full country name, attempt to map it to its alpha-2 code
      const mappedCountry = countries.getAlpha2Code(initialData.country, 'en') || initialData.country;
      
      reset({
        ...initialData,
        country: mappedCountry,
        dateOfBirth: initialData.dateOfBirth?.split('T')[0] || '',
        hireDate: initialData.hireDate?.split('T')[0] || '',
      });
    }
  }, [initialData, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedDepartmentId = watch('departmentId');
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedCountry = watch('country');

  // Auto-populate currency when country changes
  useEffect(() => {
    if (watchedCountry) {
      const curr = countryToCurrency[watchedCountry];
      if (curr) {
        setValue('currency', curr, { shouldDirty: true, shouldValidate: true });
      }
    } else {
      setValue('currency', '', { shouldDirty: true, shouldValidate: true });
    }
  }, [watchedCountry, setValue]);
  
  // Remove job titles filtering since JobTitle doesn't have departmentId in backend
  const availableJobTitles = jobTitles;

  const countryOptions = useMemo(() => {
    const list = countries.getNames('en', { select: 'official' });
    return Object.entries(list).map(([code, name]) => ({
      label: name,
      value: code
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const isEditMode = mode === 'edit';

  const getFieldClass = (fieldName) => {
    return isEditMode && dirtyFields[fieldName] ? 'field-changed' : '';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="employee-form" noValidate>
      {isEditMode && (
        <InfoBanner message="All changes made to the employee profile will be recorded in the audit trail." />
      )}

      <div className="form-sections">
        {/* PERSONAL INFORMATION */}
        <Card className="form-section-card">
          <h3 className="section-title">Personal Information</h3>
          
          <div className="form-grid">
            {isEditMode && initialData.employeeCode && (
              <div className="form-group full-width">
                <Input
                  label="Employee Code"
                  value={initialData.employeeCode}
                  disabled
                  className="font-mono"
                />
              </div>
            )}
            
            <div className="form-group full-width">
              <Input
                label="Full Name"
                required
                className={getFieldClass('fullName')}
                error={errors.fullName?.message}
                {...register('fullName', { required: validators.required })}
              />
            </div>

            <div className="form-group">
              <Input
                label="Email Address"
                type="email"
                required
                disabled={isEditMode}
                className={getFieldClass('email')}
                error={errors.email?.message}
                {...register('email', { 
                  required: validators.required,
                  pattern: validators.email
                })}
              />
            </div>

            <div className="form-group">
              <Input
                label="Phone Number"
                className={getFieldClass('phone')}
                error={errors.phone?.message}
                {...register('phone', { pattern: validators.phone })}
              />
            </div>

            <div className="form-group">
              <Select
                label="Gender"
                required
                className={getFieldClass('gender')}
                error={errors.gender?.message}
                {...register('gender', { required: validators.required })}
                options={[
                  { label: 'Select gender', value: '' },
                  { label: 'Male', value: 'MALE' },
                  { label: 'Female', value: 'FEMALE' },
                  { label: 'Other', value: 'OTHER' },
                  { label: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY' }
                ]}
              />
            </div>

            <div className="form-group">
              <DatePicker
                label="Date of Birth"
                required
                className={getFieldClass('dateOfBirth')}
                error={errors.dateOfBirth?.message}
                {...register('dateOfBirth', { required: validators.required })}
              />
            </div>
          </div>
        </Card>

        {/* EMPLOYMENT DETAILS */}
        <Card className="form-section-card">
          <h3 className="section-title">Employment Details</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <DatePicker
                label="Hire Date"
                required
                className={getFieldClass('hireDate')}
                error={errors.hireDate?.message}
                {...register('hireDate', { required: validators.required })}
              />
            </div>

            <div className="form-group">
              <Select
                label="Employment Type"
                required
                className={getFieldClass('employmentType')}
                error={errors.employmentType?.message}
                {...register('employmentType', { required: validators.required })}
                options={[
                  { label: 'Select type', value: '' },
                  { label: 'Full Time', value: 'FULL_TIME' },
                  { label: 'Part Time', value: 'PART_TIME' },
                  { label: 'Contract', value: 'CONTRACT' }
                ]}
              />
            </div>

            <div className="form-group">
              <Select
                label="Department"
                required
                className={getFieldClass('departmentId')}
                error={errors.departmentId?.message}
                {...register('departmentId', { 
                  required: validators.required,
                  onChange: () => reset({ ...getValues(), jobTitleId: '' }) 
                })}
                options={[
                  { label: 'Select department', value: '' },
                  ...departments.map(d => ({ label: d.name, value: d.id }))
                ]}
              />
            </div>

            <div className="form-group">
              <Select
                label="Job Title"
                required
                className={getFieldClass('jobTitleId')}
                error={errors.jobTitleId?.message}
                {...register('jobTitleId', { required: validators.required })}
                options={[
                  { label: 'Select job title', value: '' },
                  ...availableJobTitles.map(jt => ({ label: jt.name, value: jt.id }))
                ]}
              />
            </div>

            <div className="form-group">
              <Select
                label="Country"
                required
                className={getFieldClass('country')}
                error={errors.country?.message}
                {...register('country', { required: validators.required })}
                options={[
                  { label: 'Select country', value: '' },
                  ...countryOptions
                ]}
              />
            </div>

            <div className="form-group">
              <Input
                label="State"
                required
                className={getFieldClass('state')}
                error={errors.state?.message}
                {...register('state', { required: validators.required })}
              />
            </div>

            <div className="form-group">
              <Input
                label="City"
                required
                className={getFieldClass('city')}
                error={errors.city?.message}
                {...register('city', { required: validators.required })}
              />
            </div>
          </div>
        </Card>

        {/* COMPENSATION */}
        <Card className="form-section-card">
          <h3 className="section-title">Compensation</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <Input
                label="Salary (Local Currency)"
                type="number"
                step="0.01"
                required
                className={getFieldClass('salaryLocal')}
                error={errors.salaryLocal?.message}
                {...register('salaryLocal', { 
                  required: validators.required,
                  pattern: validators.positiveNumber,
                  min: validators.salary.min
                })}
              />
            </div>

            <div className="form-group">
              <Input
                label="Currency"
                disabled
                className={getFieldClass('currency')}
                error={errors.currency?.message}
                {...register('currency')}
              />
            </div>

            <div className="form-group">
              <Input
                label="Salary (USD)"
                type="number"
                step="0.01"
                required
                className={getFieldClass('salaryUsd')}
                error={errors.salaryUsd?.message}
                {...register('salaryUsd', { 
                  required: validators.required,
                  pattern: validators.positiveNumber,
                  min: validators.salary.min
                })}
              />
            </div>
          </div>
        </Card>

        {/* EDIT REASON (ONLY IN EDIT MODE) */}
        {isEditMode && (
          <Card className="form-section-card reason-card">
            <h3 className="section-title">Change Reason</h3>
            <div className="form-group full-width">
              <Textarea
                label="Reason for updates"
                required
                placeholder="Please describe why these changes are being made..."
                error={errors.changeReason?.message}
                {...register('changeReason', { required: validators.required })}
              />
            </div>
          </Card>
        )}
      </div>

      <div className="form-actions">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          isLoading={isSubmitting}
          disabled={isEditMode && !isDirty}
        >
          {isEditMode ? 'Save Changes' : 'Create Employee'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
