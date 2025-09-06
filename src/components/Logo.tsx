import React from 'react';

const TravelMateAILogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`${className} relative`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06D6A0" />
            <stop offset="50%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#40E0D0" />
            <stop offset="100%" stopColor="#FF8E53" />
          </linearGradient>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#40E0D0" stopOpacity="1" />
            <stop offset="70%" stopColor="#06D6A0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.6" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Ring - Subtle Travel Path */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="url(#primaryGradient)"
          strokeWidth="1.5"
          strokeDasharray="8,4"
          opacity="0.4"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="30s"
            repeatCount="indefinite"
          />
        </circle>

        {/* AI Brain Core */}
        <circle 
          cx="50" 
          cy="50" 
          r="18" 
          fill="url(#coreGradient)" 
          filter="url(#softGlow)"
          opacity="0.9"
        >
          <animate
            attributeName="r"
            values="18;20;18"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Central AI Symbol */}
        <g transform="translate(50, 50)" fill="white" opacity="0.9">
          {/* AI Circuit Pattern */}
          <circle cx="0" cy="0" r="3" fill="white" />
          <rect x="-1" y="-8" width="2" height="6" rx="1" />
          <rect x="-1" y="2" width="2" height="6" rx="1" />
          <rect x="-8" y="-1" width="6" height="2" ry="1" />
          <rect x="2" y="-1" width="6" height="2" ry="1" />
          
          {/* Corner nodes */}
          <circle cx="-6" cy="-6" r="1.5" />
          <circle cx="6" cy="-6" r="1.5" />
          <circle cx="-6" cy="6" r="1.5" />
          <circle cx="6" cy="6" r="1.5" />
        </g>

        {/* Travel Elements - Minimalist */}
        <g fill="url(#accentGradient)" opacity="0.8">
          {/* Stylized Airplane */}
          <g transform="translate(25, 25)">
            <path
              d="M0 2 L8 0 L10 2 L8 4 L12 6 L10 8 L8 6 L0 8 L2 4 Z"
              transform="scale(0.8) rotate(45)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                values="45; 50; 45"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Modern Location Pin */}
          <g transform="translate(70, 70)">
            <path
              d="M5 0 C7.5 0 10 2.5 10 5 C10 8 5 15 5 15 C5 15 0 8 0 5 C0 2.5 2.5 0 5 0 Z"
              transform="scale(0.7)"
            />
            <circle cx="3.5" cy="3.5" r="1.5" fill="white" />
          </g>

          {/* Compass Rose */}
          <g transform="translate(75, 25)">
            <g transform="scale(0.6)">
              <polygon points="5,0 6,4 5,8 4,4" fill="url(#accentGradient)" />
              <polygon points="0,5 4,6 8,5 4,4" fill="url(#accentGradient)" opacity="0.6" />
              <circle cx="5" cy="5" r="1" fill="white" />
            </g>
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 75 25"
              to="360 75 25"
              dur="20s"
              repeatCount="indefinite"
            />
          </g>
        </g>

        {/* Subtle Data Flow Lines */}
        <g stroke="url(#primaryGradient)" strokeWidth="1" fill="none" opacity="0.3">
          <path d="M30 30 Q50 20 70 30" strokeDasharray="2,3">
            <animate
              attributeName="stroke-dashoffset"
              values="0;10;0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M30 70 Q50 80 70 70" strokeDasharray="2,3">
            <animate
              attributeName="stroke-dashoffset"
              values="0;-10;0"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Outer Glow Effect */}
        <circle
          cx="50"
          cy="50"
          r="22"
          fill="none"
          stroke="url(#accentGradient)"
          strokeWidth="0.5"
          opacity="0.3"
        >
          <animate
            attributeName="r"
            values="22;26;22"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.1;0.3"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default TravelMateAILogo;