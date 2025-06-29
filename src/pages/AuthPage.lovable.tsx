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
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
            <div style={{ width: "100%" }}>
                <AuthForm onSuccess={handleSuccess} />
            </div>
        </div>
    );
} 