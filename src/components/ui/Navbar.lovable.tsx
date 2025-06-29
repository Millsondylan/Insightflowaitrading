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
    <Nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <Div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" style={{ fontWeight: "700" }}>
          Insight Flow
        </Nav>

        {/* Desktop Navigation */}
        <Div className="hidden md:flex space-x-6">
          {ROUTES.map((route) => (
            <Link>
              {route.label}
            </Div>
          ))}
        </Div>

        {/* Mobile Menu Toggle */}
        <Button className="md:hidden text-white focus:outline-none" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <x > : <menu  />}
        </Button>
      </Div>

      {/* Mobile Menu */}
      <Div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {ROUTES.map((route) => (
          <Link ></Div></Div> setIsMobileMenuOpen(false)}
          >
            {route.label}
          </Div>
        ))}
      </Div>
    </Nav>
  );
};

export default Navbar; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
