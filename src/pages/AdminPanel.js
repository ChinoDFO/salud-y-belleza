import React, { useState } from 'react';
import { loginAdmin, logoutAdmin } from '../services/authService';
import { getCitasByServicio, eliminarCita } from '../services/citasService';
import '../AdminPanel.css';

export const AdminPanel = () => {
    const [userAdmin, setUserAdmin] = useState(null);
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [errorMsg, setErrorMsg] = useState('');

    const handleLoginChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const obtenerEstadoCita = (cita) => {
        if (cita.estado === 'cancelada') return 'Cancelada';
        if (cita.estado === 'completada') return 'Completada';

        const fechaHoraCita = new Date(
            `${cita.fecha}T${cita.hora}:00`
        );

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
            const adminData = await loginAdmin(
                credentials.email,
                credentials.password
            );

            setUserAdmin(adminData);

            const listaCitas = await getCitasByServicio(
                adminData.servicio
            );
            setCitas(listaCitas);
        } catch (err) {
            setErrorMsg(
                err.message || 'Error al iniciar sesión'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logoutAdmin();
        setUserAdmin(null);
        setCitas([]);
    };

    const handleEliminar = async (citaId, fecha, hora) => {
        if (
            window.confirm(
                '¿Estás segura de que deseas eliminar esta cita? Se liberará el horario.'
            )
        ) {
            try {
                await eliminarCita(
                    citaId,
                    fecha,
                    hora,
                    userAdmin.servicio
                );
                setCitas(
                    citas.filter((c) => c.id !== citaId)
                );

            } catch (err) {
                alert('Error al eliminar la cita.');
            }
        }
    };

    /*
    ==========================================
    LOGIN
    ==========================================
    */

    if (!userAdmin) {
        return (
            <div className="admin-login-container">
                <h2>Panel de Administración</h2>
                <form onSubmit={handleLoginSubmit}>

                    {errorMsg && (
                        <p className="error-message">
                            {errorMsg}
                        </p>
                    )}

                    <input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleLoginChange}
                        placeholder="Correo"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleLoginChange}
                        placeholder="Contraseña"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? 'Ingresando...'
                            : 'Iniciar Sesión'}
                    </button>

                </form>

            </div>
        );
    }

    /*
    ==========================================
    DASHBOARD
    ==========================================
    */

    return (
        <div className="admin-dashboard-container">

            <header>

                <div>
                    <h2>
                        Bienvenida, {userAdmin.nombre}
                    </h2>

                    <p>
                        Especialidad:{' '}
                        <strong>
                            {userAdmin.servicio}
                        </strong>
                    </p>
                </div>
                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </button>
            </header>
            <h3>Gestión de Citas</h3>

            {citas.length === 0 ? (
                <p className="no-citas">
                    No hay citas agendadas.
                </p>
            ) : (
                <div className="admin-table-container">
                    <table>
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
                                const estado =
                                    obtenerEstadoCita(cita);
                                return (
                                    <tr key={cita.id}>
                                        <td>
                                            {cita.nombreCompleto}
                                        </td>
                                        <td>
                                            {cita.correo}
                                        </td>
                                        <td>
                                            {cita.telefono}
                                        </td>
                                        <td>
                                            {cita.fecha}
                                        </td>
                                        <td>
                                            {cita.hora}
                                        </td>
                                        <td>
                                            <span
                                                className={`estado estado-${estado.toLowerCase()}`}
                                            >
                                                {estado}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleEliminar(
                                                        cita.id,
                                                        cita.fecha,
                                                        cita.hora
                                                    )
                                                }
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
