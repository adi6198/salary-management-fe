import { createContext, useState, useCallback } from 'react';
import ToastContainer from '../components/ui/ToastContainer';

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => {
      // Limit to max 3 toasts
      const nextToasts = [...prevToasts, { id, type, message }];
      if (nextToasts.length > 3) {
        nextToasts.shift();
      }
      return nextToasts;
    });

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
