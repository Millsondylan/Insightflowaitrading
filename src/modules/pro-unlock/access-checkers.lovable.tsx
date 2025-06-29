// TODO: implement access control checkers
import React from 'react';

interface AccessCheckersProps {
  userId?: string;
}

interface AccessStatus {
  feature: string;
  isLocked: boolean;
  requiredPlan: string;
  usage?: {
    current: number;
    limit: number;
  };
}

export const AccessCheckers: React.FC<AccessCheckersProps> = ({ userId }) => {
  const [accessStatus, setAccessStatus] = React.useState<AccessStatus[]>([
    {
      feature: 'AI Strategy Builder',
      isLocked: false,
      requiredPlan: 'Basic',
      usage: { current: 3, limit: 5 }
    },
    {
      feature: 'Advanced Backtesting',
      isLocked: true,
      requiredPlan: 'Pro'
    },
    {
      feature: 'Real-time Market Data',
      isLocked: true,
      requiredPlan: 'Pro'
    },
    {
      feature: 'AI Coach',
      isLocked: true,
      requiredPlan: 'Pro'
    },
    {
      feature: 'Team Collaboration',
      isLocked: true,
      requiredPlan: 'Enterprise'
    },
    {
      feature: 'API Access',
      isLocked: true,
      requiredPlan: 'Enterprise'
    }
  ]);

  const checkAccess = async (feature: string) => {
    // TODO: Connect to verify-promo-wallet function
    console.log(`Checking access for ${feature}`);
  };

  return (
    <Card style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Crown  />
        <h2 style={{ fontWeight: "700" }}>Feature Access</h2>
      </div>

      <div >
        {accessStatus.map((status) => (
          <div
            key={status.feature}
            style={{ padding: "16px", border: "1px solid #374151" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {status.isLocked ? (
                  <span style={{fontSize: '16px'}}>🔒</span>
                ) : (
                  <span style={{fontSize: '16px'}}>🔓</span>
                )}
                <div>
                  <h3 >{status.feature}</h3>
                  <p >
                    Requires {status.requiredPlan} plan
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                {status.usage && !status.isLocked && (
                  <div >
                    <p >
                      {status.usage.current} / {status.usage.limit}
                    </p>
                    <div >
                      <div
                        
                        style={{
                          width: `${(status.usage.current / status.usage.limit) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {status.isLocked ? (
                  <Badge variant="secondary">
                    <span style={{fontSize: '16px'}}>🔒</span>
                    Locked
                  </Badge>
                ) : (
                  <Badge variant="default" >
                    <span style={{fontSize: '16px'}}>🔓</span>
                    Active
                  </Badge>
                )}
              </div>
            </div>

            {status.usage && status.usage.current >= status.usage.limit && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <AlertCircle  />
                <p >
                  You've reached your monthly limit. Upgrade to Pro for unlimited access.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: "16px" }}>
        <p >
          Unlock all features with Pro subscription
        </p>
        <Button style={{ width: "100%" }}>
          Upgrade to Pro
        </Button>
      </div>
    </Card>
  );
}; 