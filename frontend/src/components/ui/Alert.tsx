'use client';

import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onClose?: () => void;
  className?: string;
}

export default function Alert({
  children,
  variant = 'info',
  title,
  onClose,
  className = '',
}: AlertProps) {
  const variants = {
    info: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-800',
      icon: <Info className="w-5 h-5 text-teal-500" />,
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
  };

  const { bg, border, text, icon } = variants[variant];

  return (
    <div
      className={`${bg} ${border} ${text} border rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3 flex-1">
          {title && <h3 className="font-medium">{title}</h3>}
          <div className={title ? 'mt-1 text-sm' : 'text-sm'}>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4 inline-flex text-current hover:opacity-75"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
