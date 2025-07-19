import React from 'react';

const Logo = ({ className = "h-12 w-12" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Kumar's Personal Logo - K with Tamil and Hindi characters"
    >
      {/* Filter for subtle shadow effect */}
      <defs>
        <filter id="subtleShadow">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.2"/>
        </filter>
      </defs>
      
      {/* White circle background */}
      <circle cx="100" cy="100" r="85" fill="white" stroke="#000000" strokeWidth="4"/>
      
      {/* Main English K */}
      <g transform="translate(100, 100)" fill="#000000" filter="url(#subtleShadow)">
        
        {/* Vertical line of K */}
        <rect x="-15" y="-40" width="6" height="80" rx="3"/>
        
        {/* Upper diagonal of K */}
        <polygon points="-9,-12 25,-32 28,-26 -6,-6"/>
        
        {/* Lower diagonal of K */}
        <polygon points="-9,12 28,26 25,32 -6,6"/>
      </g>
      
      {/* Tamil கு in bottom right */}
      <g transform="translate(140, 130)" fill="#000000" opacity="1">
        <text x="0" y="0" 
              fontFamily="Tamil, Noto Sans Tamil, serif" 
              fontSize="48" 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontWeight="bold">கு</text>
      </g>
      
      {/* Hindi कु in bottom left */}
      <g transform="translate(60, 130)" fill="#000000" opacity="1">
        <text x="0" y="0" 
              fontFamily="Devanagari, Noto Sans Devanagari, serif" 
              fontSize="48" 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontWeight="bold">कु</text>
      </g>
    </svg>
  );
};

export default Logo; 