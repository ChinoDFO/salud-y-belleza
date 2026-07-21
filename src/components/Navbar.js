import React, { useState, useEffect } from 'react';
// Importa el CSS con estilos globales o los de tu Navbar
import '../App.css';

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
            // Aparece después de scroll de 400px
            const scrollY = window.scrollY;
            if (scrollY > 400) {
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
    return (
        <nav className={`navbar ${navState}`} onAnimationEnd={handleAnimationEnd}>
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