import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase/config'; // Tu configuración de firebase

const auth = getAuth(app);
const db = getFirestore(app);

// Iniciar Sesión
export const loginAdmin = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Consultar perfil de la administradora para obtener su servicio asignado
    const docRef = doc(db, 'administradoras', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return {
            uid,
            email: userCredential.user.email,
            ...docSnap.data() // Trae 'nombre' y 'servicio'
        };
    } else {
        throw new Error('No tienes permisos de administradora.');
    }
};

// Cerrar Sesión
export const logoutAdmin = async () => {
    await signOut(auth);
};