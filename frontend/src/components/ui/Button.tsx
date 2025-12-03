'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-semibold rounded-xl
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-[0.98]
    `;

    const variants = {
      primary: `
        bg-gradient-to-r from-blue-600 to-blue-700 text-white
        hover:from-blue-700 hover:to-blue-800 
        hover:shadow-lg hover:shadow-blue-500/25
        focus:ring-blue-500
      `,
      secondary: `
        bg-gray-100 text-gray-900
        hover:bg-gray-200
        focus:ring-gray-500
      `,
      outline: `
        border-2 border-gray-200 text-gray-700 bg-white
        hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50
        focus:ring-blue-500
      `,
      ghost: `
        text-gray-600 bg-transparent
        hover:bg-gray-100 hover:text-gray-900
        focus:ring-gray-500
      `,
      danger: `
        bg-gradient-to-r from-red-600 to-red-700 text-white
        hover:from-red-700 hover:to-red-800
        hover:shadow-lg hover:shadow-red-500/25
        focus:ring-red-500
      `,
      gradient: `
        bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white
        hover:from-blue-700 hover:via-purple-700 hover:to-pink-700
        hover:shadow-lg hover:shadow-purple-500/25
        focus:ring-purple-500
      `,
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
      xl: 'px-8 py-4 text-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
