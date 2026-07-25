import { db } from '../firebase/config';
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { getDoc, query, where, getDocs } from 'firebase/firestore';

export const obtenerHorariosDisponibles = async (fechaSeleccionada) => {
    if (!fechaSeleccionada) return [];

    // 1. Obtener el día de la semana en español (ej. "lunes", "jueves")
    // Forzamos la zona horaria agregando T00:00:00
    const fechaObj = new Date(`${fechaSeleccionada}T00:00:00`);
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const nombreDia = diasSemana[fechaObj.getDay()];

    // 2. Traer la configuración del horario base desde Firestore
    const docConfig = await getDoc(doc(db, 'configuracion', 'horarioBase'));

    const horariosDelDia = docConfig.data()[nombreDia] || [];
    if(horariosDelDia.length === 0) return []; // Si no se trabaja ese día

    // 3. Consultar las horas ya ocupadas en la fecha seleccionada
    const q = query(
        collection(db, 'horariosOcupados'),
        where('fecha', '==', fechaSeleccionada)
    );

    const querySnapshot = await getDocs(q);
    const horasOcupadas = querySnapshot.docs.map((doc) => doc.data().hora);

    // 4. Filtrar los horarios que NO están ocupados
    const horasLibres = horariosDelDia.filter(
        (hora) => !horasOcupadas.includes(hora)
    );

    return horasLibres;
};

export const agendarCita = async (datosCita) => {
    try {
        await runTransaction(db, async (transaction) => {
            // 1. Crear referencias a nuevos documentos
            const nuevaCitaRef = doc(collection(db, 'citas'));
            const nuevoHorarioRef = doc(collection(db, 'horariosOcupados'));

            // 2. Guardar la cita (cumpliendo las reglas de Firestore)
            transaction.set(nuevaCitaRef, {
                nombreCompleto: datosCita.nombre,
                correo: datosCita.correo || '', // Asegura string para cumplir las reglas
                telefono: datosCita.telefono,
                fecha: datosCita.fecha,
                hora: datosCita.hora,
                servicio: datosCita.servicio,
                notas: datosCita.notas || '',
                estado: 'pendiente',
                creadoEn: serverTimestamp()
            })
            // 3. Bloquear el horario en horariosOcupados
            transaction.set(nuevoHorarioRef, {
                fecha: datosCita.fecha,
                hora: datosCita.hora,
                citaId: nuevaCitaRef.id
            });
        });
        return { success: true };
    } catch (error) {
        console.error('error al guardar en firestore', error);
        throw error;
    }

};