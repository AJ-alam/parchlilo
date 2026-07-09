import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Mail } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    // Also cover legacy HTML links
    if (path === '/') {
      return location.pathname === '/' || location.pathname.toLowerCase() === '/index.html';
    }
    return location.pathname.toLowerCase() === path.toLowerCase() || 
           location.pathname.toLowerCase() === `${path.toLowerCase()}.html`;
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const hamburger = document.querySelector('.nav-hamburger');
      const mobileMenu = document.getElementById('mobileMenu');
      if (hamburger && mobileMenu && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="nav-wrap">
        <nav id="mainNav" className={scrolled ? 'scrolled' : ''}>
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            <span className="logo-wordmark">
              <span>PAR</span><span className="logo-invert">CHI</span><span>LO</span>
            </span>
          </Link>

          <ul className="nav-links">
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                <Home size={13} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Home
              </Link>
            </li>
            <li>
              <Link to="/blogs" className={isActive('/blogs') ? 'active' : ''}>
                <BookOpen size={13} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Blogs
              </Link>
            </li>
            <li>
              <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
                <Mail size={13} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Contact Us
              </Link>
            </li>
          </ul>

          <button className={`nav-hamburger ${menuOpen ? 'open' : ''}`} onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} id="mobileMenu">
        <Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMenu}>
          <Home size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Home
        </Link>
        <Link to="/blogs" className={isActive('/blogs') ? 'active' : ''} onClick={closeMenu}>
          <BookOpen size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Blogs
        </Link>
        <Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={closeMenu}>
          <Mail size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Contact Us
        </Link>
      </div>
    </>
  );
}
