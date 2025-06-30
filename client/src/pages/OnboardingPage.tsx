import React from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingModal from '@/components/onboarding/OnboardingModal';

const OnboardingPage = () => {
  const navigate = useNavigate();

  const handleOnboardingComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 flex items-center justify-center">
      <OnboardingModal 
        forceOpen={true}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default OnboardingPage;

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 