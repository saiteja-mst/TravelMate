import React from 'react';

const TravelMateAILogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`${className} relative group cursor-pointer`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Modern Gradient */}
          <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#06D6A0" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>

          {/* Accent Gradient */}
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8E53" />
            <stop offset="100%" stopColor="#40E0D0" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Shadow Filter */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1E3A8A" floodOpacity="0.2"/>
          </filter>
        </defs>

        {/* Outer Ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#modernGradient)"
          strokeWidth="2"
          opacity="0.8"
          filter="url(#shadow)"
        >
          <animate
            attributeName="stroke-dasharray"
            values="0 283;141 142;0 283"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="white"
          filter="url(#shadow)"
        />

        {/* Central AI Brain */}
        <g transform="translate(50, 35)">
          {/* Brain Shape */}
          <path
            d="M-12 -8 Q-15 -12 -10 -15 Q-5 -18 0 -15 Q5 -18 10 -15 Q15 -12 12 -8 Q15 -4 12 0 Q8 3 4 0 Q0 2 -4 0 Q-8 3 -12 0 Q-15 -4 -12 -8 Z"
            fill="url(#modernGradient)"
            filter="url(#glow)"
          >
            <animate
              attributeName="opacity"
              values="1;0.8;1"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>

          {/* Neural Network Lines */}
          <g stroke="white" strokeWidth="1" opacity="0.8">
            <line x1="-8" y1="-8" x2="-4" y2="-4">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1="8" y1="-8" x2="4" y2="-4">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite" />
            </line>
            <line x1="-6" y1="-2" x2="6" y2="-2">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
            </line>
          </g>

          {/* Neural Nodes */}
          <circle cx="-8" cy="-8" r="1.5" fill="white">
            <animate attributeName="r" values="1.5;2;1.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="8" cy="-8" r="1.5" fill="white">
            <animate attributeName="r" values="1.5;2;1.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="-10" r="1.5" fill="white">
            <animate attributeName="r" values="1.5;2;1.5" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Travel Elements */}
        {/* Airplane */}
        <g transform="translate(25, 25)" opacity="0.7">
          <path
            d="M0 1 L6 0 L8 1 L6 2 L10 3 L8 4 L6 3 L0 4 L1 2.5 Z"
            fill="url(#accentGradient)"
            filter="url(#glow)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0;5;0"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
          {/* Flight path */}
          <path
            d="M-4 2 Q0 1 4 2"
            stroke="url(#accentGradient)"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="1,1"
            opacity="0.6"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;2;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Location Pin */}
        <g transform="translate(75, 25)" opacity="0.7">
          <path
            d="M0 0 Q-3 -6 0 -8 Q3 -6 0 0"
            fill="url(#accentGradient)"
            filter="url(#glow)"
          />
          <circle cx="0" cy="-5" r="2" fill="white">
            <animate
              attributeName="r"
              values="2;2.5;2"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Compass */}
        <g transform="translate(50, 65)">
          <circle cx="0" cy="0" r="8" fill="none" stroke="url(#modernGradient)" strokeWidth="1" opacity="0.6" />
          <g stroke="url(#accentGradient)" strokeWidth="1" opacity="0.8">
            <line x1="0" y1="-6" x2="0" y2="-4" />
            <line x1="0" y1="4" x2="0" y2="6" />
            <line x1="-6" y1="0" x2="-4" y2="0" />
            <line x1="4" y1="0" x2="6" y2="0" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0;360"
              dur="8s"
              repeatCount="indefinite"
            />
          </g>
          <circle cx="0" cy="0" r="1" fill="url(#accentGradient)">
            <animate
              attributeName="r"
              values="1;1.5;1"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Chat Bubble */}
        <g transform="translate(75, 75)" opacity="0.6">
          <circle cx="0" cy="0" r="4" fill="url(#accentGradient)" />
          <path d="M-2 2 L0 4 L2 2" fill="url(#accentGradient)" />
          <circle cx="0" cy="0" r="1" fill="white">
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Floating Data Particles */}
        <g opacity="0.4">
          {[...Array(4)].map((_, i) => (
            <circle
              key={i}
              cx={30 + (i * 10)}
              cy={85}
              r="0.5"
              fill="url(#modernGradient)"
            >
              <animate
                attributeName="cy"
                values="85;80;85"
                dur={`${2 + i * 0.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur={`${2 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Interactive Hover Effect */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="url(#accentGradient)"
          strokeWidth="0"
          opacity="0"
          className="group-hover:stroke-2 group-hover:opacity-50 transition-all duration-500"
        >
          <animate
            attributeName="r"
            values="35;37;35"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default TravelMateAILogo;