'use client';

import { forwardRef, InputHTMLAttributes, type ReactNode } from 'react';



interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'default' | 'glass' | 'glass-light';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;

    const variants = {
      default: `
        bg-white border-2 border-gray-200
        focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10
        hover:border-gray-300
      `,
      glass: `
        bg-white/20 backdrop-blur-xl border border-white/30
        text-white placeholder:text-white/60
        focus:bg-white/30 focus:border-white/50
        focus:shadow-[0_0_20px_rgba(46,108,253,0.3)]
      `,
      'glass-light': `
        bg-white/90 backdrop-blur-xl border-2 border-teal-500/10
        focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10
        hover:border-teal-500/30
      `,
    };

    return (
      <div className="w-full">

        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-semibold mb-2 ${
              variant === 'glass' ? 'text-white/90' : 'text-gray-700'
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
              variant === 'glass' 
                ? 'text-white/60 group-focus-within:text-white' 
                : 'text-gray-400 group-focus-within:text-teal-500'
            }`}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              block w-full rounded-2xl
              transition-all duration-300 ease-out
              ${leftIcon ? 'pl-12' : 'pl-4'}
              ${rightIcon ? 'pr-12' : 'pr-4'}
              py-3.5
              ${variants[variant]}
              ${error && variant === 'default' ? '!border-red-300 focus:!border-red-500 focus:!ring-red-500/10' : ''}
              focus:outline-none
              ${variant === 'glass' ? '' : 'placeholder:text-gray-400'}
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${className}
            `}
            aria-invalid={!!error}
            {...props}
          />
          {rightIcon && (
            <div className={`absolute inset-y-0 right-0 pr-4 flex items-center ${
              variant === 'glass' ? 'text-white/60' : 'text-gray-400'
            }`}>
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className={`mt-2 text-sm ${variant === 'glass' ? 'text-white/70' : 'text-gray-500'}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
