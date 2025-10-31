import React from 'react';

export const AspectRatioIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect width="18" height="12" x="3" y="6" rx="2" />
    <path d="m3 12 5-2.5" />
    <path d="m21 12-5-2.5" />
    <path d="m3 12 5 2.5" />
    <path d="m21 12-5 2.5" />
  </svg>
);