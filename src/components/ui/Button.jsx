
import Spinner from './Spinner';
import '../../styles/components.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, danger, danger-outline, ghost
  size = 'md',        // sm, md, lg
  isLoading = false,
  isDisabled = false,
  onClick,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const isDisabledOrLoading = isDisabled || isLoading;

  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-size-${size} ${className}`}
      disabled={isDisabledOrLoading}
      onClick={onClick}
      aria-busy={isLoading}
      aria-disabled={isDisabledOrLoading}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" color={variant === 'primary' ? 'inverse' : 'primary'} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="btn-icon btn-icon-left" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
          <span className="btn-text">{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="btn-icon btn-icon-right" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
        </>
      )}
    </button>
  );
};

export default Button;
