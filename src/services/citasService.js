import { db } from '../firebase/config';
import { collection, doc, runTransaction, serverTimestamp, getDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';


export const obtenerHorariosDisponibles = async (fechaSeleccionada, servicio) => {
  if (!fechaSeleccionada || !servicio) return [];

  try {
    // 1. Obtener el día de la semana en español
    const fechaObj = new Date(`${fechaSeleccionada}T00:00:00`);
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const nombreDia = diasSemana[fechaObj.getDay()];

    // 2. Buscar en Firestore a la administradora del servicio
    const qAdmin = query(
      collection(db, 'administradoras'),
      where('servicio', '==', servicio)
    );
    const adminSnap = await getDocs(qAdmin);

    if (adminSnap.empty) return [];

    const adminData = adminSnap.docs[0].data();
    
    // Extraer horarios (asegurándonos de que sea un array)
    const horariosDelDia = adminData.horarios?.[nombreDia];

    if (!Array.isArray(horariosDelDia) || horariosDelDia.length === 0) {
      return []; // Si es un string o está vacío, no hay servicio ese día
    }

    // 3. Consultar las horas ya ocupadas en horariosOcupados
    const qOcupados = query(
      collection(db, 'horariosOcupados'),
      where('fecha', '==', fechaSeleccionada),
      where('servicio', '==', servicio)
    );
    const ocupadosSnap = await getDocs(qOcupados);
    const horasOcupadas = ocupadosSnap.docs.map((doc) => doc.data().hora);

    // 4. Retornar solo los horarios libres
    return horariosDelDia.filter((hora) => hora !== "" && !horasOcupadas.includes(hora));
  } catch (error) {
    console.error("Error al obtener horarios disponibles:", error);
    return [];
  }
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