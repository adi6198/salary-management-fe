import { Inbox } from 'lucide-react';
import '../../styles/components.css';

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = 'No Data Available', 
  description = 'There is nothing to display here right now.',
  action = null
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

export default EmptyState;
