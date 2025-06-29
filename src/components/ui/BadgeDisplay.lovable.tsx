import React, { useState, useEffect } from 'react';

type Props = {
  badgeName: string;
  description: string;
  icon?: string;
  onClaim?: () => void;
};

const BadgeDisplay = ({ badgeName, description, icon, onClaim }: Props) => {
  const [isClaimed, setIsClaimed] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  
  useEffect(() => {
    // Trigger animation shortly after component mounts
    const timer = setTimeout(() => setIsRendered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClaim = () => {
    if (onClaim) {
      onClaim();
    }
    setIsClaimed(true);
    // You could trigger confetti here
  };

  const animationClasses = isRendered 
    ? 'opacity-100 scale-100 translate-y-0' 
    : 'opacity-0 scale-95 translate-y-2';

  return (
    <div 
      className={`rounded-xl bg-gradient-to-br from-cyan-700 via-indigo-800 to-purple-900 p-6 text-white shadow-lg space-y-3 transition-all duration-500 ease-out transform ${animationClasses}`}
    >
      <div >{icon || '🏅'}</div>
      <h2 style={{ fontWeight: "700" }}>{badgeName}</h2>
      <p >{description}</p>
      {onClaim && !isClaimed && (
        <button 
          onClick={handleClaim} 
          
        >
          🎉 Claim Badge
        </button>
      )}
      {isClaimed && (
        <div style={{ fontWeight: "700" }}>
            ✅ Claimed!
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay; 