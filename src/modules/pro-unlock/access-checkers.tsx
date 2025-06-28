// TODO: implement access control checkers
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, Crown, AlertCircle } from 'lucide-react';

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
    <Card className="theme-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Feature Access</h2>
      </div>

      <div className="space-y-4">
        {accessStatus.map((status) => (
          <div
            key={status.feature}
            className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {status.isLocked ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Unlock className="h-5 w-5 text-green-500" />
                )}
                <div>
                  <h3 className="font-semibold">{status.feature}</h3>
                  <p className="text-sm text-muted-foreground">
                    Requires {status.requiredPlan} plan
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {status.usage && !status.isLocked && (
                  <div className="text-right mr-4">
                    <p className="text-sm font-medium">
                      {status.usage.current} / {status.usage.limit}
                    </p>
                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{
                          width: `${(status.usage.current / status.usage.limit) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {status.isLocked ? (
                  <Badge variant="secondary">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                ) : (
                  <Badge variant="default" className="bg-green-500/20 text-green-500">
                    <Unlock className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </div>

            {status.usage && status.usage.current >= status.usage.limit && (
              <div className="mt-3 p-2 bg-yellow-500/10 rounded flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <p className="text-sm text-yellow-600">
                  You've reached your monthly limit. Upgrade to Pro for unlimited access.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
        <p className="text-sm text-muted-foreground mb-3">
          Unlock all features with Pro subscription
        </p>
        <Button className="w-full">
          Upgrade to Pro
        </Button>
      </div>
    </Card>
  );
}; 