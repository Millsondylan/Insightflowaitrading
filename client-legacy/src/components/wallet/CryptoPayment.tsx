import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Loader2, Copy, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/db/supabase-client";

const WALLET_ADDRESSES = {
  BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  USDT_ERC20: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  USDT_TRC20: "TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYNub",
};

const TX_HASH_PATTERNS = {
  BTC: /^[a-fA-F0-9]{64}$/,
  ETH: /^0x([A-Fa-f0-9]{64})$/,
  USDT_ERC20: /^0x([A-Fa-f0-9]{64})$/,
  USDT_TRC20: /^[a-fA-F0-9]{64}$/,
};

interface PaymentStatus {
  confirmations: number;
  required_confirmations: number;
  status: 'pending' | 'confirmed' | 'failed' | null;
  timestamp: string | null;
  amount: string | null;
}

interface CryptoPaymentProps {
  plan?: {
    id: string;
    name: string;
    price: number;
    duration: string;
  };
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function CryptoPayment({ plan, onComplete, onCancel }: CryptoPaymentProps) {
  const { user } = useAuth();
  const [selectedCrypto, setSelectedCrypto] = useState<keyof typeof WALLET_ADDRESSES>("ETH");
  const [txHash, setTxHash] = useState("");
  const [txHashError, setTxHashError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string>("pro");

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESSES[selectedCrypto]);
    toast({
      title: "Address Copied!",
      description: "Wallet address copied to clipboard",
      duration: 2000,
    });
  };

  const validateTxHash = (hash: string): boolean => {
    if (!hash) {
      setTxHashError("Transaction hash is required");
      return false;
    }

    const pattern = TX_HASH_PATTERNS[selectedCrypto];
    if (!pattern.test(hash)) {
      setTxHashError(`Invalid ${selectedCrypto} transaction hash format`);
      return false;
    }

    setTxHashError("");
    return true;
  };

  const handleTxHashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hash = e.target.value;
    setTxHash(hash);
    if (hash) validateTxHash(hash);
  };

  const verifyPayment = async () => {
    if (!validateTxHash(txHash) || !user) return;

    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-crypto-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          txHash,
          cryptocurrency: selectedCrypto,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify payment');
      }

      const data = await response.json();
      setPaymentStatus({
        confirmations: data.confirmations,
        required_confirmations: data.required_confirmations,
        status: data.status,
        timestamp: data.timestamp,
        amount: data.amount,
      });

      if (data.status === 'confirmed') {
        toast({
          title: "Payment Verified!",
          description: "Your transaction has been confirmed on the blockchain",
          variant: "default",
        });
      } else if (data.status === 'pending') {
        toast({
          title: "Payment Pending",
          description: `Transaction found with ${data.confirmations}/${data.required_confirmations} confirmations`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify payment",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!txHash || !user) return;

    setIsCheckingStatus(true);
    try {
      const response = await fetch('/api/check-payment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          txHash,
          cryptocurrency: selectedCrypto,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check payment status');
      }

      const data = await response.json();
      setPaymentStatus({
        confirmations: data.confirmations,
        required_confirmations: data.required_confirmations,
        status: data.status,
        timestamp: data.timestamp,
        amount: data.amount,
      });

      if (data.status === 'confirmed') {
        toast({
          title: "Payment Confirmed",
          description: "Your transaction has been confirmed on the blockchain",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Status check error:', error);
      toast({
        title: "Status Check Failed",
        description: error instanceof Error ? error.message : "Failed to check payment status",
        variant: "destructive",
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const upgradePlan = async () => {
    if (!user || !paymentStatus || paymentStatus.status !== 'confirmed') return;

    setIsUpgrading(true);
    try {
      const { error: txError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          tx_hash: txHash,
          cryptocurrency: selectedCrypto,
          amount: paymentStatus.amount,
          status: 'confirmed',
          confirmation_timestamp: paymentStatus.timestamp,
        });

      if (txError) throw new Error(txError.message);

      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: subscriptionTier,
          status: 'active',
          starts_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          payment_method: 'crypto',
          payment_reference: txHash,
        });

      if (subError) throw new Error(subError.message);

      toast({
        title: "Plan Upgraded!",
        description: `Your account has been upgraded to ${subscriptionTier.toUpperCase()}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Plan upgrade error:', error);
      toast({
        title: "Upgrade Failed",
        description: error instanceof Error ? error.message : "Failed to upgrade your plan",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/30 border-white/10 backdrop-blur-md text-white">
      <CardHeader>
        <CardTitle>Crypto Payment</CardTitle>
        <CardDescription className="text-white/70">
          Pay with cryptocurrency to upgrade your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="ETH" onValueChange={(value) => setSelectedCrypto(value as keyof typeof WALLET_ADDRESSES)}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="BTC">BTC</TabsTrigger>
            <TabsTrigger value="ETH">ETH</TabsTrigger>
            <TabsTrigger value="USDT_ERC20">USDT-ERC20</TabsTrigger>
            <TabsTrigger value="USDT_TRC20">USDT-TRC20</TabsTrigger>
          </TabsList>

          {Object.entries(WALLET_ADDRESSES).map(([crypto, address]) => (
            <TabsContent key={crypto} value={crypto} className="space-y-4">
              <div className="space-y-2">
                <Label>Send payment to this address:</Label>
                <div className="flex">
                  <Input 
                    value={address}
                    readOnly
                    className="font-mono text-sm bg-black/50 border-white/20 flex-1"
                  />
                  <Button 
                    onClick={copyWalletAddress} 
                    variant="outline" 
                    size="icon"
                    className="ml-2"
                    aria-label="Copy wallet address"
                  >
                    <Copy className="h-4 w-4"/>
                  </Button>
                </div>
                <p className="text-xs text-white/60">
                  {crypto === 'BTC' && 'Send BTC (Bitcoin) to this address. Minimum amount: 0.001 BTC'}
                  {crypto === 'ETH' && 'Send ETH (Ethereum) to this address. Minimum amount: 0.01 ETH'}
                  {crypto === 'USDT_ERC20' && 'Send USDT (ERC-20) to this address. Minimum amount: 50 USDT'}
                  {crypto === 'USDT_TRC20' && 'Send USDT (TRC-20) to this address. Minimum amount: 50 USDT'}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Transaction Hash:</Label>
                <Input
                  value={txHash}
                  onChange={handleTxHashChange}
                  placeholder={`Enter ${crypto.replace('_', ' ')} transaction hash`}
                  className="bg-black/50 border-white/20"
                />
                {txHashError && (
                  <p className="text-xs text-red-400">{txHashError}</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {paymentStatus && (
          <Alert className={`
            ${paymentStatus.status === 'confirmed' ? 'bg-green-900/20 border-green-500/30' : 
              paymentStatus.status === 'pending' ? 'bg-yellow-900/20 border-yellow-500/30' : 
              'bg-red-900/20 border-red-500/30'}
          `}>
            <div className="flex items-start">
              {paymentStatus.status === 'confirmed' ? (
                <CheckCircle className="h-5 w-5 text-green-400 mr-2"/>
              ) : paymentStatus.status === 'pending' ? (
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2"/>
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400 mr-2"/>
              )}
              <div>
                <AlertTitle>
                  {paymentStatus.status === 'confirmed' ? 'Payment Confirmed' : 
                   paymentStatus.status === 'pending' ? 'Payment Pending' : 'Payment Failed'}
                </AlertTitle>
                <AlertDescription className="text-sm">
                  {paymentStatus.status === 'confirmed' ? (
                    <>Transaction confirmed. Amount: {paymentStatus.amount}</>
                  ) : paymentStatus.status === 'pending' ? (
                    <>
                      Confirmations: {paymentStatus.confirmations}/{paymentStatus.required_confirmations}
                      <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-yellow-400 h-1.5 rounded-full" 
                          style={{ width: `${(paymentStatus.confirmations / paymentStatus.required_confirmations) * 100}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <>Transaction verification failed. Please check the hash and try again.</>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div className="space-y-2">
          <Label>Select Plan:</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={subscriptionTier === 'pro' ? 'default' : 'outline'}
              onClick={() => setSubscriptionTier('pro')}
              className={subscriptionTier === 'pro' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              Pro
            </Button>
            <Button 
              variant={subscriptionTier === 'premium' ? 'default' : 'outline'}
              onClick={() => setSubscriptionTier('premium')}
              className={subscriptionTier === 'premium' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              Premium
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            onClick={verifyPayment}
            disabled={!txHash || isVerifying}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Verifying...
              </>
            ) : (
              "Verify Payment"
            )}
          </Button>
          <Button 
            onClick={checkPaymentStatus}
            disabled={!txHash || isCheckingStatus || !paymentStatus}
            variant="outline"
            className="border-white/20 hover:bg-white/10"
          >
            {isCheckingStatus ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4"/>
                Check Status
              </>
            )}
          </Button>
        </div>
        <Button 
          onClick={upgradePlan}
          disabled={!paymentStatus || paymentStatus.status !== 'confirmed' || isUpgrading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          {isUpgrading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              Upgrading...
            </>
          ) : (
            "Upgrade Plan"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
