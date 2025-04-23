import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUserAlt, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from "react-icons/fa";
import '../assets/styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">MyApp</div>

      <div className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={closeMenu}>
          <FaHome className="nav-icon" /> Inicio
        </Link>
        {token ? (
          <>
            <Link to="/perfil" className="nav-link" onClick={closeMenu}>
              <FaUserAlt className="nav-icon" /> Mi perfil
            </Link>
            <button onClick={() => { handleLogout(); closeMenu(); }} className="nav-button">
              <FaSignOutAlt className="nav-icon" /> Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={closeMenu}>
              <FaSignInAlt className="nav-icon" /> Iniciar sesión
            </Link>
            <Link to="/register" className="nav-link" onClick={closeMenu}>
              <FaUserPlus className="nav-icon" /> Registrarse
            </Link>
          </>
        )}
      </div>

      <div className="mobile-menu-icon" onClick={toggleMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;