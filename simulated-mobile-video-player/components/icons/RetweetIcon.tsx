import React from "react";

export const RetweetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M7 10l-5 5 5 5" />
    <path d="M2 15h12A5 5 0 0 0 19 9h-2" />
    <path d="M17 14l5-5-5-5" />
    <path d="M22 9H10A5 5 0 0 0 5 15h2" />
  </svg>
);
