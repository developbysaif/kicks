import React from 'react';

/**
 * PageSection Component
 * Reusable full-width section wrapper enforcing alternating White & Red backgrounds
 * 
 * @param {'white' | 'red'} variant - Section background color
 * @param {boolean} container - Wrap children in max-w-7xl container (default: true)
 * @param {string} className - Additional outer wrapper classes
 * @param {string} containerClassName - Additional inner container classes
 * @param {string} as - HTML tag (default: 'section')
 * @param {string} id - HTML element id
 */
export default function PageSection({
  variant = 'white',
  container = true,
  className = '',
  containerClassName = '',
  as: Component = 'section',
  id,
  children,
  ...props
}) {
  const isRed = variant === 'red';

  const baseBg = isRed
    ? 'bg-[#D0161D] text-white'
    : 'bg-white text-slate-900';

  const basePadding = 'py-12 sm:py-16 lg:py-20';

  return (
    <Component
      id={id}
      className={`w-full relative transition-colors ${baseBg} ${basePadding} ${className}`.trim()}
      {...props}
    >
      {container ? (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${containerClassName}`.trim()}>
          {children}
        </div>
      ) : (
        children
      )}
    </Component>
  );
}
