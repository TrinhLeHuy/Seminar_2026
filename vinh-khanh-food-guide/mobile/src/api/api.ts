import axios from 'axios';

const API = axios.create({

  baseURL: 'http://192.168.66.11:8080/api',

  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
  },

});

export default API;