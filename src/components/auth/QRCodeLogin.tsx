import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/db/supabase-client';
import { useAuth } from '@/hooks/use-auth';

// We would normally import QRCode from 'qrcode.react' but we'll simulate it with a div
// const QRCode = ({ value }: { value: string }) => (
//   <div className="qr-code">
//     {value}
//   </div>
// );

const QRCodeLogin = () => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const generateSessionId = async () => {
      try {
        setLoading(true);
        
        // Generate a unique session ID
        const newSessionId = crypto.randomUUID();
        setSessionId(newSessionId);
        
        // Store session in Supabase for cross-device auth
        const { error } = await (supabase as any)
          .from('qr_login_sessions')
          .insert([
            { 
              session_id: newSessionId,
              user_id: user.id,
              created_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min expiry
              status: 'pending'
            }
          ]);
          
        if (error) throw error;
        
        // Set up real-time listener for when mobile device authenticates
        const channel = supabase
          .channel(`qr-login-${newSessionId}`)
          .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'qr_login_sessions',
            filter: `session_id=eq.${newSessionId}` 
          }, (payload) => {
            if (payload.new.status === 'authenticated') {
              // Handle successful authentication
              window.location.reload();
            }
          })
          .subscribe();
          
        // Clean up subscription
        return () => {
          channel.unsubscribe();
        };
        
      } catch (err) {
        console.error('QR code login setup error:', err);
        setError('Failed to set up QR code login');
      } finally {
        setLoading(false);
      }
    };
    
    generateSessionId();
  }, [user]);
  
  // Generate login deep link for mobile
  const qrCodeValue = sessionId 
    ? `insightflow://login?session=${sessionId}&userId=${user?.id}`
    : '';
    
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"/>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mobile Login</CardTitle>
        <CardDescription>Scan to log in on your mobile device</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* This would be a QR code in production */}
        <div className="border-4 border-dashed border-gray-400 w-[200px] h-[200px] flex items-center justify-center p-4 text-center bg-white text-black">
          QR Code for: {qrCodeValue}
        </div>
        
        <p className="text-sm mt-4 text-center text-gray-400">
          Open the Insight Flow app on your mobile device and scan this code to log in automatically
        </p>
      </CardContent>
    </Card>
  );
};

export default QRCodeLogin;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 