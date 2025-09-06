  <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>

          {/* Orange Accent Gradient */}
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Eye Gradient */}
          <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </radialGradient>

          {/* Compass Gradient */}
          <linearGradient id="compassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#0f172a" />
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
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1e3a8a" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Outer Animated Ring */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="none"
          stroke="url(#primaryGradient)"
          strokeWidth="2"
          opacity="0.6"
          strokeDasharray="10 5"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 60 60;360 60 60"
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Secondary Outer Ring */}
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="url(#orangeGradient)"
          strokeWidth="1"
          opacity="0.4"
          strokeDasharray="5 10"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="360 60 60;0 60 60"
            dur="15s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Main Circle Background */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="white"
          filter="url(#shadow)"
        />

        {/* Owl Body - Main Shape */}
        <path
          d="M35 45 Q35 35 45 35 L75 35 Q85 35 85 45 L85 65 Q85 75 75 75 L45 75 Q35 75 35 65 Z"
          fill="url(#primaryGradient)"
          filter="url(#shadow)"
        >
          <animate
            attributeName="opacity"
            values="1;0.9;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Owl Ears/Horns */}
        <path
          d="M45 35 Q40 25 45 30 Q50 35 45 35"
          fill="url(#primaryGradient)"
        />
        <path
          d="M75 35 Q80 25 75 30 Q70 35 75 35"
          fill="url(#primaryGradient)"
        />

        {/* Left Eye - Outer Circle */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="url(#eyeGradient)"
          stroke="url(#orangeGradient)"
          strokeWidth="2"
          filter="url(#shadow)"
        >
          <animate
            attributeName="r"
            values="12;13;12"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Right Eye - Outer Circle */}
        <circle
          cx="70"
          cy="50"
          r="12"
          fill="url(#eyeGradient)"
          stroke="url(#orangeGradient)"
          strokeWidth="2"
          filter="url(#shadow)"
        >
          <animate
            attributeName="r"
            values="12;13;12"
            dur="3s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </circle>

        {/* Left Eye Compass */}
        <g transform="translate(50, 50)">
          <circle cx="0" cy="0" r="8" fill="url(#compassGradient)" />
          <g stroke="white" strokeWidth="1" opacity="0.9">
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
          <circle cx="0" cy="0" r="1.5" fill="white">
            <animate
              attributeName="r"
              values="1.5;2;1.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Right Eye Compass */}
        <g transform="translate(70, 50)">
          <circle cx="0" cy="0" r="8" fill="url(#compassGradient)" />
          <g stroke="white" strokeWidth="1" opacity="0.9">
            <line x1="0" y1="-6" x2="0" y2="-4" />
            <line x1="0" y1="4" x2="0" y2="6" />
            <line x1="-6" y1="0" x2="-4" y2="0" />
            <line x1="4" y1="0" x2="6" y2="0" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="360;0"
              dur="8s"
              repeatCount="indefinite"
            />
          </g>
          <circle cx="0" cy="0" r="1.5" fill="white">
            <animate
              attributeName="r"
              values="1.5;2;1.5"
              dur="2s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
        </g>

        {/* Owl Beak */}
        <path
          d="M60 58 L55 65 L65 65 Z"
          fill="url(#orangeGradient)"
          filter="url(#shadow)"
        >
          <animate
            attributeName="opacity"
            values="1;0.8;1"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Owl Body Bottom */}
        <path
          d="M50 70 L60 80 L70 70 Z"
          fill="url(#primaryGradient)"
          filter="url(#shadow)"
        />

        {/* Airplane with Trail */}
        <g transform="translate(85, 25)" opacity="0.8">
          <path
            d="M0 2 L8 0 L10 2 L8 4 L12 6 L10 8 L8 6 L0 8 L2 5 Z"
            fill="url(#primaryGradient)"
            filter="url(#glow)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0;10;0"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
          {/* Dotted Trail */}
          <path
            d="M-8 4 Q-4 2 0 4"
            stroke="url(#primaryGradient)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2,2"
            opacity="0.6"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;4;0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Chat Bubble */}
        <g transform="translate(95, 85)" opacity="0.7">
          <circle cx="0" cy="0" r="6" fill="url(#primaryGradient)" />
          <path d="M-3 3 L0 6 L3 3" fill="url(#primaryGradient)" />
          <circle cx="0" cy="0" r="2" fill="white">
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="-2" cy="-1" r="0.5" fill="white" opacity="0.8" />
          <circle cx="2" cy="-1" r="0.5" fill="white" opacity="0.8" />
        </g>

        {/* Crescent Moon */}
        <g transform="translate(25, 85)" opacity="0.6">
          <path
            d="M0 0 Q-4 -8 0 -12 Q2 -8 0 0"
            fill="url(#orangeGradient)"
          >
            <animate
              attributeName="opacity"
              values="0.6;0.9;0.6"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Floating Particles */}
        <g opacity="0.5">
          {[...Array(6)].map((_, i) => (
            <circle
              key={i}
              cx={30 + (i * 12)}
              cy={95}
              r="1"
              fill="url(#primaryGradient)"
            >
              <animate
                attributeName="cy"
                values="95;90;95"
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Interactive Hover Ring */}
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="none"
          stroke="url(#orangeGradient)"
          strokeWidth="0"
          opacity="0"
          className="group-hover:stroke-2 group-hover:opacity-60 transition-all duration-500"
        >
          <animate
            attributeName="r"
            values="40;42;40"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Success State Ring (hidden by default) */}
        <circle
          cx="60"
          cy="60"
          r="35"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          opacity="0"
          strokeDasharray="220"
          strokeDashoffset="220"
          className="success-ring"
        />
      </svg>
    </div>
  );
};

export default TravelMateAILogo;