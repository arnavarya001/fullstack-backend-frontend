export const API_URL = (import.meta.env.VITE_API_URL || 'https://vehicle-management-ofpw.onrender.com/api').replace(/\/+$/, '');

export const getToken = () => {
    return localStorage.getItem('token');
};
