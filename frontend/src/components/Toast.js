import React, { useEffect } from 'react';
import './Toast.css';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'loading', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (type !== 'loading' && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [type, onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'loading':
        return <Loader2 size={18} className="toast-icon-spin" />;
      case 'success':
        return <CheckCircle size={18} className="toast-icon-success" />;
      case 'error':
        return <XCircle size={18} className="toast-icon-error" />;
      default:
        return null;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      {getIcon()}
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;
