const rawUrl = import.meta.env.VITE_API_URL || 'https://vehicle-management-ofpw.onrender.com/api';

export const API_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

export const getToken = () => {
    return localStorage.getItem('token');
};
