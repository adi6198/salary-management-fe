import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import '../styles/login.css';

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Check if redirect has expired param
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      showToast('error', 'Your session has expired. Please log in again.');
    }
  }, [searchParams, showToast]);

  const onSubmit = async (data) => {
    setApiError(null);
    setIsSubmitting(true);

    const result = await login(data.email, data.password);
    
    if (result.success) {
      showToast('success', 'Logged in successfully.');
      navigate('/employees');
    } else {
      setApiError(result.error);
      showToast('error', result.error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="login-container">
      {/* CSS-only geometric background shapes */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      
      <div className="login-card-wrapper">
        <div className="login-logo-section">
          <span className="login-logo-icon">💼</span>
          <h1 className="login-logo-text">SalaryHub</h1>
        </div>

        <div className="login-card">
          <h2 className="login-card-title">Welcome Back</h2>
          <p className="login-card-subtitle">Sign in to manage salaries and employees</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@company.com"
              icon={Mail}
              required
              error={errors.email?.message}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            {apiError && <div className="login-api-error" role="alert">{apiError}</div>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="login-submit-btn"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>
        </div>

        <footer className="login-footer">
          Salary Management System v1.0
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
