
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      padding: 'var(--space-6)',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '80px',
        fontWeight: '800',
        background: 'var(--accent-gradient)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 'var(--space-2)'
      }}>404</h1>
      
      <h2 style={{
        fontSize: 'var(--text-h1)',
        color: 'var(--text-primary)',
        marginBottom: 'var(--space-2)'
      }}>Page Not Found</h2>
      
      <p style={{
        color: 'var(--text-secondary)',
        marginBottom: 'var(--space-6)',
        maxWidth: '400px',
        fontSize: 'var(--text-body)'
      }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Button variant="primary" onClick={() => navigate('/employees')}>
        Go to Employees
      </Button>
    </div>
  );
};

export default NotFoundPage;
