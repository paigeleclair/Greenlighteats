export function FoodTrafficLight() {
  return (
    <svg viewBox="0 0 200 280" className="w-full h-full">
      {/* Traffic light pole */}
      <rect x="85" y="230" width="30" height="50" fill="#4B5563" rx="4" />
      
      {/* Traffic light body */}
      <rect x="50" y="10" width="100" height="230" fill="#1F2937" rx="12" />
      
      {/* Green light - Safe */}
      <circle cx="100" cy="200" r="30" fill="#2D7A46" opacity="0.3" />
      <circle cx="100" cy="200" r="26" fill="#22C55E" />
      
      {/* Yellow light - Caution */}
      <circle cx="100" cy="115" r="30" fill="#EAB308" opacity="0.3" />
      <circle cx="100" cy="115" r="26" fill="#FDE047" />
      
      {/* Red light - Avoid */}
      <circle cx="100" cy="40" r="30" fill="#DC2626" opacity="0.3" />
      <circle cx="100" cy="40" r="26" fill="#EF4444" />
      
      {/* Traffic light border highlights */}
      <rect x="50" y="10" width="100" height="230" fill="none" stroke="#374151" strokeWidth="3" rx="12" />
      <rect x="52" y="12" width="96" height="226" fill="none" stroke="#6B7280" strokeWidth="1" rx="11" opacity="0.3" />
      
      {/* Decorative elements */}
      <g opacity="0.5">
        {/* Left sparkle */}
        <circle cx="30" cy="60" r="2" fill="#FCD34D" />
        <circle cx="35" cy="80" r="1.5" fill="#FCD34D" />
        {/* Right sparkle */}
        <circle cx="170" cy="140" r="2" fill="#FCD34D" />
        <circle cx="165" cy="160" r="1.5" fill="#FCD34D" />
      </g>
    </svg>
  );
}