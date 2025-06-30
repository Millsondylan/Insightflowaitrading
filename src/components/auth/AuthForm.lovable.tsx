import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, UserPlus, Github, Mail } from 'lucide-react';
import { signIn, signUp, AuthError } from '@/lib/auth/handleAuth';

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
            if (mode === 'signin') {
                await signIn(email, password);
            } else {
                await signUp(email, password);
            }
            
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/');
            }
        } catch (err) {
            if (err instanceof AuthError) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
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
                        <Input type="email" placeholder="Email"> setEmail(e.target.value)}
                            className="bg-black/20 border-white/10"
                            required
                        />
                    </div>

                    <div>
                        <Input type="password" placeholder="Password" /> setPassword(e.target.value)}
                            className="bg-black/20 border-white/10"
                            required
                            minLength={8}
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm">{error}</div>
                    )}

                    <button type="submit" style={{ width: "100%" }}>
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                        ) : mode === 'signin' ? (
                            <>
                                <login  >
                                Sign In
                            </>
                        ) : (
                            <>
                                <userplus  >
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
                        <button variant="outline" style={{ width: "100%" }}>
                            <github  >
                            GitHub
                        </Button>
                        <button variant="outline" style={{ width: "100%" }}>
                            <mail  >
                            Google
                        </Button>
                    </div>

                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {mode === 'signin' ? (
                                "Don't have an account? Sign up"
                            ) : (
                                "Already have an account? Sign in"
                            )}
                        </button>
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
