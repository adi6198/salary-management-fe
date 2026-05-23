import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserCheck } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';

const ActivationModal = ({ isOpen, onClose, onConfirm, employeeName, employeeCode }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {
      notes: ''
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
        isActive: true,
        changeReason: data.notes || 'Employee reactivated'
      };
      await onConfirm(payload);
      handleClose();
    } catch (err) {
      // Error is handled and toasted by parent, we just keep the modal open
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
          <UserCheck size={24} />
          <span>Activate Employee</span>
        </div>
      }
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleSubmit(onSubmit)} 
            isLoading={isSubmitting}
          >
            Confirm Activation
          </Button>
        </>
      }
    >
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          You are about to activate <strong>{employeeName}</strong> ({employeeCode}).
          This will restore their access and mark their profile as active again.
        </p>
      </div>

      <form id="activation-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Textarea
          label="Reason for Reactivation (Optional)"
          placeholder="Provide any additional context..."
          {...register('notes')}
          style={{ marginTop: '16px' }}
        />
      </form>
    </Modal>
  );
};

export default ActivationModal;
