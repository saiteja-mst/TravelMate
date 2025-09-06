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
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="50%" stopColor="#06D6A0" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#40E0D0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF8E53" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Circle - AI Neural Network Ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#aiGradient)"
          strokeWidth="2"
          strokeDasharray="5,3"
          opacity="0.6"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>

        {/* AI Brain/Circuit Pattern */}
        <g fill="url(#aiGradient)" opacity="0.8">
          {/* Central AI Core */}
          <circle cx="50" cy="50" r="8" fill="url(#glowGradient)" filter="url(#glow)" />
          
          {/* Neural Network Nodes */}
          <circle cx="35" cy="35" r="3" />
          <circle cx="65" cy="35" r="3" />
          <circle cx="35" cy="65" r="3" />
          <circle cx="65" cy="65" r="3" />
          <circle cx="25" cy="50" r="2.5" />
          <circle cx="75" cy="50" r="2.5" />
          <circle cx="50" cy="25" r="2.5" />
          <circle cx="50" cy="75" r="2.5" />

          {/* Connection Lines */}
          <line x1="42" y1="42" x2="50" y2="50" stroke="url(#aiGradient)" strokeWidth="1.5" opacity="0.7" />
          <line x1="58" y1="42" x2="50" y2="50" stroke="url(#aiGradient)" strokeWidth="1.5" opacity="0.7" />
          <line x1="42" y1="58" x2="50" y2="50" stroke="url(#aiGradient)" strokeWidth="1.5" opacity="0.7" />
          <line x1="58" y1="58" x2="50" y2="50" stroke="url(#aiGradient)" strokeWidth="1.5" opacity="0.7" />
          <line x1="27.5" y1="50" x2="42" y2="50" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.5" />
          <line x1="72.5" y1="50" x2="58" y2="50" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.5" />
          <line x1="50" y1="27.5" x2="50" y2="42" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.5" />
          <line x1="50" y1="72.5" x2="50" y2="58" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.5" />
        </g>

        {/* Travel Elements */}
        <g fill="url(#glowGradient)">
          {/* Airplane Path */}
          <path
            d="M20 30 L25 28 L30 30 L28 32 L32 35 L30 37 L25 35 L20 37 Z"
            transform="rotate(45 25 32)"
            opacity="0.9"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              values="45 25 32; 50 25 32; 45 25 32"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>

          {/* Location Pin */}
          <path
            d="M75 65 C75 62 77 60 80 60 C83 60 85 62 85 65 C85 68 80 75 80 75 C80 75 75 68 75 65 Z"
            opacity="0.8"
          />
          <circle cx="80" cy="65" r="2" fill="#FEFEFE" />

          {/* Compass */}
          <g transform="translate(70, 25)">
            <circle cx="5" cy="5" r="6" fill="none" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.6" />
            <polygon points="5,2 6,5 5,8 4,5" fill="url(#glowGradient)" opacity="0.8" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 75 30"
              to="360 75 30"
              dur="15s"
              repeatCount="indefinite"
            />
          </g>
        </g>

        {/* Pulsing Effect */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="none"
          stroke="url(#glowGradient)"
          strokeWidth="1"
          opacity="0.4"
        >
          <animate
            attributeName="r"
            values="8;12;8"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4;0.1;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default TravelMateAILogo;