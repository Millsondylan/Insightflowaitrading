// TODO: implement Pro subscription unlock flow
import React from 'react';

interface ProUnlockerProps {
  onUnlock?: (plan: string) => void;
}

export const ProUnlocker: React.FC<ProUnlockerProps> = ({ onUnlock }) => {
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
    <Card className="theme-card p-6">
      <div className="text-center mb-8">
        <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
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
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
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
                  <span style={{fontSize: '16px'}}>✅</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={plan.recommended ? 'default' : 'outline'}
              disabled={plan.current}
              onClick={() => onUnlock?.(plan.name)}
            >
              {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4">
          <span style={{fontSize: '16px'}}>⚡</span>
          <h4 className="font-semibold">Instant Access</h4>
          <p className="text-sm text-muted-foreground">
            All features unlocked immediately
          </p>
        </div>
        <div className="text-center p-4">
          <span style={{fontSize: '16px'}}>🛡️</span>
          <h4 className="font-semibold">Secure Payment</h4>
          <p className="text-sm text-muted-foreground">
            256-bit SSL encryption
          </p>
        </div>
        <div className="text-center p-4">
          <Rocket className="h-8 w-8 mx-auto mb-2 text-purple-500" />
          <h4 className="font-semibold">Cancel Anytime</h4>
          <p className="text-sm text-muted-foreground">
            No questions asked
          </p>
        </div>
      </div>
    </Card>
  );
}; 