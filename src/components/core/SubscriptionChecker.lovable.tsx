import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly');
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
      <Card style={{ width: "100%" }}>
        <CardContent >
          <AccessStatus 
            status={verificationStatus} 
            plan={selectedPlan}
            expiryDate={expiryDate || undefined}
            message={statusMessage || undefined}
            onAnimationComplete={verificationStatus === 'failure' ? resetVerification : undefined}
          />

          {verificationStatus === 'failure' && (
            <div >
              <Button onClick={resetVerification}>Try Again</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ width: "100%" }}>
      <CardHeader>
        <CardTitle>Select Your Subscription Plan</CardTitle>
        <CardDescription>Choose a plan and payment method to unlock premium features</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div >
          {/* Plan Selection */}
          <div>
            <h3 style={{ marginBottom: "16px" }}>Step 1: Choose Your Plan</h3>
            <div >
              {SUBSCRIPTION_PLANS.map(plan => (
                <Card 
                  key={plan.id}
                  onClick={() => handlePlanChange(plan.id)}
                  className={`relative cursor-pointer transition-all duration-200 border-2 ${
                    selectedPlan === plan.id 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {plan.popular && (
                    <div style={{ color: "white" }}>
                      Popular
                    </div>
                  )}
                  <CardHeader >
                    <CardTitle>{plan.name}</CardTitle>
                    <div style={{ fontWeight: "700", color: "white" }}>${plan.priceUSD}</div>
                  </CardHeader>
                  <CardContent style={{ color: "#9CA3AF" }}>
                    <p >{plan.description}</p>
                    <ul >
                      {plan.features.map((feature, idx) => (
                        <li key={idx} style={{ display: "flex" }}>
                          <ArrowRight  />
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
            <h3 style={{ marginBottom: "16px" }}>Step 2: Select Payment Method</h3>
            <div >
              <Select value={selectedChain} onValueChange={handleChainChange}>
                <SelectTrigger style={{ width: "100%" }}>
                  <SelectValue placeholder="Select Chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Crypto Network</SelectLabel>
                    <SelectItem value="ETH">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <CircleDollarSign  />
                        <span>Ethereum (ERC20)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="BTC">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Bitcoin  />
                        <span>Bitcoin</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="TRX">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{fontSize: '16px'}}>💰</span>
                        <span>TRON (USDT)</span>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Payment Instructions */}
              <div style={{ border: "1px solid #374151", padding: "16px" }}>
                <div style={{ display: "flex", marginBottom: "16px" }}>
                  <div>
                    <h4 >Send Payment</h4>
                    <p style={{ color: "#9CA3AF" }}>
                      Send exactly {cryptoAmount} {chain?.ticker || ''} to the address below
                    </p>
                  </div>
                  <div >
                    <div style={{ color: "#9CA3AF" }}>Amount</div>
                    <div style={{ fontWeight: "700" }}>
                      {cryptoAmount} {chain?.ticker || ''}
                    </div>
                    <div style={{ color: "#9CA3AF" }}>(${plan?.priceUSD})</div>
                  </div>
                </div>

                {/* Address Display */}
                <div style={{ border: "1px solid #374151", display: "flex", alignItems: "center" }}>
                  <div >
                    {walletAddress || 'Select a chain'}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button 
                      onClick={handleCopyAddress} 
                      style={{ color: "#9CA3AF" }}
                    >
                      <Copy  />
                    </button>
                    <button 
                      onClick={() => toast({
                        title: "QR Code",
                        description: "Scan this code to make your payment",
                        action: (
                          <div style={{ padding: "16px" }}>
                            <QRCodeSVG value={walletAddress || ''} size={150} />
                          </div>
                        )
                      })} 
                      style={{ color: "#9CA3AF" }}
                    >
                      <QrCode  />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Verification */}
          <div>
            <h3 style={{ marginBottom: "16px" }}>Step 3: Verify Payment</h3>
            <div >
              <div>
                <label htmlFor="txHash" style={{ color: "#9CA3AF" }}>
                  After payment, paste the transaction hash (TX ID) below to verify
                </label>
                <Input 
                  id="txHash"
                  value={txHash}
                  onChange={handleTxHashChange}
                  placeholder={`Enter ${selectedChain} transaction hash...`}
                  
                />
              </div>
              
              <Button
                onClick={handleVerifyTransaction}
                disabled={!txHash.trim() || loading}
                style={{ width: "100%" }}
              >
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