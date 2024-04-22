import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.0.164:3000',
  timeout: 1000,
  withCredentials: true,
});

export default function getApi() {
  return instance;
}