import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Bitcoin, CircleDollarSign, DollarSign, QrCode, Copy, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { SUPPORTED_CHAINS } from '@/lib/wallet/chains';
import { convertUSDToCrypto } from '@/lib/subscription/convertUSDToCrypto';
import { SUBSCRIPTION_PLANS, PlanType } from '@/lib/subscription/subscriptionPlans';
import { verifyTransaction } from '@/lib/subscription/verifyTx';
import { savePayment } from '@/lib/subscription/savePayment';
import AccessStatus from '@/components/ui/AccessStatus';
import { WALLET_ADDRESSES } from '@/lib/config';
import { supabase } from '@/integrations/supabase/client';

// Mock user ID for demo purposes
const MOCK_USER_ID = 'current-user-id';

const SubscriptionChecker: React.FC = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<planType>('monthly');
  const [selectedChain, setSelectedChain] = useState<string>('ETH');
  const [txHash, setTxHash] = useState<string>('');
  const [cryptoAmount, setCryptoAmount] = useState<number | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failure' | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

  // Get the selected plan and chain details
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);
  const chain = SUPPORTED_CHAINS[selectedChain];
  const walletAddress = getWalletAddress(selectedChain);

  // Fetch the crypto amount when plan or chain changes
  useEffect(() => {
    if (plan && chain) {
      fetchCryptoAmount();
    }
  }, [selectedPlan, selectedChain]);

  // Fetch user subscription status on mount
  useEffect(() => {
    fetchUserSubscription();
  }, []);

  const fetchUserSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_end')
        .eq('id', MOCK_USER_ID)
        .single();

      if (error) throw error;

      if (data && data.subscription_end) {
        const endDate = new Date(data.subscription_end);
        const now = new Date();
        
        if (endDate > now && data.subscription_tier) {
          setVerificationStatus('success');
          setSelectedPlan(data.subscription_tier as PlanType);
          setExpiryDate(data.subscription_end);
          setStatusMessage('You already have an active subscription');
        }
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    }
  };

  const fetchCryptoAmount = async () => {
    if (!plan || !chain) return;

    try {
      const amount = await convertUSDToCrypto(plan.priceUSD, chain.ticker);
      setCryptoAmount(amount);
    } catch (error) {
      console.error('Error converting USD to crypto:', error);
      setCryptoAmount(null);
    }
  };

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value as PlanType);
  };

  const handleChainChange = (value: string) => {
    setSelectedChain(value);
  };

  const handleTxHashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTxHash(e.target.value);
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: 'Address Copied!',
        description: `${walletAddress.substring(0, 12)}...${walletAddress.substring(walletAddress.length - 6)}`,
      });
    }
  };

  const handleVerifyTransaction = async () => {
    if (!plan || !chain || !txHash.trim()) {
      toast({
        variant: 'destructive',
        title: 'Required Fields Missing',
        description: 'Please select a plan, chain, and enter a transaction hash.',
      });
      return;
    }

    setLoading(true);
    setVerificationStatus('pending');
    setStatusMessage('Verifying your transaction...');

    try {
      const result = await verifyTransaction(txHash, selectedChain, selectedPlan);

      if (result.success) {
        // Save the payment to Supabase
        await savePayment(MOCK_USER_ID, {
          plan: selectedPlan, 
          chain: selectedChain,
          txResult: result
        });

        setVerificationStatus('success');
        setStatusMessage('Your payment was verified successfully!');
        setExpiryDate(new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString());

        toast({
          title: 'Payment Verified!',
          description: `Your ${plan.name} plan is now active.`,
        });
      } else {
        setVerificationStatus('failure');
        setStatusMessage(result.message || 'Transaction verification failed.');

        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: result.message || 'We could not verify your payment. Please check your transaction hash.',
        });
      }
    } catch (error: any) {
      setVerificationStatus('failure');
      setStatusMessage(error.message || 'An error occurred during verification.');

      toast({
        variant: 'destructive',
        title: 'Verification Error',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetVerification = () => {
    setVerificationStatus(null);
    setStatusMessage(null);
    setTxHash('');
  };

  // Helper function to get wallet address based on chain
  function getWalletAddress(chainId: string): string | undefined {
    if (chainId === 'ETH') return WALLET_ADDRESSES.eth;
    if (chainId === 'BTC') return WALLET_ADDRESSES.btc;
    if (chainId === 'TRX') return WALLET_ADDRESSES.usdt;
    return undefined;
  }

  // If we're showing a verification status
  if (verificationStatus) {
    return (
      <Card className="w-full" />
        <CardContent className="pt-6" />
          <accessStatus 
            status={verificationStatus} 
            plan={selectedPlan}
            expiryDate={expiryDate || undefined}
            message={statusMessage || undefined}
            onAnimationComplete={verificationStatus === 'failure' ? resetVerification : undefined}
          />

          {verificationStatus === 'failure' && (
            <Div className="mt-6 text-center">
              <Button onClick={resetVerification}>Try Again</HTMLInputElement>
            </Div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full" />
      <CardHeader>
        <CardTitle>Select Your Subscription Plan</Card>
        <CardDescription>Choose a plan and payment method to unlock premium features</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Div className="space-y-6">
          {/* Plan Selection */}
          <Div>
            <H3 className="text-lg font-medium mb-4">Step 1: Choose Your Plan</CardContent>
            <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUBSCRIPTION_PLANS.map(plan => (
                <Card key={plan.id}
                  onClick={() = /> handlePlanChange(plan.id)}
                  className={`relative cursor-pointer transition-all duration-200 border-2 ${
                    selectedPlan === plan.id 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {plan.popular && (
                    <Div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs py-1 px-3 rounded-full">
                      Popular
                    </Div>
                  )}
                  <CardHeader className="pb-3" />
                    <CardTitle>{plan.name}</CardHeader>
                    <Div className="text-2xl font-bold text-white">${plan.priceUSD}</Div>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400" />
                    <P className="mb-2">{plan.description}</CardContent>
                    <Ul className="space-y-1">
                      {plan.features.map((feature, idx) => (
                        <Li key={idx} className="flex items-start">
                          <arrowRight className="h-4 w-4 mr-2 mt-0.5 text-blue-400" />
                          {feature}
                        </Ul>
                      ))}
                    </Ul>
                  </CardContent>
                </Card>
              ))}
            </Div>
          </Div>

          {/* Payment Selection */}
          <Div>
            <H3 className="text-lg font-medium mb-4">Step 2: Select Payment Method</Div>
            <Div className="space-y-4">
              <Select value={selectedChain} onValueChange={handleChainChange}>
                <selectTrigger className="w-full sm:w-[240px]">
                  <selectValue placeholder="Select Chain" />
                </Div>
                <selectContent>
                  <selectGroup>
                    <selectLabel>Crypto Network</SelectLabel>
                    <selectItem value="ETH">
                      <Div className="flex items-center">
                        <CircleDollarSign className="mr-2 h-4 w-4" />
                        <Span>Ethereum (ERC20)</Div>
                      </Div>
                    </SelectItem>
                    <selectItem value="BTC">
                      <Div className="flex items-center">
                        <bitcoin className="mr-2 h-4 w-4" />
                        <Span>Bitcoin</Div>
                      </Div>
                    </SelectItem>
                    <selectItem value="TRX">
                      <Div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        <Span>TRON (USDT)</Div>
                      </Div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Payment Instructions */}
              <Div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
                <Div className="flex justify-between items-start mb-4">
                  <Div>
                    <H4 className="font-medium mb-1">Send Payment</Div>
                    <P className="text-sm text-gray-400">
                      Send exactly {cryptoAmount} {chain?.ticker || ''} to the address below
                    </P>
                  </Div>
                  <Div className="text-right">
                    <Div className="text-sm text-gray-400">Amount</Div>
                    <Div className="font-bold text-lg">
                      {cryptoAmount} {chain?.ticker || ''}
                    </Div>
                    <Div className="text-sm text-gray-400">(${plan?.priceUSD})</Div>
                  </Div>
                </Div>

                {/* Address Display */}
                <Div className="p-3 bg-black/30 rounded border border-gray-700/50 flex justify-between items-center">
                  <Div className="font-mono text-sm text-gray-300 truncate">
                    {walletAddress || 'Select a chain'}
                  </Div>
                  <Div className="flex items-center space-x-2">
                    <Button onClick={handleCopyAddress} 
                      className="p-1 hover:text-white text-gray-400 transition-colors"
                >
                      <Copy className="h-4 w-4" />
                    </Div>
                    <Button onClick={() = /> toast({
                        title: "QR Code",
                        description: "Scan this code to make your payment",
                        action: (
                          <Div className="p-4 bg-white rounded-lg">
                            <QrCodeSVG value={walletAddress || ''} size={150} />
                          </Button>
                        )
                      })} 
                      className="p-1 hover:text-white text-gray-400 transition-colors"
                    >
                      <QrCode className="h-4 w-4" />
                    </QrCode>
                  </Div>
                </Div>
              </Div>
            </Div>
          </Div>

          {/* Transaction Verification */}
          <Div>
            <H3 className="text-lg font-medium mb-4">Step 3: Verify Payment</Div>
            <Div className="space-y-4">
              <Div>
                <Label htmlFor="txHash" className="text-sm text-gray-400 mb-2 block">
                  After payment, paste the transaction hash (TX ID) below to verify
                </Div>
                <Input 
                  id="txHash"
                  value={txHash}
                  onChange={handleTxHashChange}
                  placeholder={`Enter ${selectedChain} transaction hash...`}
                  className="bg-gray-800/50 border-gray-700"
                />
              </Input>
              
              <Button onClick={handleVerifyTransaction}
                disabled={!txHash.trim() || loading}
                className="w-full"
              />
                {loading ? 'Verifying...' : 'Verify Payment'}
              </Button>
            </Div>
          </Div>
        </Div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionChecker;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 