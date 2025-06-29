import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';

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
            <div className="w-full">
                <authForm onSuccess={handleSuccess} />
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