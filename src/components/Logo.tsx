import React from 'react';

const TravelMateAILogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`${className} relative group cursor-pointer`}>
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-3xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Enhanced Gradient Definitions - Luxury Travel Colors */}
        <defs>
          {/* Primary Luxury Gradient */}
          <linearGradient id="luxuryPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
            <stop offset="25%" stopColor="#FF6B35" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#06D6A0" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#1E3A8A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.8" />
          </linearGradient>

          {/* Neural Network Gradient */}
          <radialGradient id="neuralCore" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#40E0D0" stopOpacity="1" />
            <stop offset="30%" stopColor="#06D6A0" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FF6B35" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.5" />
          </radialGradient>

          {/* Premium Travel Accent */}
          <linearGradient id="travelAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FF8E53" />
            <stop offset="100%" stopColor="#06D6A0" />
          </linearGradient>

          {/* Interactive Glow */}
          <filter id="premiumGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Particle Flow Filter */}
          <filter id="particleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="softGlow"/>
            <feMerge>
              <feMergeNode in="softGlow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Luxury Ring - Journey Path */}
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="url(#luxuryPrimary)"
          strokeWidth="2"
          strokeDasharray="12,6,4,6"
          opacity="0.6"
          filter="url(#particleGlow)"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="25s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0.9;0.6"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Neural Network Pulsing Ring */}
        <circle
          cx="60"
          cy="60"
          r="35"
          fill="none"
          stroke="url(#neuralCore)"
          strokeWidth="1.5"
          opacity="0.4"
        >
          <animate
            attributeName="r"
            values="35;38;35"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4;0.7;0.4"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* AI Brain Core - Enhanced */}
        <circle 
          cx="60" 
          cy="60" 
          r="22" 
          fill="url(#neuralCore)" 
          filter="url(#premiumGlow)"
          opacity="0.95"
        >
          <animate
            attributeName="r"
            values="22;25;22"
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Premium Neural Network Pattern */}
        <g transform="translate(60, 60)" fill="white" opacity="0.9">
          {/* Central AI Hub */}
          <circle cx="0" cy="0" r="4" fill="white">
            <animate
              attributeName="r"
              values="4;5;4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Neural Connections */}
          <g stroke="white" strokeWidth="1.5" fill="none" opacity="0.8">
            <line x1="0" y1="-12" x2="0" y2="-6">
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line x1="0" y1="6" x2="0" y2="12">
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </line>
            <line x1="-12" y1="0" x2="-6" y2="0">
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="3s"
                repeatCount="indefinite"
              />
            </line>
            <line x1="6" y1="0" x2="12" y2="0">
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </line>
          </g>
          
          {/* Neural Nodes */}
          <circle cx="-8" cy="-8" r="2" fill="white">
            <animate
              attributeName="fill"
              values="white;#06D6A0;white"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="8" cy="-8" r="2" fill="white">
            <animate
              attributeName="fill"
              values="white;#FF6B35;white"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="-8" cy="8" r="2" fill="white">
            <animate
              attributeName="fill"
              values="white;#FFD700;white"
              dur="2.8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="8" cy="8" r="2" fill="white">
            <animate
              attributeName="fill"
              values="white;#1E3A8A;white"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Premium Travel Elements */}
        <g fill="url(#travelAccent)" opacity="0.9">
          {/* Luxury Aircraft Design */}
          <g transform="translate(30, 30)">
            <path
              d="M0 3 L12 0 L15 2 L12 4 L18 7 L15 10 L12 7 L0 10 L3 5 Z"
              transform="scale(0.7) rotate(35)"
              filter="url(#particleGlow)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                values="35; 40; 35"
                dur="8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9;1;0.9"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Smart Location Pin */}
          <g transform="translate(85, 85)">
            <path
              d="M6 0 C9 0 12 3 12 6 C12 10 6 18 6 18 C6 18 0 10 0 6 C0 3 3 0 6 0 Z"
              transform="scale(0.8)"
              filter="url(#particleGlow)"
            />
            <circle cx="4.8" cy="4.8" r="2" fill="white">
              <animate
                attributeName="r"
                values="2;2.5;2"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <animate
              attributeName="opacity"
              values="0.9;1;0.9"
              dur="5s"
              repeatCount="indefinite"
            />
          </g>

          {/* Luxury Compass */}
          <g transform="translate(85, 30)">
            <g transform="scale(0.8)" filter="url(#particleGlow)">
              {/* Compass Rose */}
              <polygon points="6,0 7,5 6,10 5,5" fill="url(#travelAccent)" />
              <polygon points="0,6 5,7 10,6 5,5" fill="url(#travelAccent)" opacity="0.7" />
              <polygon points="6,0 7,5 6,10 5,5" fill="url(#travelAccent)" transform="rotate(45 6 6)" opacity="0.5" />
              <polygon points="0,6 5,7 10,6 5,5" fill="url(#travelAccent)" transform="rotate(45 6 6)" opacity="0.3" />
              <circle cx="6" cy="6" r="1.5" fill="white">
                <animate
                  attributeName="r"
                  values="1.5;2;1.5"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 85 30"
              to="360 85 30"
              dur="15s"
              repeatCount="indefinite"
            />
          </g>
        </g>

        {/* Particle Flow System */}
        <g stroke="url(#luxuryPrimary)" strokeWidth="1" fill="none" opacity="0.4">
          {/* Data Flow Paths */}
          <path d="M35 35 Q60 25 85 35" strokeDasharray="3,4" filter="url(#particleGlow)">
            <animate
              attributeName="stroke-dashoffset"
              values="0;14;0"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0.8;0.4"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M35 85 Q60 95 85 85" strokeDasharray="3,4" filter="url(#particleGlow)">
            <animate
              attributeName="stroke-dashoffset"
              values="0;-14;0"
              dur="5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0.8;0.4"
              dur="5s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M35 35 Q25 60 35 85" strokeDasharray="2,3" filter="url(#particleGlow)">
            <animate
              attributeName="stroke-dashoffset"
              values="0;10;0"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M85 35 Q95 60 85 85" strokeDasharray="2,3" filter="url(#particleGlow)">
            <animate
              attributeName="stroke-dashoffset"
              values="0;-10;0"
              dur="4.5s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Interactive Hover Glow */}
        <circle
          cx="60"
          cy="60"
          r="28"
          fill="none"
          stroke="url(#travelAccent)"
          strokeWidth="0.5"
          opacity="0"
          className="group-hover:opacity-60 transition-opacity duration-500"
        >
          <animate
            attributeName="r"
            values="28;32;28"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Success State Animation (Hidden by default) */}
        <g opacity="0" className="success-animation">
          <circle
            cx="60"
            cy="60"
            r="25"
            fill="none"
            stroke="#06D6A0"
            strokeWidth="2"
            strokeDasharray="157"
            strokeDashoffset="157"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="157;0"
              dur="1s"
              fill="freeze"
            />
          </circle>
        </g>

        {/* Loading State Particles */}
        <g className="loading-particles" opacity="0">
          {[...Array(8)].map((_, i) => (
            <circle
              key={i}
              cx="60"
              cy="60"
              r="1"
              fill="url(#travelAccent)"
              transform={`rotate(${i * 45} 60 60) translate(40 0)`}
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="1.5s"
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default TravelMateAILogo;