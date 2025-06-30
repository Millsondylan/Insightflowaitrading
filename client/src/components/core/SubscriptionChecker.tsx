
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface SubscriptionCheckerProps {
  userPlan?: 'free' | 'pro' | 'premium';
  onUpgrade?: () => void;
}

const SubscriptionChecker: React.FC<SubscriptionCheckerProps> = ({ 
  userPlan = 'free', 
  onUpgrade 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const plans = {
    free: {
      name: 'Free',
      price: '$0',
      features: ['Basic features', 'Limited access']
    },
    pro: {
      name: 'Pro',
      price: '$19',
      features: ['Advanced features', 'Priority support', 'Unlimited access']
    },
    premium: {
      name: 'Premium',
      price: '$49',
      features: ['All Pro features', 'Custom integrations', 'Dedicated support']
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white capitalize">{userPlan}</h3>
              <p className="text-white/60">Your current subscription plan</p>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Upgrade Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Choose a Plan</h3>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="bg-black/30 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10">
                <SelectGroup>
                  <SelectLabel className="text-white/60">Available Plans</SelectLabel>
                  {Object.entries(plans).map(([key, plan]) => (
                    <SelectItem key={key} value={key} className="text-white">
                      <span className="font-medium">{plan.name}</span>
                      <span className="ml-2 text-white/60">{plan.price}/month</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-white">Plan Features</h4>
            <ul className="space-y-1">
              {plans[selectedPlan as keyof typeof plans]?.features.map((feature, index) => (
                <li key={index} className="flex items-center text-white/80">
                  <Check className="h-4 w-4 text-green-400 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-white">
              <span className="text-2xl font-bold">
                {plans[selectedPlan as keyof typeof plans]?.price}
              </span>
              <span className="text-white/60">/month</span>
            </div>
            <Button 
              onClick={onUpgrade}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Billing Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <input
                id="email"
                type="email"
                className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionChecker;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
