import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:3331"
})
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Recupera o token do localStorage
    
    // Console.log para depuração (pode remover depois que funcionar)
    console.log('DEBUG Interceptor: Tentando anexar token. Token lido do localStorage:', token ? token.substring(0, 30) + '...' : 'NÃO ENCONTRADO'); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);