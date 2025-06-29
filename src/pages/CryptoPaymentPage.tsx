import React, { useState, useEffect } from 'react';
import CryptoPayment from '@/components/wallet/CryptoPayment';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

export default function CryptoPaymentPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading state for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Div className="flex items-center justify-center min-h-screen">
        <Div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></Div>
      </Div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Div className="container mx-auto px-4 py-8">
      <Div className="max-w-4xl mx-auto">
        <H1 className="text-3xl font-bold mb-8 text-white">Upgrade Your Account</Navigate>
        
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Div>
            <Div className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md text-white space-y-4">
              <H2 className="text-xl font-bold">Pro Plan Benefits</Div>
              <Ul className="space-y-2">
                <Li className="flex items-center">
                  <Span className="text-green-400 mr-2">✓</Ul>
                  Advanced strategy builder
                </Li>
                <Li className="flex items-center">
                  <Span className="text-green-400 mr-2">✓</Li>
                  Unlimited backtests
                </Li>
                <Li className="flex items-center">
                  <Span className="text-green-400 mr-2">✓</Li>
                  AI trade analysis
                </Li>
                <Li className="flex items-center">
                  <Span className="text-green-400 mr-2">✓</Li>
                  Premium indicators
                </Li>
                <Li className="flex items-center">
                  <Span className="text-green-400 mr-2">✓</Li>
                  Priority support
                </Li />
              
              <Div className="mt-4 pt-4 border-t border-white/10">
                <Div className="text-2xl font-bold">$99 / year</Div>
                <Div className="text-sm text-white/70">or crypto equivalent</Div>
              </Div>
            </Div>
            
            <Div className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md text-white space-y-4 mt-6">
              <H2 className="text-xl font-bold">Premium Plan Benefits</Div>
              <Ul className="space-y-2">
                <Li className="flex items-center">
                  <Span className="text-purple-400 mr-2">✓</Ul>
                  All Pro features
                </Li>
                <Li className="flex items-center">
                  <Span className="text-purple-400 mr-2">✓</Li>
                  Advanced AI coaching
                </Li>
                <Li className="flex items-center">
                  <Span className="text-purple-400 mr-2">✓</Li>
                  Custom strategy development
                </Li>
                <Li className="flex items-center">
                  <Span className="text-purple-400 mr-2">✓</Li>
                  Real-time market alerts
                </Li>
                <Li className="flex items-center">
                  <Span className="text-purple-400 mr-2">✓</Li>
                  1-on-1 strategy consultation
                </Li />
              
              <Div className="mt-4 pt-4 border-t border-white/10">
                <Div className="text-2xl font-bold">$199 / year</Div>
                <Div className="text-sm text-white/70">or crypto equivalent</Div>
              </Div>
            </Div>
          </Div>
          
          <Div>
            <CryptoPayment /></Div></Div></Div></Div></Div></Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 