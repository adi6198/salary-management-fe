import { Info } from 'lucide-react';
import '../../styles/components.css';

const InfoBanner = ({ message, className = '' }) => {
  return (
    <div className={`info-banner ${className}`}>
      <Info size={18} className="info-banner-icon" />
      <span className="info-banner-text">{message}</span>
    </div>
  );
};

export default InfoBanner;
