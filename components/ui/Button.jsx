'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  target,
  rel,
  download
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#58A6FF] focus:ring-offset-2 focus:ring-offset-[#090909] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#F5F5F5] text-[#090909] hover:bg-[#E4E4E7] font-semibold shadow-md',
    secondary: 'bg-[#141414] border border-[#292929] text-[#F5F5F5] hover:bg-[#191919] hover:border-[#3F3F46]',
    outline: 'border border-[#292929] text-[#F5F5F5] hover:bg-[#191919] hover:border-[#3F3F46]',
    ghost: 'text-[#A1A1AA] hover:text-[#58A6FF] hover:bg-[#141414]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    const isExternal = href.startsWith('http') || download;
    if (isExternal) {
      return (
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={href}
          target={target || '_blank'}
          rel={rel || 'noopener noreferrer'}
          download={download}
          className={combinedClasses}
        >
          {children}
        </motion.a>
      );
    }
    return (
      <Link href={href} passHref legacyBehavior>
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={combinedClasses}
        >
          {children}
        </motion.a>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {children}
    </motion.button>
  );
}
