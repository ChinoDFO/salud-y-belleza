import React, { useState, useEffect } from 'react';
// Importa el CSS con estilos globales o los de tu Navbar
import '../App.css'; 

export const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0); // Asegura que la página se cargue en la parte superior
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Aparece después de scroll de 700px
      if (window.scrollY < 200) {
        setHidden(true);    
        setVisible(false);
        
      } else {
        setHidden(false);
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${visible ? 'visible' : 'hidden'}`}>
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