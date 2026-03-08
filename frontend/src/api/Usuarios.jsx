//Llamar api para CRUD de usuarios (técnicos y administradores)
import axios from "axios";

const API_URL = 'http://localhost:3000/usuarios';

export const obtenerUsuarios = async () => {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await axios.get(`${API_URL}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return respuesta.data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};

export const crearUsuario = async (usuarioData) => {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await axios.post(`${API_URL}/`, usuarioData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return respuesta.data;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

export const actualizarUsuario = async (id, usuarioData) => {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await axios.put(`${API_URL}/${id}`, usuarioData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return respuesta.data;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
};

export const eliminarUsuario = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await axios.delete(`${API_URL}/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return respuesta.data;
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
    }
};