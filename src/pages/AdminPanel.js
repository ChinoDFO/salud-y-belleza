import React, { useState } from 'react';
import { loginAdmin, logoutAdmin } from '../services/authService';
import { getCitasByServicio, eliminarCita } from '../services/citasService';


export const AdminPanel = () => {
    const [userAdmin, setUserAdmin] = useState(null);
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');

    const handleLoginChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const obtenerEstadoCita = (cita) => {
        if (cita.estado === 'cancelada') return 'Cancelada';
        if (cita.estado === 'completada') return 'Completada';

        const fechaHoraCita = new Date(`${cita.fecha}T${cita.hora}:00`);
        const ahora = new Date();

        if (fechaHoraCita.getTime() < ahora.getTime()) {
            return 'Caducado';
        }

        return 'Pendiente';
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const adminData = await loginAdmin(credentials.email, credentials.password);
            setUserAdmin(adminData);
            const listaCitas = await getCitasByServicio(adminData.servicio);
            setCitas(listaCitas);
        } catch (err) {
            setErrorMsg(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logoutAdmin();
        setUserAdmin(null);
        setCitas([]);
    };

    // 🗑️ Función para eliminar una cita
    const handleEliminar = async (citaId, fecha, hora) => {
        if (window.confirm('¿Estás segura de que deseas eliminar esta cita? Se liberará el horario.')) {
            try {
                await eliminarCita(citaId, fecha, hora, userAdmin.servicio);
                // Actualizamos la lista local en pantalla
                setCitas(citas.filter((c) => c.id !== citaId));
            } catch (err) {
                alert('Error al eliminar la cita.');
            }
        }
    };

    if (!userAdmin) {
        return (
            <div className="admin-login-container">
                <h2>Panel de Administración</h2>
                <form onSubmit={handleLoginSubmit}>
                    {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
                    <input type="email" name="email" value={credentials.email} onChange={handleLoginChange} placeholder="Correo" required />
                    <input type="password" name="password" value={credentials.password} onChange={handleLoginChange} placeholder="Contraseña" required />
                    <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Iniciar Sesión'}</button>
                </form>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Bienvenida, {userAdmin.nombre}</h2>
                    <p>Especialidad: <strong>{userAdmin.servicio}</strong></p>
                </div>
                <button onClick={handleLogout}>Cerrar Sesión</button>
            </header>

            <h3>Gestión de Citas</h3>

            {citas.length === 0 ? (
                <p>No hay citas agendadas.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {citas.map((cita) => {
                            const estado = obtenerEstadoCita(cita);

                            let backgroundColor = '#d4edda';
                            let color = '#155724';

                            switch (estado) {
                                case 'Pendiente':
                                    backgroundColor = '#fff3cd';
                                    color = '#856404';
                                    break;

                                case 'Caducado':
                                    backgroundColor = '#f8d7da';
                                    color = '#721c24';
                                    break;

                                case 'Cancelada':
                                    backgroundColor = '#d6d8db';
                                    color = '#383d41';
                                    break;

                                case 'Completada':
                                    backgroundColor = '#d4edda';
                                    color = '#155724';
                                    break;

                                default:
                                    backgroundColor = '#d4edda';
                                    color = '#155724';
                            }

                            return (
                                <tr key={cita.id}>
                                    <td>{cita.nombreCompleto}</td>
                                    <td>{cita.correo}</td>
                                    <td>{cita.telefono}</td>
                                    <td>{cita.fecha}</td>
                                    <td>{cita.hora}</td>

                                    <td>
                                        <span
                                            style={{
                                                padding: '3px 8px',
                                                borderRadius: '4px',
                                                backgroundColor,
                                                color
                                            }}
                                        >
                                            {estado}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            onClick={() =>
                                                handleEliminar(
                                                    cita.id,
                                                    cita.fecha,
                                                    cita.hora
                                                )
                                            }
                                            style={{
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                padding: '5px 10px',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};