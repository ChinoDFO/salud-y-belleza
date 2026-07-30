import React, { useState, useEffect } from 'react';
import '../Gallery.css';
import Limpieza from '../assets/limpieza-facial.png';
import Podologia from '../assets/podología.jpg';
import { Info } from '../components/Info';
import { agendarCita, obtenerHorariosDisponibles } from '../services/citasService';

export const Services = () => {
    const [opcionSeleccionada, setOpcionSelecionada] = useState(null);
    const [cargando, setCargando] = useState(false);

    // Estado para guardar las horas disponibles del día elegido
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [cargandoHorarios, setCargandoHorarios] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        fecha: '',
        servicio: 'Limpieza Facial',
        hora: '',
        notas: ''
    });

    // Función para seleccionar la tarjeta y sincronizar el servicio en formData
    const seleccionarServicio = (nombreServicio) => {
        setOpcionSelecionada(nombreServicio);
        setFormData((prev) => ({
            ...prev,
            servicio: nombreServicio,
            fecha: '', // Reseteamos fecha y hora al cambiar de servicio
            hora: ''
        }));
    };

    // Efecto que reacciona cada vez que cambia la fecha o el servicio
    useEffect(() => {
        const cargarHorarios = async () => {
            if (formData.fecha && formData.servicio) {
                setCargandoHorarios(true);
                try {
                    const horasLibres = await obtenerHorariosDisponibles(
                        formData.fecha,
                        formData.servicio
                    );
                    setHorariosDisponibles(horasLibres);
                } catch (error) {
                    console.error('Error cargando horarios:', error);
                } finally {
                    setCargandoHorarios(false);
                }
            } else {
                setHorariosDisponibles([]);
            }
        };

        cargarHorarios();
    }, [formData.fecha, formData.servicio]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const obtenerFechaMinima = () => {
        const hoy = new Date();
        hoy.setDate(hoy.getDate() + 1); // Suma 1 día
        return hoy.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        try {
            await agendarCita(formData);
            alert('¡Cita agendada con éxito!');

            // Reiniciamos el estado
            setFormData({
                nombre: '',
                correo: '',
                telefono: '',
                fecha: '',
                servicio: 'Limpieza Facial',
                hora: '',
                notas: ''
            });
            setOpcionSelecionada(null);
        } catch (error) {
            alert('Error al agendar la cita');
        } finally {
            setCargando(false);
        }
    };

    if (opcionSeleccionada) {
        return (
            <div className="pagina-formulario-container">
                <Info direction="up" delay={0.01}>
                    <button
                        className="btn-regresar"
                        onClick={() => setOpcionSelecionada(null)}
                        disabled={cargando}
                    >
                        &#8592; Volver
                    </button>

                    <h2>FORMULARIO PARA: {opcionSeleccionada.toUpperCase()}</h2>

                    <form className="formulario-blanco" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre completo:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="correo">Correo electrónico:</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono / WhatsApp:</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="fecha">Fecha:</label>
                                <input
                                    type="date"
                                    id="fecha"
                                    name="fecha"
                                    min={obtenerFechaMinima()}
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="hora">Hora disponible:</label>
                                <select
                                    id="hora"
                                    name="hora"
                                    value={formData.hora}
                                    onChange={handleChange}
                                    disabled={!formData.fecha || cargandoHorarios}
                                    required
                                >
                                    <option value="">
                                        {!formData.fecha
                                            ? '-- Selecciona primero una fecha --'
                                            : cargandoHorarios
                                                ? 'Cargando horas...'
                                                : horariosDisponibles.length === 0
                                                    ? 'No hay horarios disponibles'
                                                    : '-- Selecciona una hora --'}
                                    </option>

                                    {horariosDisponibles.map((hora) => (
                                        <option key={hora} value={hora}>
                                            {hora}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="notas">Notas adicionales:</label>
                            <textarea
                                id="notas"
                                name="notas"
                                rows="3"
                                value={formData.notas}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-confirmar"
                            disabled={cargando || cargandoHorarios}
                        >
                            {cargando ? 'Guardando cita...' : 'Confirmar Cita'}
                        </button>
                    </form>
                </Info>
            </div>
        );
    }

    return (
        <div className="seleccion-container">
            <h2>SELECCIONA PARA AGENDAR CITA</h2>
            <div className="tarjetas-grid">
                <button
                    className="tarjeta-btn"
                    onClick={() => seleccionarServicio('Limpieza Facial')}
                >
                    <img src={Limpieza} alt="Limpieza Facial" className="tarjeta-imagen" />
                    <span className="tarjeta-titulo">Limpieza facial</span>
                </button>

                <button
                    className="tarjeta-btn"
                    onClick={() => seleccionarServicio('Podología')}
                >
                    <img src={Podologia} alt="Podología" className="tarjeta-imagen" />
                    <span className="tarjeta-titulo">Podología</span>
                </button>
            </div>
        </div>
    );
};