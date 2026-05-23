import { forwardRef } from 'react';
import '../../styles/components.css';

const Textarea = forwardRef(({ label, error, className = '', rows = 3, ...props }, ref) => {
  const id = props.id || props.name;

  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {props.required && <span className="label-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={`input-field ${error ? 'input-error' : ''}`}
          style={{ height: 'auto', minHeight: '80px', padding: '12px' }}
          {...props}
        />
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
