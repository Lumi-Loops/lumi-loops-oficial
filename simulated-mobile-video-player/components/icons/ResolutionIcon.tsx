import React from "react";

export const ResolutionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => (
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
    <path d="M7 21V3" />
    <path d="M17 21V3" />
    <path d="M21 12H3" />
    <path d="M21 17H3" />
    <path d="M21 7H3" />
  </svg>
);
