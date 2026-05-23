import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import DatePicker from '../ui/DatePicker';
import { validators } from '../../utils/validators';

const DeactivationModal = ({ isOpen, onClose, onConfirm, employeeName, employeeCode }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      reason: '',
      notes: '',
      deactivatedOn: new Date().toISOString().split('T')[0]
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        deactivationReason: data.reason,
        changeReason: data.notes || `Employee deactivated due to: ${data.reason}`,
        deactivatedOn: data.deactivatedOn
      };
      await onConfirm(payload);
      handleClose();
    } catch (err) {
      // Error is handled and toasted by parent, we just keep the modal open
    } finally {
      setIsSubmitting(false);
    }
  };

  const deactivationReasons = [
    { label: 'Select reason...', value: '' },
    { label: 'Resigned', value: 'RESIGNED' },
    { label: 'Terminated', value: 'TERMINATED' },
    { label: 'End of Contract', value: 'END_OF_CONTRACT' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)' }}>
          <AlertTriangle size={24} />
          <span>Deactivate Employee</span>
        </div>
      }
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleSubmit(onSubmit)} 
            isLoading={isSubmitting}
          >
            Confirm Deactivation
          </Button>
        </>
      }
    >
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          You are about to deactivate <strong>{employeeName}</strong> ({employeeCode}).
          This will revoke their access and mark their profile as inactive.
        </p>
      </div>

      <form id="deactivation-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Select
          label="Reason for Deactivation"
          required
          options={deactivationReasons}
          error={errors.reason?.message}
          {...register('reason', { required: validators.required })}
        />

        <DatePicker
          label="Deactivated On"
          required
          error={errors.deactivatedOn?.message}
          {...register('deactivatedOn', { required: validators.required })}
          style={{ marginTop: '16px' }}
        />

        <Textarea
          label="Additional Notes (Optional)"
          placeholder="Provide any additional context..."
          {...register('notes')}
          style={{ marginTop: '16px' }}
        />
      </form>
    </Modal>
  );
};

export default DeactivationModal;
