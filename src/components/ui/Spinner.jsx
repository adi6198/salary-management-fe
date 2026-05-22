
import '../../styles/components.css';

const Spinner = ({ size = 'md', color = 'primary' }) => {
  return (
    <div 
      className={`spinner spinner-size-${size} spinner-color-${color}`} 
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
