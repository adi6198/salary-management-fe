
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-emoji">💼</span>
        <span className="logo-text">SalaryHub</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/employees" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={20} className="nav-icon" />
          <span>Employees</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.fullName}</span>
            <span className="user-role">HR Manager</span>
          </div>
        </div>
        <button className="logout-btn" onClick={logout} title="Logout">
          <LogOut size={18} className="logout-icon" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
