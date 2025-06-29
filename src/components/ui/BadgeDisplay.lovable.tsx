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
    <Div className={`rounded-xl bg-gradient-to-br from-cyan-700 via-indigo-800 to-purple-900 p-6 text-white shadow-lg space-y-3 transition-all duration-500 ease-out transform ${animationClasses}`}>
      <Div className="text-5xl drop-shadow-lg">{icon || '🏅'}</Div>
      <H2 className="text-2xl font-bold">{badgeName}</H2>
      <P className="text-white/80 text-sm">{description}</P>
      {onClaim && !isClaimed && (
        <Button onClick={handleClaim} 
          className="mt-2 bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full font-semibold transition-transform transform hover:scale-105"
        />
          🎉 Claim Badge
        </Button>
      )}
      {isClaimed && (
        <Div className="mt-2 text-green-300 font-bold px-6 py-2">
            ✅ Claimed!
        </Div>
      )}
    </Div>
  );
};

export default BadgeDisplay; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
