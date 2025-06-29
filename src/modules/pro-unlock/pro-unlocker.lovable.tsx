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
    <Card style={{ padding: "24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <Crown style={{ marginLeft: "auto", marginRight: "auto", marginBottom: "16px" }} />
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700" }}>Unlock Pro Features</h2>
        <p >
          Take your trading to the next level with advanced tools and insights
        </p>
      </div>

      <div >
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
              <Badge >
                Recommended
              </Badge>
            )}

            <div >
              <h3 style={{ fontWeight: "700" }}>{plan.name}</h3>
              <div style={{ fontSize: "1.875rem", fontWeight: "700" }}>
                ${plan.price}
                <span >/month</span>
              </div>
            </div>

            <ul >
              {plan.features.map((feature, i) => (
                <li key={i} style={{ display: "flex" }}>
                  <span style={{fontSize: '16px'}}>✅</span>
                  <span >{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              style={{ width: "100%" }}
              variant={plan.recommended ? 'default' : 'outline'}
              disabled={plan.current}
              onClick={() => onUnlock?.(plan.name)}
            >
              {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </Button>
          </div>
        ))}
      </div>

      <div >
        <div style={{ padding: "16px" }}>
          <span style={{fontSize: '16px'}}>⚡</span>
          <h4 >Instant Access</h4>
          <p >
            All features unlocked immediately
          </p>
        </div>
        <div style={{ padding: "16px" }}>
          <span style={{fontSize: '16px'}}>🛡️</span>
          <h4 >Secure Payment</h4>
          <p >
            256-bit SSL encryption
          </p>
        </div>
        <div style={{ padding: "16px" }}>
          <Rocket style={{ marginLeft: "auto", marginRight: "auto" }} />
          <h4 >Cancel Anytime</h4>
          <p >
            No questions asked
          </p>
        </div>
      </div>
    </Card>
  );
}; 