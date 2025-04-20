import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/apiConfig'; // Vai un livello sopra e poi accedi alla cartella config


const FIELDS = ['titolo', 'autore', 'genere', 'anno'];

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleFieldToggle = (field) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (updated[field] !== undefined) {
        delete updated[field];
      } else {
        updated[field] = '';
      }
      return updated;
    });
  };

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: field === 'year' ? parseInt(value, 10) : value,
    }));
  };

  const handleVisualizza = async () => {
    const updatedFilters = {
      title: filters['titolo'] || '',   // Correzione nome campo da 'titolo' a 'title'
      author: filters['autore'] || '',   // Correzione nome campo da 'autore' a 'author'
      genre: filters['genere'] || '',    // Correzione nome campo da 'genere' a 'genre'
      year: filters['anno'] || '',       // Correzione nome campo da 'anno' a 'year'
    };
  
    try {
      console.log(updatedFilters);  // Aggiungi log per vedere i parametri inviati
      console.log('API_URL:', API_URL); 
      const response = await axios.get(`${API_URL}/books`, { params: updatedFilters });
      //const response = await axios.get('https://federico-azure-ms-12345.azurewebsites.net/api/books', { params: updatedFilters });
      setBooks(response.data);
    } catch (error) {
      console.error("Errore nella ricerca:", error);
      setBooks([]);
    } finally {
      setShowResults(true);
    }
  };
  

  const handleMostraTutti = async () => {
    try {
      const response = await axios.get(`${API_URL}/books/all`);
      setBooks(response.data);
    } catch (error) {
      console.error("Errore nel caricamento di tutti i libri:", error);
      setBooks([]);
    } finally {
      setShowResults(true);
    }
  };

  return (
    <div>
      <h2>Filtra per</h2>
      <div style={{ marginBottom: '15px' }}>
        {FIELDS.map((field) => (
          <div key={field} style={{ marginBottom: '10px' }}>
            <label>
              <input
                type="checkbox"
                checked={filters.hasOwnProperty(field)}
                onChange={() => handleFieldToggle(field)}
              />
              {field}
            </label>
            {filters.hasOwnProperty(field) && (
              <input
                type="text"
                placeholder={`Inserisci ${field}`}
                value={filters[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                style={{ marginLeft: '10px' }}
              />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={handleVisualizza}>Visualizza</button>

        <button
          onClick={handleMostraTutti}
          style={{
            backgroundColor: '#2ecc71',
            color: 'white',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '20px',
            cursor: 'pointer',
          }}
          title="Mostra tutti i libri"
        >
          All
        </button>
      </div>

      {showResults && books.length === 0 && <p>Nessun libro trovato.</p>}

      {showResults && books.length > 0 && (
        <ul style={{ marginTop: '20px' }}>
          {books.map((book) => (
            <li key={book.id}>
            {Object.entries(book).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
            <hr />
          </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewBooks;
