import React, { useState, useEffect } from 'react';
// Importa el CSS con estilos globales o los de tu Navbar
import '../App.css';
import logo_Salud_y_Belleza_Blanco from '../logo_salud_y_belleza_blanco.png';

export const Navbar = () => {
    const [navState, setNavState] = useState('initial');

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        window.scrollTo(0, 0); // Asegura que la página se cargue en la parte superior
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            // Aparece después de scroll de 250px
            const scrollY = window.scrollY;
            if (scrollY > 150) {
                setNavState('visible');
            } else {
                setNavState((prevState) => (prevState === 'initial' ? 'initial' : 'hidding')); // Cambia a hidding solo si no está en initial
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAnimationEnd = () => {
        // solo cuando terminó la animación de desaparecer, la mandamos a initial
        if (navState === 'hidding') setNavState('initial');
    };

    const scrollToSection = (e, id) => {
        e.preventDefault(); // Evita que se agregue '#' a la URL
        if (id === 'top') {
            window.scrollTo({
                top: 0, behavior: 'smooth' // Hace que el scroll sea suave
            });
        }

        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start' // Alinea la parte superior de la sección con la pantalla
            });
        }
    };

    return (
        <nav className={`navbar ${navState}`} onAnimationEnd={handleAnimationEnd}>
            <div className="logo">
                {/* Aquí puedes poner un minilogo si quieres */}
                <a href="#Inicio" onClick={(e) => scrollToSection(e, 'top')}>
                    <img src={logo_Salud_y_Belleza_Blanco} className="logo-img" alt="logo" />
                </a>
            </div>
            <ul className="nav-links">
                <li><a href="#Sobre Nosotros" onClick={(e) => scrollToSection(e, 'Sobre-Nosotros')}>Sobre Nosotros</a></li>
                <li><a href="#Servicios" onClick={(e) => scrollToSection(e, 'Instalaciones')}>Instalaciones</a></li>
                <li><a href="#Contacto">Contacto</a></li>
            </ul>
        </nav>
    );
};