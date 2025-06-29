import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2, CheckCircle2, ChevronRight, Users, Wallet } from "lucide-react";
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

export function ReferralSystem() {
  const { user } = useAuth();

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState<EarningEvent[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('referrals');
  const [pendingPayout, setPendingPayout] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchReferralData();
    }
  }, [user]);

  async function fetchReferralData() {
    setLoading(true);
    try {
      // Get user's referral code
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('referral_code, referral_payout_wallet, total_referral_earnings')
        .eq('id', user!.id)
        .single();

      if (profileError) throw profileError;

      setReferralCode(profileData?.referral_code || '');
      setWalletAddress(profileData?.referral_payout_wallet || '');
      setTotalEarned(profileData?.total_referral_earnings || 0);

      // If no referral code exists, generate one
      if (!profileData?.referral_code) {
        await generateReferralCode();
      }

      // Get referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from('user_referrals')
        .select(`
          id, 
          status, 
          signup_date, 
          earnings_percentage, 
          referred_id,
          referred:profiles!referred_id(email)
        `)
        .eq('referrer_id', user!.id)
        .order('signup_date', { ascending: false });

      if (referralsError) throw referralsError;

      // Transform the data to match our interface
      const formattedReferrals: Referral[] = (referralsData || []).map(ref => ({
        id: ref.id,
        referred_email: ref.referred?.email || 'Unknown user',
        status: ref.status,
        signup_date: ref.signup_date,
        earnings_percentage: ref.earnings_percentage
      }));

      setReferrals(formattedReferrals);

      // Get earnings
      const { data: earningsData, error: earningsError } = await supabase
        .from('referral_earnings')
        .select(`
          id, 
          amount, 
          currency, 
          payment_date, 
          status,
          referred_id,
          referred:profiles!referred_id(email)
        `)
        .eq('referrer_id', user!.id)
        .order('payment_date', { ascending: false });

      if (earningsError) throw earningsError;

      // Transform earnings data
      const formattedEarnings: EarningEvent[] = (earningsData || []).map(earn => ({
        id: earn.id,
        amount: earn.amount,
        currency: earn.currency,
        payment_date: earn.payment_date,
        status: earn.status,
        referred_email: earn.referred?.email || 'Unknown user'
      }));

      setEarnings(formattedEarnings);

      // Calculate pending payout (earnings marked as pending)
      const pendingAmount = formattedEarnings
        .filter(e => e.status === 'pending')
        .reduce((sum, e) => sum + e.amount, 0);

      setPendingPayout(pendingAmount);

    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast({
        variant: "destructive",
        title: "Error fetching referral data",
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  }

  async function generateReferralCode() {
    try {
      // Generate a unique code server-side
      const { data, error } = await supabase.rpc('generate_unique_referral_code');
      
      if (error) throw error;
      
      const newCode = data;
      
      // Save the code to the user's profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ referral_code: newCode })
        .eq('id', user!.id);
      
      if (updateError) throw updateError;
      
      setReferralCode(newCode);
      return newCode;
    } catch (error) {
      console.error('Error generating referral code:', error);
      toast({
        variant: "destructive",
        title: "Couldn't generate referral code",
        description: "Please try again later."
      });
      return null;
    }
  }

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

  function copyToClipboard() {
    const referralUrl = `${config.app.baseUrl}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(referralUrl);
    setIsCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "Referral link copied to clipboard."
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  function shareReferralLink() {
    const referralUrl = `${config.app.baseUrl}/signup?ref=${referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join me on InsightFlow Trading',
        text: 'Use my referral link to sign up for InsightFlow Trading!',
        url: referralUrl,
      });
    } else {
      copyToClipboard();
    }
  }

  if (!user) return null;

  return (
    <Card className="w-full" />
      <CardHeader>
        <CardTitle className="flex items-center justify-between" />
          <Span>Referral Program</Referral>
          <Badge variant="outline" className="text-sm font-normal">
            Earn 10% on Referred Payments
          </Badge>
        </CardTitle>
        <CardDescription>
          Invite friends and earn 10% of their subscription payments
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6" />
        <Div className="space-y-3">
          <Label htmlFor="referral-link">Your Referral Link</CardContent>
          <Div className="flex gap-2">
            <Input 
              id="referral-link" 
              value={`${config.app.baseUrl}/signup?ref=${referralCode}`}
              readOnly 
              className="font-mono text-sm"
            />
            <Button variant="outline" size="icon" onClick={copyToClipboard} />
              {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Div>
            <Button variant="default" size="icon" onClick={shareReferralLink} />
              <Share2 className="h-4 w-4" />
            </Button>
          </Div>
          <P className="text-xs text-muted-foreground">
            Share this link to start earning commissions
          </P>
        </Div>
        
        <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-muted/50" />
            <CardContent className="pt-6" />
              <Div className="text-2xl font-bold">{referrals.length}</Div>
              <P className="text-sm text-muted-foreground">Total Referrals</P>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50" />
            <CardContent className="pt-6" />
              <Div className="text-2xl font-bold">${totalEarned.toFixed(2)}</Card>
              <P className="text-sm text-muted-foreground">Total Earned</P>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50" />
            <CardContent className="pt-6" />
              <Div className="text-2xl font-bold">${pendingPayout.toFixed(2)}</Card>
              <P className="text-sm text-muted-foreground">Pending Payout</P>
            </CardContent>
          </Card>
        </Div>
        
        <Tabs defaultValue="referrals" value={activeTab} onValueChange={setActiveTab} />
          <TabsList className="mb-4" />
            <TabsTrigger value="referrals" />
              <Users className="h-4 w-4 mr-2" /> Referrals
            </Tabs>
            <TabsTrigger value="earnings" />
              <Wallet className="h-4 w-4 mr-2" /> Earnings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="referrals" />
            {referrals.length > 0 ? (
              <Div className="space-y-3">
                {referrals.map((referral) => (
                  <Div key={referral.id} className="flex justify-between items-center p-3 border rounded-md">
                    <Div>
                      <Div className="font-medium">{referral.referred_email}</TabsContent>
                      <Div className="text-sm text-muted-foreground">
                        Joined {new Date(referral.signup_date).toLocaleDateString()}
                      </Div>
                    </Div>
                    <Div className="flex items-center">
                      <Badge variant={
                        referral.status === 'confirmed' ? 'default' : 
                        referral.status === 'pending' ? 'outline' : 'destructive'
                      }>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </Div>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </ChevronRight>
                  </Div>
                ))}
              </Div>
            ) : (
              <Div className="text-center p-6 border border-dashed rounded-md">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                <H3 className="mt-2 text-lg font-medium">No referrals yet</Div>
                <P className="text-sm text-muted-foreground">
                  Share your referral link to start earning commissions
                </P>
              </Div>
            )}
          </TabsContent>
          
          <TabsContent value="earnings" />
            <Div className="space-y-5">
              <Div>
                <Label htmlFor="wallet-address">Payout Wallet Address</TabsContent>
                <Div className="flex gap-2 mt-1.5">
                  <Input id="wallet-address"
                    placeholder="Enter your crypto wallet address" 
                    value={walletAddress} 
                    onChange={(e) = /> setWalletAddress(e.target.value)}
                  />
                  <Button onClick={saveWalletAddress}>Save</Div>
                </Div>
                <P className="text-xs text-muted-foreground mt-1">
                  We pay out in USDT on Ethereum or BNB Smart Chain
                </P>
              </Div>
              
              {earnings.length > 0 ? (
                <Div className="space-y-3">
                  <H3 className="text-sm font-medium">Earning History</Div>
                  
                  <Div className="space-y-2">
                    {earnings.map((earning) => (
                      <Div key={earning.id} className="flex justify-between items-center p-3 border rounded-md">
                        <Div>
                          <Div className="font-medium">${earning.amount.toFixed(2)} {earning.currency}</Div>
                          <Div className="text-sm text-muted-foreground">
                            {new Date(earning.payment_date).toLocaleDateString()} • {earning.referred_email}
                          </Div>
                        </Div>
                        <Badge variant={
                          earning.status === 'processed' ? 'default' : 
                          earning.status === 'pending' ? 'outline' : 'destructive'
                        }>
                          {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                        </Badge>
                      </Div>
                    ))}
                  </Div>
                </Div>
              ) : (
                <Div className="text-center p-6 border border-dashed rounded-md">
                  <Wallet className="h-12 w-12 mx-auto text-muted-foreground" />
                  <H3 className="mt-2 text-lg font-medium">No earnings yet</Div>
                  <P className="text-sm text-muted-foreground">
                    You'll earn 10% when your referrals subscribe
                  </P>
                </Div>
              )}
            </Div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4" />
        <Div className="text-sm text-muted-foreground">
          For each friend that subscribes using your referral link, you'll receive 10% of their payment.
        </CardFooter>
        <Div className="text-sm text-muted-foreground">
          You also earn a free month for every 5 Pine Scripts you share publicly with the community.
        </Div>
      </CardFooter>
    </Card>
  );
} 