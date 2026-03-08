////Llamar api para CRUD y Patch para actualizar estado de equipos (técnicos y administradores)
import axios from "axios";

const API_URL = 'http://localhost:3000/equipos';

export const obtenerEquipos = async () => {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await axios.get(`${API_URL}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return respuesta.data;
    } catch (error) {
        console.error('Error al obtener equipos:', error);
        throw error;
    }
};

export const crearEquipo = async (equipoData) => {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await axios.post(`${API_URL}/`, equipoData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return respuesta.data;
    } catch (error) {
        console.error('Error al crear equipo:', error);
        throw error;
    }
};

export const actualizarEquipo = async (id, equipoData) => {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await axios.put(`${API_URL}/${id}`, equipoData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return respuesta.data;
    } catch (error) {
        console.error('Error al actualizar equipo:', error);
        throw error;
    }
};

export const eliminarEquipo = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await axios.delete(`${API_URL}/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return respuesta.data;
    } catch (error) {
        console.error('Error al eliminar equipo:', error);
        throw error;
    }
};

export const actualizarEstadoEquipo = async (id, nuevoEstado) => {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await axios.patch(`${API_URL}/${id}/estado`, { estado: nuevoEstado }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return respuesta.data;
    } catch (error) {
        console.error('Error al actualizar estado del equipo:', error);
        throw error;
    }
};
