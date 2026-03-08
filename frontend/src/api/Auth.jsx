// Llamar a a la API para autenticación desde el frontend
//Datos: correo y contrasena
import axios from 'axios';

const API_URL = 'http://localhost:3000/auth/login'; 

export const login = async (correo, contrasena) => {
  try {
    const response = await axios.post(API_URL, { correo, contrasena });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

//Cerrar sesión (logout)
export const logout = () => {
  localStorage.removeItem('token');
}