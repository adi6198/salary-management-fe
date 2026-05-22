import '../../styles/components.css';

const Skeleton = ({ width, height, rounded = 'md', className = '' }) => {
  return (
    <div 
      className={`skeleton rounded-${rounded} ${className}`}
      style={{ width, height }}
    />
  );
};

export default Skeleton;
