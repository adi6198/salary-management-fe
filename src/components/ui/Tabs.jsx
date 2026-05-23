import { useState } from 'react';
import '../../styles/components.css';

const Tabs = ({ tabs, defaultActive = 0, onTabChange }) => {
  const [activeIndex, setActiveIndex] = useState(defaultActive);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <div className="tabs-container">
      <div className="tabs-header" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
            className={`tab-btn ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="tabs-content">
        {tabs.map((tab, index) => (
          <div
            key={index}
            role="tabpanel"
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            hidden={activeIndex !== index}
            className="tab-panel"
          >
            {activeIndex === index && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
