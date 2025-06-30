import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" style={{ fontWeight: "700" }}>
          Insight Flow
        </nav>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {ROUTES.map((route) => (
            <Link>
              {route.label}
            </div>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <Button className="md:hidden text-white focus:outline-none" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X > : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {ROUTES.map((route) => (
          <Link ></div> setIsMobileMenuOpen(false)}
          >
            {route.label}
          </div>
        ))}
      </div />
  );
};

export default Navbar; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
