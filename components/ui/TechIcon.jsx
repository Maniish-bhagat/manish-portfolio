'use client';

/**
 * Official tech stack brand icons (clean, lightweight monochrome SVGs matching the dark theme)
 */
export default function TechIcon({ name, className = 'w-3 h-3 flex-shrink-0' }) {
  const norm = name.toLowerCase().trim();

  // Python / Python 3
  if (norm.includes('python')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.006 2.75h5.813v.828H3.904S0 5.78 0 11.906c0 6.124 3.414 5.922 3.414 5.922h2.039v-2.86s-.11-3.413 3.359-3.413h5.789s3.25.052 3.25-3.148V2.656S18.352 0 11.914 0zm-1.758 1.813a1.078 1.078 0 1 1 0 2.156 1.078 1.078 0 0 1 0-2.156z" />
        <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.006-2.75h-5.813v-.828h8.115s3.904.454 3.904-5.672c0-6.124-3.414-5.922-3.414-5.922h-2.039v2.86s.11 3.413-3.359 3.413H9.408s-3.25-.052-3.25 3.148v5.766s-.508 2.641 5.928 2.641zm1.758-1.813a1.078 1.078 0 1 1 0-2.156 1.078 1.078 0 0 1 0 2.156z" />
      </svg>
    );
  }

  // Flask
  if (norm.includes('flask')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M9 2h6" />
        <path d="M10 2v5.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 7.5V2" />
        <path d="M6.5 15h11" />
      </svg>
    );
  }

  // SQLite
  if (norm.includes('sqlite')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M18.89 2.5c-4.47 0-8.62 1.34-11.23 3.68C5.07 8.5 4 11.26 4 14.18c0 4.35 2.54 7.32 6.78 7.32 4.47 0 8.62-1.34 11.23-3.68 2.59-2.32 3.66-5.08 3.66-8 0-4.35-2.54-7.32-6.78-7.32zm-2.04 16.08c-3.14 0-5.74-1.82-5.74-5.06 0-3.32 2.67-5.18 5.74-5.18 3.14 0 5.74 1.82 5.74 5.06 0 3.32-2.67 5.18-5.74 5.18z" />
      </svg>
    );
  }

  // HTML / HTML5
  if (norm.includes('html')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M1.5 0h21l-1.9 21.3L12 24l-8.6-2.7L1.5 0zm16.5 6.6H7.1l.3 3.1h10.2l-.7 7.7-4.9 1.4-4.9-1.4-.3-3.8h2.8l.2 1.8 2.2.6 2.2-.6.2-2.7H6.7L5.8 3.6h12.5l-.3 3z" />
      </svg>
    );
  }

  // CSS / CSS3
  if (norm.includes('css')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M1.5 0h21l-1.9 21.3L12 24l-8.6-2.7L1.5 0zm16.8 6.6h-11l.2 3.1h10.6l-.8 8-5.3 1.5-5.3-1.5-.4-4.5h2.8l.2 2.3 2.7.7 2.7-.7.3-3.3H6.4L5.6 3.6h13.1l-.4 3z" />
      </svg>
    );
  }

  // Jinja / Jinja2
  if (norm.includes('jinja')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M4 7V4h3" />
        <path d="M20 7V4h-3" />
        <path d="M4 17v3h3" />
        <path d="M20 17v3h-3" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
      </svg>
    );
  }

  // Anthropic / Claude API
  if (norm.includes('anthropic') || norm.includes('claude')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M13.827 2.05h3.818L24 21.95h-3.818l-1.96-5.045H10.15l-1.96 5.045H4.373L13.827 2.05zm2.71 12.023l-2.45-6.3-2.45 6.3h4.9zM0 21.95l5.59-14.364h3.818L3.818 21.95H0z" />
      </svg>
    );
  }

  // React
  if (norm.includes('react')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="2.2" />
        <path fill="none" stroke="currentColor" strokeWidth="1.4" d="M12 21.5c4.97 0 9-4.25 9-9.5S16.97 2.5 12 2.5 3 6.75 3 12s4.03 9.5 9 9.5z" transform="rotate(30 12 12)" />
        <path fill="none" stroke="currentColor" strokeWidth="1.4" d="M12 21.5c4.97 0 9-4.25 9-9.5S16.97 2.5 12 2.5 3 6.75 3 12s4.03 9.5 9 9.5z" transform="rotate(90 12 12)" />
        <path fill="none" stroke="currentColor" strokeWidth="1.4" d="M12 21.5c4.97 0 9-4.25 9-9.5S16.97 2.5 12 2.5 3 6.75 3 12s4.03 9.5 9 9.5z" transform="rotate(150 12 12)" />
      </svg>
    );
  }

  // Node.js
  if (norm.includes('node')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 1.5l10.5 6v12L12 25.5 1.5 19.5v-12L12 1.5zm0 2.2L3.5 8.5v9.8l8.5 4.9 8.5-4.9V8.5L12 3.7z" />
      </svg>
    );
  }

  // MongoDB
  if (norm.includes('mongo')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 0s-5.5 5.5-5.5 12.5c0 4.8 3.5 8.5 5.5 11.5 2-3 5.5-6.7 5.5-11.5C17.5 5.5 12 0 12 0zm-.2 22.8c-1.3-2.3-3.8-5.7-3.8-10.3 0-5 3.3-9.5 4-10.5.7 1 4 5.5 4 10.5 0 4.6-2.5 8-3.8 10.3l-.4.7-.4-.7h.4z" />
      </svg>
    );
  }

  // JavaScript / JS
  if (norm.includes('javascript') || norm === 'js') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M3 3h18v18H3V3zm11.5 13.8c.4.7 1 1.2 2 1.2 1.1 0 1.8-.6 1.8-1.5 0-1-.8-1.4-2.2-2-1.7-.7-2.8-1.4-2.8-3.1 0-1.7 1.3-3 3.3-3 1.4 0 2.4.5 3.1 1.8l-1.6 1c-.3-.6-.8-.9-1.5-.9-.7 0-1.2.4-1.2 1 0 .7.5 1.1 1.7 1.6 1.9.8 3.3 1.5 3.3 3.5 0 2-1.6 3.2-3.8 3.2-2.1 0-3.4-1-4-2.3l1.9-1.1zm-6.6.3c.3.5.6.9 1.2.9.6 0 1-.2 1-1.2V8.5h2.1v7.6c0 2.1-1.2 3.1-3.1 3.1-1.7 0-2.7-.9-3.2-2l2-1.1z" />
      </svg>
    );
  }

  // Express / Express.js
  if (norm.includes('express')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M24 18.588l-5.69-7.147 5.412-6.8H20.73l-3.896 5.11-3.92-5.11H9.86l5.378 6.78-5.69 7.167h3.04l4.22-5.468 4.22 5.468H24zM5.534 5.341c-2.43 0-4.148 1.637-4.148 4.07v5.176c0 2.433 1.718 4.07 4.148 4.07 2.102 0 3.753-1.26 4.08-3.153H7.31c-.266.69-1.026 1.106-1.776 1.106-1.134 0-1.894-.85-1.894-2.115v-.895h5.975v-1.018c0-2.433-1.65-4.241-4.08-4.241zm-1.894 4.07c0-1.265.76-2.115 1.894-2.115 1.134 0 1.894.85 1.894 2.115v.895H3.64v-.895z" />
      </svg>
    );
  }

  // Default fallback code tag icon
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

