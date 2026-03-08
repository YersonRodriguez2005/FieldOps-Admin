import axios from 'axios';

const API_URL = 'http://localhost:3000/ordenes';

export const obtenerOrdenes = async () => {
    const token = localStorage.getItem('token');
    const respuesta = await axios.get(`${API_URL}/`, { headers: { 'Authorization': `Bearer ${token}` } });
    return respuesta.data;
};

export const crearOrden = async (ordenData) => {
    const token = localStorage.getItem('token');
    const respuesta = await axios.post(`${API_URL}/`, ordenData, { headers: { 'Authorization': `Bearer ${token}` } });
    return respuesta.data;
};

export const actualizarOrden = async (id, ordenData) => {
    const token = localStorage.getItem('token');
    const respuesta = await axios.put(`${API_URL}/${id}`, ordenData, { headers: { 'Authorization': `Bearer ${token}` } });
    return respuesta.data;
};

export const eliminarOrden = async (id) => {
    const token = localStorage.getItem('token');
    const respuesta = await axios.delete(`${API_URL}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
    return respuesta.data;
};