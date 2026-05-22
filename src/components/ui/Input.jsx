import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../../styles/components.css';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  required = false,
  icon: Icon,
  placeholder,
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="label-required"> *</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {Icon && (
          <div className="input-icon-left">
            <Icon size={18} />
          </div>
        )}
        
        <input
          id={inputId}
          type={inputType}
          ref={ref}
          placeholder={placeholder}
          className={`input-field ${Icon ? 'has-icon-left' : ''} ${isPassword ? 'has-icon-right' : ''}`}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <span id={`${inputId}-error`} className="input-error-msg" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
