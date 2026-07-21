import React, { useState, useEffect } from 'react';
// Importa el CSS con estilos globales o los de tu Navbar
import '../App.css'; 

export const Navbar = () => {
  const [hidden, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Aparece después de scroll de 200px
      if (window.scrollY > 700) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${hidden ? 'hidden' : ''}`}>
      <div className="logo">
        {/* Aquí puedes poner un minilogo si quieres */}
        
      </div>
      <ul className="nav-links">
        <li><a href="#inicio">Inicio</a></li>
        <li><a href="#servicios">Servicios</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
    </nav>
  );
};