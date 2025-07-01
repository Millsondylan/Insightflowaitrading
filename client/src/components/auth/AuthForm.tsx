import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, UserPlus, Github, Mail } from 'lucide-react';
import { signIn, signUp, AuthError } from '@/lib/auth/handleAuth';
import { toast } from '@/components/ui/use-toast';

interface AuthFormProps {
    defaultMode?: 'signin' | 'signup';
    onSuccess?: () => void;
}

export default function AuthForm({ defaultMode = 'signin', onSuccess }: AuthFormProps) {
    const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            console.log(`Attempting ${mode} for email:`, email);
            
            if (mode === 'signin') {
                await signIn(email, password);
                console.log('Sign in successful');
            } else {
                await signUp(email, password);
                console.log('Sign up successful');
            }
            
            // Show success message
            toast({
                title: mode === 'signin' ? 'Welcome back!' : 'Account created!',
                description: mode === 'signin' 
                    ? 'Successfully signed in to your account.' 
                    : 'Please check your email to verify your account.',
                duration: 3000,
            });
            
            if (onSuccess) {
                onSuccess();
            } else {
                // Add a small delay to ensure the session is properly set
                setTimeout(() => {
                    navigate('/dashboard');
                }, 500);
            }
        } catch (err) {
            console.error('Authentication error:', err);
            
            if (err instanceof AuthError) {
                setError(err.message);
                toast({
                    title: "Authentication Error",
                    description: err.message,
                    variant: "destructive",
                    duration: 5000,
                });
            } else {
                const errorMessage = 'An unexpected error occurred. Please try again.';
                setError(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                    duration: 5000,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6">
                    {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input 
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-black/20 border-white/10"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <Input 
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-black/20 border-white/10"
                            required
                            minLength={8}
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            {error}
                        </div>
                    )}

                    <Button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"/>
                        ) : mode === 'signin' ? (
                            <>
                                <LogIn className="w-4 h-4 mr-2"/>
                                Sign In
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4 mr-2"/>
                                Sign Up
                            </>
                        )}
                    </Button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background-primary px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full" disabled={loading}>
                            <Github className="w-4 h-4 mr-2"/>
                            GitHub
                        </Button>
                        <Button variant="outline" className="w-full" disabled={loading}>
                            <Mail className="w-4 h-4 mr-2"/>
                            Google
                        </Button>
                    </div>

                    <div className="text-center mt-6">
                        <Button 
                            type="button"
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                            disabled={loading}
                        >
                            {mode === 'signin' ? (
                                "Don't have an account? Sign up"
                            ) : (
                                "Already have an account? Sign in"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 