import React from 'react';

const TravelMateAILogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`${className} relative group cursor-pointer`}>
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-3xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Enhanced Gradient Definitions */}
        <defs>
          {/* Primary Owl Gradient */}
          <linearGradient id="owlPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" stopOpacity="1" />
            <stop offset="30%" stopColor="#3B82F6" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#1E40AF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.85" />
          </linearGradient>

          {/* Owl Accent Gradient */}
          <linearGradient id="owlAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8E53" stopOpacity="1" />
            <stop offset="50%" stopColor="#FF6B35" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.8" />
          </linearGradient>

          {/* Eye Gradient */}
          <radialGradient id="eyeGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FEFEFE" stopOpacity="1" />
            <stop offset="70%" stopColor="#F1F5F9" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.9" />
          </radialGradient>

          {/* Compass Eye Gradient */}
          <radialGradient id="compassGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06D6A0" stopOpacity="1" />
            <stop offset="50%" stopColor="#1E3A8A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.8" />
          </radialGradient>

          {/* Premium Glow Filter */}
          <filter id="premiumGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Soft Shadow */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1E3A8A" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Outer Circle Border with Animation */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="none"
          stroke="url(#owlPrimary)"
          strokeWidth="3"
          opacity="0.8"
          filter="url(#softShadow)"
        >
          <animate
            attributeName="stroke-width"
            values="3;4;3"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Background Circle */}
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="#FEFEFE"
          filter="url(#softShadow)"
        />

        {/* Animated Travel Elements */}
        {/* Flying Airplane */}
        <g transform="translate(25, 25)" opacity="0.7">
          <path
            d="M0 2 L8 0 L10 1 L8 2 L12 4 L10 6 L8 4 L0 6 L2 3 Z"
            fill="url(#owlPrimary)"
            transform="scale(0.8)"
            filter="url(#premiumGlow)"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              values="0; 10; 0"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
          {/* Airplane trail */}
          <path
            d="M-5 3 Q-2 2 0 3"
            stroke="url(#owlAccent)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2,2"
            opacity="0.5"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;4;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Chat Bubble */}
        <g transform="translate(85, 25)" opacity="0.6">
          <circle cx="5" cy="5" r="4" fill="url(#owlAccent)" />
          <path d="M3 7 L5 9 L7 7" fill="url(#owlAccent)" />
          <circle cx="5" cy="5" r="1.5" fill="white">
            <animate
              attributeName="r"
              values="1.5;2;1.5"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Main Owl Design */}
        <g transform="translate(60, 45)">
          {/* Owl Head/Body */}
          <ellipse
            cx="0"
            cy="0"
            rx="25"
            ry="20"
            fill="url(#owlPrimary)"
            filter="url(#premiumGlow)"
          >
            <animate
              attributeName="ry"
              values="20;21;20"
              dur="5s"
              repeatCount="indefinite"
            />
          </ellipse>

          {/* Owl Ears/Horns */}
          <path
            d="M-15 -15 Q-18 -25 -12 -20 Q-8 -18 -10 -12"
            fill="url(#owlPrimary)"
            opacity="0.9"
          />
          <path
            d="M15 -15 Q18 -25 12 -20 Q8 -18 10 -12"
            fill="url(#owlPrimary)"
            opacity="0.9"
          />
          
          {/* Owl Ear Accents */}
          <path
            d="M-15 -15 Q-16 -20 -13 -18"
            fill="url(#owlAccent)"
            opacity="0.8"
          />
          <path
            d="M15 -15 Q16 -20 13 -18"
            fill="url(#owlAccent)"
            opacity="0.8"
          />

          {/* Left Eye */}
          <circle
            cx="-10"
            cy="-3"
            r="8"
            fill="url(#eyeGradient)"
            filter="url(#softShadow)"
          >
            <animate
              attributeName="r"
              values="8;8.5;8"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Left Eye Compass */}
          <circle
            cx="-10"
            cy="-3"
            r="4"
            fill="url(#compassGradient)"
          >
            <animate
              attributeName="r"
              values="4;4.5;4"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Compass Points in Left Eye */}
          <g transform="translate(-10, -3)" stroke="white" strokeWidth="0.5" opacity="0.8">
            <line x1="0" y1="-3" x2="0" y2="-2" />
            <line x1="0" y1="2" x2="0" y2="3" />
            <line x1="-3" y1="0" x2="-2" y2="0" />
            <line x1="2" y1="0" x2="3" y2="0" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 -10 -3"
              to="360 -10 -3"
              dur="8s"
              repeatCount="indefinite"
            />
          </g>

          {/* Right Eye */}
          <circle
            cx="10"
            cy="-3"
            r="8"
            fill="url(#eyeGradient)"
            filter="url(#softShadow)"
          >
            <animate
              attributeName="r"
              values="8;8.5;8"
              dur="4.5s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Right Eye Compass */}
          <circle
            cx="10"
            cy="-3"
            r="4"
            fill="url(#compassGradient)"
          >
            <animate
              attributeName="r"
              values="4;4.5;4"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Compass Points in Right Eye */}
          <g transform="translate(10, -3)" stroke="white" strokeWidth="0.5" opacity="0.8">
            <line x1="0" y1="-3" x2="0" y2="-2" />
            <line x1="0" y1="2" x2="0" y2="3" />
            <line x1="-3" y1="0" x2="-2" y2="0" />
            <line x1="2" y1="0" x2="3" y2="0" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 10 -3"
              to="-360 10 -3"
              dur="10s"
              repeatCount="indefinite"
            />
          </g>

          {/* Owl Beak */}
          <path
            d="M0 3 L-2 8 L2 8 Z"
            fill="url(#owlAccent)"
            filter="url(#premiumGlow)"
          >
            <animate
              attributeName="opacity"
              values="1;0.8;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>

          {/* Wing Accents */}
          <path
            d="M-20 5 Q-25 8 -22 12 Q-18 10 -16 8"
            fill="url(#owlAccent)"
            opacity="0.7"
          />
          <path
            d="M20 5 Q25 8 22 12 Q18 10 16 8"
            fill="url(#owlAccent)"
            opacity="0.7"
          />
        </g>

        {/* Bottom Triangle/Arrow */}
        <g transform="translate(60, 85)">
          <path
            d="M0 -5 L-8 5 L8 5 Z"
            fill="url(#owlPrimary)"
            filter="url(#premiumGlow)"
          >
            <animate
              attributeName="opacity"
              values="1;0.7;1"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M0 -3 L-5 3 L5 3 Z"
            fill="url(#owlAccent)"
            opacity="0.8"
          />
        </g>

        {/* Floating Particles */}
        <g opacity="0.4">
          {[...Array(6)].map((_, i) => (
            <circle
              key={i}
              cx={30 + (i * 12)}
              cy={95}
              r="1"
              fill="url(#owlAccent)"
            >
              <animate
                attributeName="cy"
                values="95;85;95"
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Interactive Hover Ring */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="url(#owlAccent)"
          strokeWidth="0"
          opacity="0"
          className="group-hover:stroke-width-2 group-hover:opacity-60 transition-all duration-500"
        >
          <animate
            attributeName="r"
            values="45;48;45"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Success State Animation (Hidden by default) */}
        <g opacity="0" className="success-animation">
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke="#06D6A0"
            strokeWidth="3"
            strokeDasharray="251"
            strokeDashoffset="251"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="251;0"
              dur="1.5s"
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
              r="2"
              fill="url(#owlAccent)"
              transform={`rotate(${i * 45} 60 60) translate(35 0)`}
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