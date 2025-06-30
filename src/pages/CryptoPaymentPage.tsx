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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <navigate to="/login"/>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Upgrade Your Account</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md text-white space-y-4">
              <h2 className="text-xl font-bold">Pro Plan Benefits</div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</ul>
                  Advanced strategy builder
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</li>
                  Unlimited backtests
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</li>
                  AI trade analysis
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</li>
                  Premium indicators
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</li>
                  Priority support
                </li>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-2xl font-bold">$99 / year</div>
                <div className="text-sm text-white/70">or crypto equivalent</div>
              </div>
            </div>
            
            <div className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md text-white space-y-4 mt-6">
              <h2 className="text-xl font-bold">Premium Plan Benefits</div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-purple-400 mr-2">✓</ul>
                  All Pro features
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-2">✓</li>
                  Advanced AI coaching
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-2">✓</li>
                  Custom strategy development
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-2">✓</li>
                  Real-time market alerts
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-2">✓</li>
                  1-on-1 strategy consultation
                </li>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-2xl font-bold">$199 / year</div>
                <div className="text-sm text-white/70">or crypto equivalent</div>
              </div>
            </div>
          </div>
          
          <div>
            <CryptoPayment /></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 