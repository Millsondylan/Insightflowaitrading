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
        <Div className="min-h-screen flex items-center justify-center p-4">
            <Div className="w-full">
                <Authform></Div></Div></Div>
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
