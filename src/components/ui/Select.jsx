import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import '../../styles/components.css';

const Select = forwardRef(({ label, options, error, required = false, className = '', ...props }, ref) => {
  const id = props.id || props.name;

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="label-required"> *</span>}
        </label>
      )}
      <div className="select-wrapper">
        <select
          ref={ref}
          id={id}
          className={`input-field select-field ${error ? 'input-error' : ''}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="select-icon" size={18} />
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
