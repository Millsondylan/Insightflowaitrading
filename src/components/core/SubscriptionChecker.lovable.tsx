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
  const [selectedPlan, setSelectedPlan] = useState<plantype  >('monthly');
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

  const handleTxHashChange = (e: React.ChangeEvent<htmlinputelement  >) => {
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
      <card  style={{ width: "100%" }}>
        <cardcontent  >
          <accessstatus  >

          {verificationStatus === 'failure' && (
            <div className="mt-6 text-center">
              <button  >Try Again</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <card  style={{ width: "100%" }}>
      <cardheader  >
        <cardtitle  >Select Your Subscription Plan</CardTitle>
        <carddescription  >Choose a plan and payment method to unlock premium features</CardDescription>
      </CardHeader>
      
      <cardcontent  >
        <div className="space-y-6">
          {/* Plan Selection */}
          <div>
            <h3 className="text-lg font-medium mb-4">Step 1: Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUBSCRIPTION_PLANS.map(plan => (
                <card  > handlePlanChange(plan.id)}
                  className={`relative cursor-pointer transition-all duration-200 border-2 ${
                    selectedPlan === plan.id 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs py-1 px-3 rounded-full">
                      Popular
                    </div>
                  )}
                  <cardheader  >
                    <cardtitle  >{plan.name}</CardTitle>
                    <div className="text-2xl font-bold text-white">${plan.priceUSD}</div>
                  </CardHeader>
                  <cardcontent  style={{ fontSize: "0.875rem" }}>
                    <p className="mb-2">{plan.description}</p>
                    <ul className="space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <arrowright  >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Selection */}
          <div>
            <h3 className="text-lg font-medium mb-4">Step 2: Select Payment Method</h3>
            <div className="space-y-4">
              <select  >
                <selecttrigger  style={{ width: "100%" }}>
                  <selectvalue placeholder="Select Chain" >
                </SelectTrigger>
                <selectcontent  >
                  <selectgroup  >
                    <selectlabel  >Crypto Network</SelectLabel>
                    <selectitem value="ETH" >
                      <div className="flex items-center">
                        <circledollarsign  >
                        <span>Ethereum (ERC20)</span>
                      </div>
                    </SelectItem>
                    <selectitem value="BTC" >
                      <div className="flex items-center">
                        <bitcoin  >
                        <span>Bitcoin</span>
                      </div>
                    </SelectItem>
                    <selectitem value="TRX" >
                      <div className="flex items-center">
                        <dollarsign  >
                        <span>TRON (USDT)</span>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Payment Instructions */}
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium mb-1">Send Payment</h4>
                    <p className="text-sm text-gray-400">
                      Send exactly {cryptoAmount} {chain?.ticker || ''} to the address below
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Amount</div>
                    <div className="font-bold text-lg">
                      {cryptoAmount} {chain?.ticker || ''}
                    </div>
                    <div className="text-sm text-gray-400">(${plan?.priceUSD})</div>
                  </div>
                </div>

                {/* Address Display */}
                <div className="p-3 bg-black/30 rounded border border-gray-700/50 flex justify-between items-center">
                  <div className="font-mono text-sm text-gray-300 truncate">
                    {walletAddress || 'Select a chain'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleCopyAddress} 
                      className="p-1 hover:text-white text-gray-400 transition-colors"
                    >
                      <copy  >
                    </button>
                    <button 
                      onClick={() => toast({
                        title: "QR Code",
                        description: "Scan this code to make your payment",
                        action: (
                          <div className="p-4 bg-white rounded-lg">
                            <qrcodesvg  >
                          </div>
                        )
                      })} 
                      className="p-1 hover:text-white text-gray-400 transition-colors"
                    >
                      <qrcode  >
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Verification */}
          <div>
            <h3 className="text-lg font-medium mb-4">Step 3: Verify Payment</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="txHash" className="text-sm text-gray-400 mb-2 block">
                  After payment, paste the transaction hash (TX ID) below to verify
                </label>
                <input id="txHash" >
              </div>
              
              <button  style={{ width: "100%" }}>
                {loading ? 'Verifying...' : 'Verify Payment'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionChecker; 
export const lovable = { component: true };
