import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2, CheckCircle2, ChevronRight, Users, Wallet, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { config } from "@/lib/config";

interface Referral {
  id: string;
  referred_email: string;
  status: 'pending' | 'confirmed' | 'rejected';
  signup_date: string;
  earnings_percentage: number;
}

interface EarningEvent {
  id: string;
  amount: number;
  currency: string;
  payment_date: string;
  status: 'pending' | 'processed' | 'failed';
  referred_email: string;
}

interface ReferralData {
  code: string;
  usageCount: number;
  earnings: number;
  isActive: boolean;
}

export function ReferralSystem() {
  // LOVABLE:AI_BLOCK id="referral_system" type="react_component"
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState<EarningEvent[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [activeTab, setActiveTab] = useState('referrals');
  const [pendingPayout, setPendingPayout] = useState(0);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  // LOVABLE:FUNCTION id="loadReferralData" endpoint="/api/referrals/user-data"
  const loadReferralData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-referral-data', {
        body: { userId: user.id }
      });
      
      if (error) throw error;
      
      setReferralData(data);
    } catch (error) {
      console.error('Error loading referral data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load referral data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // LOVABLE:FUNCTION id="generateReferralCode" endpoint="/api/referrals/generate-code"
  const generateReferralCode = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-referral-code', {
        body: { userId: user.id }
      });
      
      if (error) throw error;
      
      setReferralData(prev => ({ ...prev, ...data }));
      
      toast({
        title: 'Success',
        description: 'Your referral code has been generated',
      });
    } catch (error) {
      console.error('Error generating referral code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate referral code',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // LOVABLE:FUNCTION id="saveWalletAddress" endpoint="/api/referrals/update-wallet"
  async function saveWalletAddress() {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ referral_payout_wallet: walletAddress })
        .eq('id', user!.id);
      
      if (error) throw error;
      
      toast({
        title: "Wallet address saved",
        description: "Your payout address has been updated."
      });
    } catch (error) {
      console.error('Error saving wallet address:', error);
      toast({
        variant: "destructive",
        title: "Couldn't save wallet address",
        description: "Please try again later."
      });
    }
  }

  const copyToClipboard = () => {
    if (!referralData?.code) return;
    
    navigator.clipboard.writeText(`${config.app.baseUrl}/signup?ref=${referralData.code}`);
    setCopied(true);
    
    toast({
      title: 'Copied!',
      description: 'Referral link copied to clipboard',
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = () => {
    if (!referralData?.code) return;
    
    const text = `Join me on InsightFlow AI Trading Platform! Use my referral code for a free month: ${referralData.code}`;
    const url = `${config.app.baseUrl}/signup?ref=${referralData.code}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'InsightFlow AI Trading Platform',
        text,
        url,
      }).catch(console.error);
    } else {
      copyToClipboard();
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
          <CardDescription>Sign in to access the referral program</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle>InsightFlow Referral Program</CardTitle>
        <CardDescription>
          Invite friends and earn rewards! You get 10% of their subscription for as long as they remain subscribed.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : !referralData?.code ? (
          <div className="text-center py-6">
            <div className="mb-6 text-muted-foreground">
              <Info className="h-12 w-12 mx-auto mb-2" />
              <p>You haven't generated your referral code yet.</p>
            </div>
            
            <Button onClick={generateReferralCode}>
              Generate My Referral Code
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="text-sm font-medium mb-2">Your Referral Link</div>
              <div className="flex gap-2">
                <Input 
                  value={`${config.app.baseUrl}/signup?ref=${referralData.code}`}
                  readOnly
                  className="font-mono text-sm bg-muted/50"
                />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Or use code: <span className="font-bold">{referralData.code}</span>
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold">{referralData.usageCount}</div>
                <div className="text-xs text-muted-foreground">People referred</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold">${referralData.earnings.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Total earnings</div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-2">How it works</h4>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-4">
                <li>Share your unique link with friends</li>
                <li>They get 10% off their first month</li>
                <li>You earn 10% of their subscription fee for the lifetime of their account</li>
                <li>Earnings are paid monthly to your wallet address</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      
      {referralData?.code && (
        <CardFooter className="bg-muted/50 flex gap-2">
          <Button className="w-full" onClick={shareReferral}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Referral Link
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
