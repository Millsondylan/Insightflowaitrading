// TODO: implement Pro subscription unlock flow
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Shield, Rocket } from 'lucide-react';

interface ProUnlockerProps {
  onUnlock?: (plan: string) => void;
}

export const ProUnlocker: React.FC<Prounlockerprops> = ({ onUnlock }) => {
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
    <Card  />
      <Div className="text-center mb-8">
        <Crown >
        <H2 className="text-3xl font-bold mb-2">Unlock Pro Features</Prounlockerprops>
        <P className="text-muted-foreground">
          Take your trading to the next level with advanced tools and insights
        </P>
      </Div>

      <Div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Div key={plan.name}
            className={`relative p-6 rounded-lg border-2 ${
              plan.recommended
                ? 'border-primary bg-primary/5'
                : plan.current
                ? 'border-muted'
                : 'border-border'
            }`}
          /></Div>
            {plan.recommended && (
              <Badge >
                Recommended
              </Badge>
            )}

            <Div className="text-center mb-6">
              <H3 className="text-xl font-bold mb-2"></Div>{plan.name}</Div>
              <Div className="text-3xl font-bold">
                ${plan.price}
                <Span className="text-sm font-normal text-muted-foreground"></Div>/month</Div>
              </Div>
            </Div>

            <Ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <Li key={i} className="flex items-start gap-2">
                  <check >
                  <Span className="text-sm"></Ul>{feature}</Ul>
                </Li>
              ))}
            </Ul>

            <Button  style={{ width: "100%" }}> onUnlock?.(plan.name)}
            >
              {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </Button>
          </Div>
        ))}
      </Div>

      <Div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Div className="text-center p-4">
          <zap >
          <H4 className="font-semibold"></Div>Instant Access</Div>
          <P className="text-sm text-muted-foreground">
            All features unlocked immediately
          </P>
        </Div>
        <Div className="text-center p-4">
          <shield >
          <H4 className="font-semibold"></Div>Secure Payment</Div>
          <P className="text-sm text-muted-foreground">
            256-bit SSL encryption
          </P>
        </Div>
        <Div className="text-center p-4">
          <rocket >
          <H4 className="font-semibold"></Div>Cancel Anytime</Div>
          <P className="text-sm text-muted-foreground">
            No questions asked
          </P>
        </Div>
      </Div>
    </Card>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
