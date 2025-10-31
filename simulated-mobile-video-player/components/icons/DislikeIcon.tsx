import React from 'react';

export const DislikeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.13a2 2 0 0 0-1.92 2.6L4 9v6h6z" />
    <path d="M18 2h-3a3 3 0 0 0-3 3v1" />
  </svg>
);