import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'Cache-Control': 'no-cache',
  Authorization: 'Bearer ' + token,
};

const instance = axios.create({
  baseURL: '/api',
  headers,
});

instance.interceptors.request.use((config) => {
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
        window.location.reload();
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);
export default instance;
