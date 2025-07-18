import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentHead from '@/components/core/DocumentHead';

export default function PricingPage() {
  const navigate = useNavigate();
  
  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      billing: '',
      description: 'Basic trading insights to get you started',
      features: [
        'Basic market indicators',
        'Limited backtesting (5 per day)',
        'Manual trade journal',
        'Community forum access',
      ],
      buttonText: 'Get Started',
      buttonAction: () => navigate('/register'),
      highlight: false,
    },
    {
      name: 'Pro',
      price: '99',
      billing: '/year',
      description: 'Advanced tools for serious traders',
      features: [
        'All Free features',
        'Unlimited backtesting',
        'AI trading insights',
        'Strategy builder',
        'Pattern recognition AI',
        'Custom indicators',
        'Real-time alerts',
      ],
      buttonText: 'Upgrade to Pro',
      buttonAction: () => navigate('/crypto-payment'),
      highlight: true,
    },
    {
      name: 'Premium',
      price: '199',
      billing: '/year',
      description: 'The ultimate AI trading companion',
      features: [
        'All Pro features',
        'Advanced AI coaching',
        'Custom strategy development',
        'Real-time market alerts',
        '1-on-1 strategy consultation',
        'Priority support',
        'Early access to new features',
      ],
      buttonText: 'Get Premium',
      buttonAction: () => navigate('/crypto-payment'),
      highlight: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <DocumentHead 
        title="Pricing Plans" 
        description="Choose the perfect plan for your trading needs. Unlock advanced AI tools, unlimited backtesting, and more."
        ogType="website"
      />
      
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-white">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Choose the plan that's right for your trading journey. All plans include our core platform features.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <Card key={index} 
            className={`bg-black/30 border-white/10 backdrop-blur-md text-white ${
              plan.highlight ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : ''
            }`}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {plan.name}
                {plan.highlight && (
                  <span className="ml-2 text-xs px-2 py-1 bg-blue-500 text-white rounded-full">
                    Most Popular
                  </span>
                )}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-400">{plan.billing}</span>
              </div>
              <p className="text-gray-400 mt-2">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3"/>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className={`w-full ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                    : 'bg-transparent border border-white/20 hover:bg-white/10'
                }`}
                onClick={plan.buttonAction}>
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-6 text-white">Cryptocurrency Payments Accepted</h2>
        <div className="flex justify-center space-x-8">
          <div className="flex flex-col items-center">
            <img src="/bitcoin.svg" alt="Bitcoin" className="h-12 w-12 mb-2"/>
            <span className="text-gray-400">Bitcoin</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/ethereum.svg" alt="Ethereum" className="h-12 w-12 mb-2"/>
            <span className="text-gray-400">Ethereum</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/tether.svg" alt="USDT" className="h-12 w-12 mb-2"/>
            <span className="text-gray-400">USDT</span>
          </div>
        </div>
        
        <p className="mt-8 text-gray-400 max-w-xl mx-auto">
          Secure transactions verified on the blockchain. All subscriptions are automatically activated upon payment confirmation.
        </p>
        
        <Button variant="outline"
          className="mt-6"
          onClick={() => navigate('/faq#payment')}>
          Payment FAQ
        </Button>
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