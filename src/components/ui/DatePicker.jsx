import { forwardRef } from 'react';
import '../../styles/components.css';

const DatePicker = forwardRef(({ label, error, className = '', ...props }, ref) => {
  const id = props.id || props.name;

  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {props.required && <span className="label-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <input
          ref={ref}
          type="date"
          id={id}
          className={`input-field ${error ? 'input-error' : ''}`}
          {...props}
        />
        {/* We can hide default calendar icon in css and use custom one, but standard date picker works best cross-browser */}
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
