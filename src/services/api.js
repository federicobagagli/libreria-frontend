// src/services/api.js
import axios from 'axios';

// URL del backend su Azure
const API_URL = 'https://federico-azure-ms-12345.azurewebsites.net/api'; // Modifica con l'URL effettivo del tuo backend

// Creiamo un'istanza di axios con baseURL configurata
const api = axios.create({
  baseURL: API_URL, // Base URL per tutte le richieste API
  timeout: 10000,   // Timeout per le richieste (opzionale)
});

// Funzione per recuperare i libri
export const getBooks = () => api.get('/books');  // "/books" è l'endpoint per recuperare i libri

// Puoi aggiungere altre funzioni per altre API, ad esempio:
// export const createBook = (bookData) => api.post('/books', bookData);

export default api;
