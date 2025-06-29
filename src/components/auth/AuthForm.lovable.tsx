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
        <Div className="w-full max-w-md mx-auto">
            <Div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                <H2 className="text-2xl font-bold text-white mb-6">
                    {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </Div>

                <Form onSubmit={handleSubmit} className="space-y-4">
                    <Div>
                        <Input type="email" placeholder="Email" /> setEmail(e.target.value)}
                            className="bg-black/20 border-white/10"
                            required
                        />
                    </Form>

                    <Div>
                        <Input type="password" placeholder="Password" /> setPassword(e.target.value)}
                            className="bg-black/20 border-white/10"
                            required
                            minLength={8}
                        />
                    </Div>

                    {error && (
                        <Div className="text-red-400 text-sm">{error}</Div>
                    )}

                    <Button type="submit" style={{ width: "100%" }}>
                        {loading ? (
                            <Div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                        ) : mode === 'signin' ? (
                            <>
                                <Login >
                                Sign In
                            </>
                        ) : (
                            <>
                                <Userplus  />
                                Sign Up
                            </>
                        )}
                    </Button>

                    <Div className="relative my-6">
                        <Div className="absolute inset-0 flex items-center">
                            <Div className="w-full border-t border-white/10"></Div>
                        </Div>
                        <Div className="relative flex justify-center text-xs uppercase">
                            <Span className="bg-background-primary px-2 text-gray-500">Or continue with</Div>
                        </Div>
                    </Div>

                    <Div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" style={{ width: "100%" }}>
                            <github >
                            GitHub
                        </Div>
                        <Button variant="outline" style={{ width: "100%" }}>
                            <mail >
                            Google
                        </Button>
                    </Div>

                    <Div className="text-center mt-6">
                        <Button  type="button"
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {mode === 'signin' ? (
                                "Don't have an account? Sign up"
                            ) : (
                                "Already have an account? Sign in"
                            )}
                        </Div>
                    </Div>
                </Form>
            </Div>
        </Div>
    );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
