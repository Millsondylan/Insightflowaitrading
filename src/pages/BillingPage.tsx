import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth.tsx';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Bitcoin, 
  Wallet, 
  CreditCard, 
  Clock, 
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react';
import CryptoPayment from '@/components/wallet/CryptoPayment';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

interface Transaction {
  id: string;
  amount: string;
  cryptocurrency: string;
  status: string;
  created_at: string;
  tx_hash: string;
}

const plans: Plan[] = [
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 49,
    duration: 'per month',
    features: [
      'Unlimited AI suggestions',
      'Unlimited backtests',
      'Voice chat rooms',
      '50 saved strategies',
      'Priority support',
      'Custom indicators'
    ],
    popular: true
  },
  {
    id: 'quarterly',
    name: 'Pro Quarterly',
    price: 129,
    duration: 'per 3 months',
    features: [
      'Everything in monthly',
      'Save $18 (12% off)',
      'Quarterly strategy reviews',
      'Early access features'
    ]
  },
  {
    id: 'yearly',
    name: 'Pro Yearly',
    price: 399,
    duration: 'per year',
    features: [
      'Everything in quarterly',
      'Save $189 (32% off)',
      '1-on-1 coaching session',
      'API access',
      'Custom integrations'
    ]
  }
];

export default function BillingPage() {
  const { user, profile, hasProAccess } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    setShowPayment(false);
    setSelectedPlan(null);
    fetchTransactions();
    toast({
      title: "Payment successful!",
      description: "Your subscription has been activated.",
    });
  };

  const cancelSubscription = async () => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user?.id)
        .eq('status', 'active');

      if (error) throw error;

      toast({
        title: "Subscription cancelled",
        description: "Your subscription will remain active until the end of the billing period.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and payment methods
        </p>
      </div>

      {showPayment && selectedPlan ? (
        <CryptoPayment
          plan={selectedPlan}
          onComplete={handlePaymentComplete}
          onCancel={() => setShowPayment(false)}
        />
      ) : (
        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList>
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="manage">Manage Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`relative ${plan.popular ? 'border-primary scale-105' : ''}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleSelectPlan(plan)}
                      disabled={hasProAccess}
                    >
                      {hasProAccess ? 'Current Plan' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Your recent transactions and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : transactions.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No transactions yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div 
                        key={tx.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <Bitcoin className="h-8 w-8 text-orange-500" />
                          <div>
                            <p className="font-medium">
                              {tx.amount} {tx.cryptocurrency}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {tx.status === 'confirmed' ? (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Confirmed
                            </Badge>
                          ) : tx.status === 'pending' ? (
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`https://etherscan.io/tx/${tx.tx_hash}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>
                  Manage your active subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {hasProAccess ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Status</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Plan</span>
                        <span>{profile?.subscription_tier || 'Pro'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Expires</span>
                        <span>
                          {profile?.subscription_end 
                            ? new Date(profile.subscription_end).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Button 
                        variant="destructive"
                        onClick={cancelSubscription}
                        className="w-full"
                      >
                        Cancel Subscription
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        You'll keep access until the end of your billing period
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">No active subscription</p>
                    <p className="text-muted-foreground mb-4">
                      Choose a plan to unlock all features
                    </p>
                    <Button onClick={() => {
                      const tabsList = document.querySelector('[value="plans"]') as HTMLButtonElement;
                      tabsList?.click();
                    }}>
                      View Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 