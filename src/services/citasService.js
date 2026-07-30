import { db } from '../firebase/config';
import { collection, doc, runTransaction, serverTimestamp, getDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';

export const obtenerHorariosDisponibles = async (fechaSeleccionada, servicioSeleccionado) => {
    if (!fechaSeleccionada || !servicioSeleccionado) return [];

    const fechaObj = new Date(`${fechaSeleccionada}T00:00:00`);
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const nombreDia = diasSemana[fechaObj.getDay()];

    const docConfig = await getDoc(doc(db, 'configuracion', 'horarioBase'));

    const horariosDelDia = docConfig.data()?.[nombreDia] || [];
    if (horariosDelDia.length === 0) return [];

    // 🔴 FILTRAMOS POR FECHA Y POR SERVICIO
    const q = query(
        collection(db, 'horariosOcupados'),
        where('fecha', '==', fechaSeleccionada),
        where('servicio', '==', servicioSeleccionado) // 👈 Solo bloquea las de ESTE servicio
    );

    const querySnapshot = await getDocs(q);
    const horasOcupadas = querySnapshot.docs.map((doc) => doc.data().hora);

    return horariosDelDia.filter((hora) => !horasOcupadas.includes(hora));
};



export const agendarCita = async (datosCita) => {
    try {
        await runTransaction(db, async (transaction) => {
            const nuevaCitaRef = doc(collection(db, 'citas'));
            const nuevoHorarioRef = doc(collection(db, 'horariosOcupados'));

            transaction.set(nuevaCitaRef, {
                nombreCompleto: datosCita.nombre,
                correo: datosCita.correo || '',
                telefono: datosCita.telefono,
                fecha: datosCita.fecha,
                hora: datosCita.hora,
                servicio: datosCita.servicio,
                notas: datosCita.notas || '',
                estado: 'pendiente',
                creadoEn: serverTimestamp()
            });

            transaction.set(nuevoHorarioRef, {
                fecha: datosCita.fecha,
                hora: datosCita.hora,
                servicio: datosCita.servicio, 
                citaId: nuevaCitaRef.id
            });
        });
        return { success: true };
    } catch (error) {
        console.error('error al guardar en firestore', error);
        throw error;
    }
};

// Consultar citas según el servicio de la administradora
export const getCitasByServicio = async (servicioAdmin) => {
    const citasRef = collection(db, 'citas');

    const q = query(
        citasRef,
        where('servicio', '==', servicioAdmin)
    );

    const querySnapshot = await getDocs(q);
    const citas = [];
    querySnapshot.forEach((doc) => {
        citas.push({ id: doc.id, ...doc.data() });
    });

    return citas;
};

export const eliminarCita = async (citaId, fecha, hora, servicio) => {
    try {
        // 1. Eliminar la cita de la colección 'citas'
        await deleteDoc(doc(db, 'citas', citaId));

        // 2. Buscar y eliminar el registro de horario ocupado para liberar la hora
        const q = query(
            collection(db, 'horariosOcupados'),
            where('fecha', '==', fecha),
            where('hora', '==', hora),
            where('servicio', '==', servicio)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (documento) => {
            await deleteDoc(doc(db, 'horariosOcupados', documento.id));
        });

        return { success: true };
    } catch (error) {
        console.error("Error al eliminar cita:", error);
        throw error;
    }
};