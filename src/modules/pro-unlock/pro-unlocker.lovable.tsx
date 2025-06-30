// TODO: implement Pro subscription unlock flow
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Shield, Rocket } from 'lucide-react';

interface ProUnlockerProps {
  onUnlock?: (plan: string) => void;
}

export const ProUnlocker: React.FC<prounlockerprops> = ({ onUnlock }) => {
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
    <Card />
      <div className="text-center mb-8">
        <Crown >
        <h2 className="text-3xl font-bold mb-2">Unlock Pro Features</Card>
        <p className="text-muted-foreground">
          Take your trading to the next level with advanced tools and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name}
            className={`relative p-6 rounded-lg border-2 ${
              plan.recommended
                ? 'border-primary bg-primary/5'
                : plan.current
                ? 'border-muted'
                : 'border-border'
            }`}/></div>
            {plan.recommended && (
              <Badge >
                Recommended
              </Badge>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2"></div>{plan.name}</div>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground"></div>/month</div>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check >
                  <span className="text-sm"/></Ul /></Ul />{feature}</Ul />
              ))}
            </ul>

            <Button  style={{ width: "100%" }}> onUnlock?.(plan.name)}
            >
              {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4">
          <zap >
          <h4 className="font-semibold"></div>Instant Access</div>
          <p className="text-sm text-muted-foreground">
            All features unlocked immediately
          </p>
        </div>
        <div className="text-center p-4">
          <Shield >
          <h4 className="font-semibold"></div>Secure Payment</div>
          <p className="text-sm text-muted-foreground">
            256-bit SSL encryption
          </p>
        </div>
        <div className="text-center p-4">
          <rocket >
          <h4 className="font-semibold"></div>Cancel Anytime</div>
          <p className="text-sm text-muted-foreground">
            No questions asked
          </p>
        </div>
      </div />
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
