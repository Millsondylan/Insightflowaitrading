import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { FC, ReactNode } from 'react';

interface ProtectedRouteProps {
  accessLevel: 'admin' | 'subscribed' | 'trial' | 'pro';
  children?: ReactNode;
}

export const ProtectedRoute: FC<protectedrouteprops  > = ({ accessLevel, children }) => {
  const { loading, isAdmin, isSubscribed, hasProAccess } = useAuth();

  if (loading) {
    // You can replace this with a loading spinner component
    return <div>Loading...</div>;
  }

  const checks = {
    admin: isAdmin,
    subscribed: isSubscribed,
    pro: hasProAccess, // 'pro' covers subscribed or trial
    trial: hasProAccess, // for now, trial allows same as pro access
  };

  const hasAccess = checks[accessLevel];

  if (!hasAccess) {
    // Redirect them to the wallet page with an upgrade prompt.
    // This is a sensible default for non-authorized access attempts.
    return <navigate to="/wallet?upgrade=true" >;
  }

  return (
    <>
      {children}
      <outlet  >
    </>
  );
}; 
export const lovable = { component: true };
