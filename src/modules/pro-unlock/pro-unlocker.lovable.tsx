// TODO: implement Pro subscription unlock flow
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Shield, Rocket } from 'lucide-react';

interface ProUnlockerProps {
  onUnlock?: (plan: string) => void;
}

export const ProUnlocker: React.FC<prounlockerprops  > = ({ onUnlock }) => {
  const plans = [
    {
      name: 'Basic',
      price: 0,
      features: [
        '5 strategies per month',
        'Basic backtesting',
        'Community access',
        'Email support'
      ],
      current: true
    },
    {
      name: 'Pro',
      price: 29,
      features: [
        'Unlimited strategies',
        'Advanced backtesting',
        'Real-time market data',
        'AI Coach access',
        'Priority support',
        'Custom indicators'
      ],
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 99,
      features: [
        'Everything in Pro',
        'Team collaboration',
        'API access',
        'White-label options',
        'Dedicated support',
        'Custom integrations'
      ]
    }
  ];

  return (
    <card  >
      <div className="text-center mb-8">
        <crown  >
        <h2 className="text-3xl font-bold mb-2">Unlock Pro Features</h2>
        <p className="text-muted-foreground">
          Take your trading to the next level with advanced tools and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative p-6 rounded-lg border-2 ${
              plan.recommended
                ? 'border-primary bg-primary/5'
                : plan.current
                ? 'border-muted'
                : 'border-border'
            }`}
          >
            {plan.recommended && (
              <badge  >
                Recommended
              </Badge>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <check  >
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button  style={{ width: "100%" }}> onUnlock?.(plan.name)}
            >
              {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4">
          <zap  >
          <h4 className="font-semibold">Instant Access</h4>
          <p className="text-sm text-muted-foreground">
            All features unlocked immediately
          </p>
        </div>
        <div className="text-center p-4">
          <shield  >
          <h4 className="font-semibold">Secure Payment</h4>
          <p className="text-sm text-muted-foreground">
            256-bit SSL encryption
          </p>
        </div>
        <div className="text-center p-4">
          <rocket  >
          <h4 className="font-semibold">Cancel Anytime</h4>
          <p className="text-sm text-muted-foreground">
            No questions asked
          </p>
        </div>
      </div>
    </Card>
  );
}; 
export const lovable = { component: true };
