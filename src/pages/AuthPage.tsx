
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { Helmet } from 'react-helmet-async';

export default function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const from = (location.state as { from?: Location })?.from?.pathname || '/';

    const handleSuccess = () => {
        // Navigate to the page they tried to visit or home
        navigate(from, { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Helmet>
                <title>Sign In | InsightFlow AI Trading</title>
                <meta name="description" content="Sign in to your InsightFlow AI Trading account to access advanced trading tools and analytics." />
            </Helmet>
            <div className="w-full max-w-md">
                <AuthForm onAuth={handleSuccess} />
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
