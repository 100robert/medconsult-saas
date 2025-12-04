'use client';

import { HTMLAttributes, ReactNode } from 'react';

type GlassVariant = 'default' | 'light' | 'dark' | 'gradient';
type GlassSize = 'sm' | 'md' | 'lg' | 'xl';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: GlassVariant;
  size?: GlassSize;
  hover?: boolean;
  glow?: boolean;
  glowColor?: 'blue' | 'green' | 'purple';
  blur?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconBg?: string;
}

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  hover = true,
  glow = false,
  glowColor = 'blue',
  blur = 'md',
  icon,
  iconBg = 'bg-blue-600',
  ...props
}: GlassCardProps) {
  const variants = {
    default: `
      bg-white/15 
      border border-white/30
      shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
    `,
    light: `
      bg-white/85
      border border-white/50
      shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]
    `,
    dark: `
      bg-gray-900/80
      border border-white/10
      shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
      text-white
    `,
    gradient: `
      bg-white/15
      border border-white/30
      shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
    `,
  };

  const sizes = {
    sm: 'p-4 rounded-xl',
    md: 'p-6 rounded-2xl',
    lg: 'p-8 rounded-3xl',
    xl: 'p-10 rounded-3xl',
  };

  const blurLevels = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-xl',
    lg: 'backdrop-blur-2xl',
  };

  const glowColors = {
    blue: 'shadow-[0_0_30px_rgba(46,108,253,0.3)]',
    green: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
    purple: 'shadow-[0_0_30px_rgba(185,162,232,0.3)]',
  };

  const hoverClasses = hover 
    ? 'hover:-translate-y-2 hover:shadow-[0_20px_50px_0_rgba(0,0,0,0.15)]' 
    : '';

  return (
    <div
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${blurLevels[blur]}
        ${glow ? glowColors[glowColor] : ''}
        ${hoverClasses}
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {icon && (
        <div className={`
          w-14 h-14 rounded-2xl ${iconBg} 
          flex items-center justify-center mb-4
          shadow-lg
        `}>
          {icon}
        </div>
      )}
      {children}
    </div>
  );
}
