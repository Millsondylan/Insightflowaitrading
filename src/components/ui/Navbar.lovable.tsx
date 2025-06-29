import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import '@/styles/nav.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px", display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: "700" }}>
          Insight Flow
        </Link>

        {/* Desktop Navigation */}
        <div >
          {ROUTES.map((route) => (
            <Link key={route.href} to={route.href} >
              {route.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button style={{ color: "white" }} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <span style={{fontSize: '16px'}}>❌</span> : <span style={{fontSize: '16px'}}>☰</span>}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {ROUTES.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar; 