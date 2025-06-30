import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/db/supabase-client';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get verification token from URL
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');
        const type = url.searchParams.get('type');
        
        if (!token || type !== 'email_confirmation') {
          setVerificationStatus('error');
          setErrorMessage('Invalid verification link. Please request a new one.');
          return;
        }
        
        // Verify with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });

        if (error) {
          throw error;
        }
        
        setVerificationStatus('success');
      } catch (error: any) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message || 'Failed to verify your email. Please try again.');
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
      <Card className="bg-black/30 border-white/10 backdrop-blur-md text-white w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
          {verificationStatus === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 text-blue-400 animate-spin mb-4"/>
              <p className="text-gray-300">Verifying your email address...</p>
            </>
          )}
          
          {verificationStatus === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-400 mb-4"/>
              <h2 className="text-xl font-bold mb-2">Email Verified Successfully!</h2>
              <p className="text-gray-300 mb-6">
                Your email has been verified. You can now log in to your account.
              </p>
            </>
          )}
          
          {verificationStatus === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-red-400 mb-4"/>
              <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
              <p className="text-red-300 mb-6">
                {errorMessage || 'There was a problem verifying your email.'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="mb-4"
              >
                Back to Login
              </Button>
            </>
          )}
        </CardContent>
        
        {verificationStatus === 'success' && (
          <CardFooter className="flex justify-center">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              onClick={() => navigate('/auth')}
            >
              Log In Now
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};