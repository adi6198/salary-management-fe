
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../styles/sidebar.css';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
