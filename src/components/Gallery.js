import React, { useState } from 'react';
import '../Gallery.css';
import { motion, AnimatePresence } from 'framer-motion';
import imagen1 from '../logo_salud_y_belleza.png';
import imagen2 from '../logo_salud_y_belleza_blanco.png';

const IMAGENES = [imagen1, imagen2];

export const Gallery = () => {
    const [[pagina, direccion], setPagina] = useState([0, 0]);

    // Asegura un índice válido dentro del arreglo
    const indiceActual = Math.abs(pagina % IMAGENES.length);

    const cambiarFoto = (nuevaDireccion) => {
        setPagina([pagina + nuevaDireccion, nuevaDireccion]);
    };

    const irAFoto = (index) => {
        // Calculamos la dirección respecto a la foto actual
        const dif = index - indiceActual;
        if (dif !== 0) {
            setPagina([pagina + dif, dif > 0 ? 1 : -1]);
        }
    };

    const variantes = {
        enter: (dir) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir) => ({
            x: dir < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    return (
        <div className="galeria-container">
            {/* Animación entre imágenes */}
            <AnimatePresence initial={false} custom={direccion}>
                <motion.img
                    key={pagina}
                    src={IMAGENES[indiceActual]}
                    alt="Galería"
                    custom={direccion}
                    variants={variantes}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className="slide-imagen"
                />
            </AnimatePresence>

            {/* Capa de sombra para contraste */}
            <div className="galeria-overlay" />

            {/* Flechas conectadas a cambiarFoto */}
            <button className="btn-prev" onClick={() => cambiarFoto(-1)}>
                &#10094;
            </button>
            <button className="btn-next" onClick={() => cambiarFoto(1)}>
                &#10095;
            </button>

            {/* Puntos indicadores */}
            <div className="puntos-container">
                {IMAGENES.map((_, index) => (
                    <button
                        key={index}
                        className={`punto ${index === indiceActual ? 'activo' : ''}`}
                        onClick={() => irAFoto(index)}
                    />
                ))}
            </div>
        </div>
    );
};