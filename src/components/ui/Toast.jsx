
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import '../../styles/components.css';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const Toast = ({ id, type = 'info', message, onClose }) => {
  const Icon = icons[type] || Info;

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="polite">
      <div className="toast-icon">
        <Icon size={18} />
      </div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button 
        type="button" 
        className="toast-close" 
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
