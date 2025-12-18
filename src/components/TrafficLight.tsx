interface TrafficLightProps {
  size?: number;
  activeLight?: 'red' | 'yellow' | 'green';
}

export function TrafficLight({ size = 52, activeLight = 'green' }: TrafficLightProps) {
  return (
    <svg 
      width={size} 
      height={size * 1.5} 
      viewBox="0 0 100 150" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Traffic light body */}
      <rect 
        x="20" 
        y="5" 
        width="60" 
        height="140" 
        rx="8" 
        fill="#374151"
        opacity="0.9"
      />
      
      {/* Red light */}
      <circle 
        cx="50" 
        cy="30" 
        r="15" 
        fill={activeLight === 'red' ? '#EF4444' : '#991B1B'}
        opacity={activeLight === 'red' ? 1 : 0.5}
      />
      {activeLight === 'red' && (
        <circle cx="50" cy="30" r="15" fill="#EF4444" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
      
      {/* Yellow light */}
      <circle 
        cx="50" 
        cy="75" 
        r="15" 
        fill={activeLight === 'yellow' ? '#FCD34D' : '#A16207'}
        opacity={activeLight === 'yellow' ? 1 : 0.5}
      />
      {activeLight === 'yellow' && (
        <circle cx="50" cy="75" r="15" fill="#FCD34D" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
      
      {/* Green light */}
      <circle 
        cx="50" 
        cy="120" 
        r="15" 
        fill={activeLight === 'green' ? '#22C55E' : '#166534'}
        opacity={activeLight === 'green' ? 1 : 0.5}
      />
      {activeLight === 'green' && (
        <circle cx="50" cy="120" r="15" fill="#22C55E" opacity="0.5">
          <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}