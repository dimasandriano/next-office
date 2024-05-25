import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: '/api',
});

instance.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      Cookies.remove('token');
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);
export default instance;
