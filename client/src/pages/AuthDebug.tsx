import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AuthDebug = () => {
  const { user, session, loading, error } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isChecking, setIsChecking] = useState(false);

  const checkAuthStatus = async () => {
    setIsChecking(true);
    try {
      // Check Supabase session
      const { data: { session: supabaseSession }, error: sessionError } = await supabase.auth.getSession();
      
      // Check local storage
      const localSession = localStorage.getItem('sb-auth-token');
      
      // Check user profile
      let profileData = null;
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('user_profile')
          .select('*')
          .eq('user_id', user.id)
          .single();
        profileData = { profile, profileError };
      }

      setDebugInfo({
        supabaseSession,
        sessionError,
        localSession,
        profileData,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Debug check error:', err);
      setDebugInfo({ error: err, timestamp: new Date().toISOString() });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [user, session]);

  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Authentication Debug</h1>
          <p className="text-gray-400">Debug information for authentication issues</p>
        </div>

        {/* Status Overview */}
        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(!!user)}
                <span className="text-white">User Object</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(!!session)}
                <span className="text-white">Session</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(!loading)}
                <span className="text-white">Not Loading</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(!error)}
                <span className="text-white">No Errors</span>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">Error: {error.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Information */}
        {user && (
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">User ID:</span>
                  <span className="text-white font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email Verified:</span>
                  <Badge variant={user.email_confirmed_at ? "default" : "destructive"}>
                    {user.email_confirmed_at ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created At:</span>
                  <span className="text-white">{new Date(user.created_at).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Session Information */}
        {session && (
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Session Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Access Token:</span>
                  <span className="text-white font-mono text-xs">
                    {session.access_token.substring(0, 20)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Expires At:</span>
                  <span className="text-white">
                    {session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Is Expired:</span>
                  <Badge variant={session.expires_at && session.expires_at * 1000 < Date.now() ? "destructive" : "default"}>
                    {session.expires_at && session.expires_at * 1000 < Date.now() ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Information */}
        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Debug Information
              <Button 
                size="sm" 
                onClick={checkAuthStatus}
                disabled={isChecking}
              >
                {isChecking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs text-gray-300 bg-black/30 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button 
              onClick={() => supabase.auth.signOut()}
              variant="destructive"
            >
              Sign Out
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
            >
              Go to Dashboard
            </Button>
            <Button 
              onClick={() => window.location.href = '/auth'}
              variant="outline"
            >
              Go to Auth
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthDebug; 