
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, TrendingUp, Scan, Trophy } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import '@/styles/nav.css';
import { Button } from '@/components/ui/button';
import LanguageSelector from './LanguageSelector';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Here you would check for an auth token or session
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Add our new items with the same format as ROUTES
  const navigationItems = [
    ...ROUTES,
    { 
      label: "Market Setup", 
      href: "/market-setup"
    },
    { 
      label: "Setup Finder", 
      href: "/setup-finder"
    },
    { 
      label: "Best Setups", 
      href: "/best-setups"
    },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src="/placeholder.svg" alt="Logo" className="h-8 w-8 mr-2"/>
            <span className="text-lg font-bold">InsightFlow</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {navigationItems.map((route) => (
            <Link key={route.href} to={route.href} className="nav-link font-medium">
              {route.label}
            </Link>
          ))}
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/auth" className="nav-link">Log In</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="nav-link">Profile</Link>
              <Button className="btn-secondary" onClick={() => {
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
              }}>
                Logout
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button onClick={toggleMobileMenu} className="text-gray-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {navigationItems.map((route) => (
          <Link key={route.href}
            to={route.href}
            className="mobile-nav-link"
            onClick={toggleMobileMenu}>
            {route.label}
          </Link>
        ))}
        
        <div className="mobile-auth">
          {!isAuthenticated ? (
            <>
              <Link to="/auth" className="mobile-nav-link" onClick={toggleMobileMenu}>
                Log In
              </Link>
              <Link to="/register" className="btn-primary w-full text-center" onClick={toggleMobileMenu}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="mobile-nav-link" onClick={toggleMobileMenu}>
                Profile
              </Link>
              <Button                 
                className="btn-secondary w-full"
                onClick={() => {
                  localStorage.removeItem('authToken');
                  setIsAuthenticated(false);
                  toggleMobileMenu();
                }}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
