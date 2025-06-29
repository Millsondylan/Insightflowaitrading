import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "32px" }}>
                <h2 style={{ fontWeight: "700", color: "white" }}>
                    {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h2>

                <form onSubmit={handleSubmit} >
                    <div>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            
                            required
                        />
                    </div>

                    <div>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            
                            required
                            minLength={8}
                        />
                    </div>

                    {error && (
                        <div >{error}</div>
                    )}

                    <Button
                        type="submit"
                        style={{ width: "100%" }}
                        disabled={loading}
                    >
                        {loading ? (
                            <div  />
                        ) : mode === 'signin' ? (
                            <>
                                <LogIn  />
                                Sign In
                            </>
                        ) : (
                            <>
                                <span style={{fontSize: '16px'}}>👤</span>
                                Sign Up
                            </>
                        )}
                    </Button>

                    <div >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ width: "100%" }}></div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <span >Or continue with</span>
                        </div>
                    </div>

                    <div >
                        <Button variant="outline" style={{ width: "100%" }}>
                            <Github  />
                            GitHub
                        </Button>
                        <Button variant="outline" style={{ width: "100%" }}>
                            <span style={{fontSize: '16px'}}>📧</span>
                            Google
                        </Button>
                    </div>

                    <div >
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            style={{ color: "#9CA3AF" }}
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