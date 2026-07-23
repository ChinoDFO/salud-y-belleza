import React, { useState } from 'react'
import '../Gallery.css';
import Limpieza from '../assets/limpieza-facial.png';
import Podologia from '../assets/podología.jpg';
import { Info } from '../components/Info';

export const Services = () => {
    const [opcionSeleccionada, setOpcionSelecionada] = useState(null);

    if (opcionSeleccionada) {
        return (
            <div className="pagina-formulario-container">
                <Info direction='up' delay={0.01}>
                    {/* Botón opcional para regresar a la selección */}

                    <button className="btn-regresar"
                        onClick={() => setOpcionSelecionada(null)}>
                        &#8592; Volver
                    </button>

                    <h2>
                        FORMULARIO PARA: {opcionSeleccionada}
                    </h2>
                    {/* Aquí colocarás tu formulario en blanco más adelante */}
                    <div className="formulario-blanco">
                        <p>Página en blanco lista para insertar el formulario...</p>
                    </div>
                </Info>

            </div>
        )
    }

    return (
        <div className="seleccion-container" >
            <h2>
                SELECCIONA PARA AGENDAR CITA
            </h2>
            <div className="tarjetas-grid">
                {/*Boton1*/}
                <button className="tarjeta-btn" onClick={() => setOpcionSelecionada('Limpieza Facial')}>
                    <img src={Limpieza} alt='Limpieza Facial' className="tarjeta-imagen" />
                    <span className="tarjeta-titulo">Limpieza facial</span>
                </button>
                {/*Boton2*/}
                <button className="tarjeta-btn" onClick={() => setOpcionSelecionada('Podología')}>
                    <img src={Podologia} alt='Podología' className="tarjeta-imagen" />
                    <span className="tarjeta-titulo">Podología</span>
                </button>
            </div>
        </div>
    )
}
